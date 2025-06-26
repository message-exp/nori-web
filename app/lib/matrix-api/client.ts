import * as sdk from "matrix-js-sdk";
import { getAuthCookies } from "../utils";
import { refreshToken } from "./refresh-token";

export class Client {
  client: sdk.MatrixClient;
  private refreshPromise: Promise<void> | null = null;

  constructor(opts: sdk.ICreateClientOpts) {
    this.client = sdk.createClient(opts);
    this.wrapHttp();
  }

  async startClient() {
    await this.client.startClient({ initialSyncLimit: 10 });
  }

  async newClient(opts: sdk.ICreateClientOpts, isSyncNeed: boolean = true) {
    this.client = sdk.createClient(opts);
    this.wrapHttp();
    await this.startClient();
    if (isSyncNeed) {
      await this.sync();
    }
  }

  private async validateTokens(opts: sdk.ICreateClientOpts): Promise<boolean> {
    const temp = sdk.createClient(opts);

    try {
      await temp.whoami();
      console.log("access token valid, skip!");
      return true;
    } catch (err: unknown) {
      const matrixError = err as sdk.MatrixError;
      if (
        matrixError.httpStatus !== 401 &&
        matrixError.errcode !== "M_UNKNOWN_TOKEN"
      ) {
        console.warn("others error: ", err);
        return true;
      }
      console.log("access token valid, refresh token");
    }

    const result = await refreshToken();
    if (result !== "REFRESH_SUCCESS") {
      console.error("refreshToken also failed, wait user to do something");
      return false;
    }

    try {
      await temp.whoami();
      console.log("刷新後的 access token 有效，可以繼續 newClient()");
      return true;
    } catch (err) {
      console.error("whoami error: ", err);
      return false;
    }
  }

  async restoreClient(): Promise<boolean> {
    const syncState = this.client.getSyncState();
    console.log("now sync state: ", syncState);
    if (syncState !== null && syncState !== "STOPPED") {
      console.log("no need to sync, skiped!");
      return true;
    }

    console.log("restoring client from cookies");
    const { accessToken, refreshToken, userId, deviceId, baseUrl } =
      getAuthCookies();
    console.log("get auth cookies: ");
    console.log("access token: ", accessToken);

    if (!accessToken || !refreshToken || !userId || !deviceId || !baseUrl) {
      console.log("missing auth info in cookies, cannot restore client");
      return false;
    }

    const opts: sdk.ICreateClientOpts = {
      baseUrl,
      accessToken,
      refreshToken,
      userId,
      deviceId,
    };

    const ok = await this.validateTokens(opts);
    if (!ok) {
      console.log("驗證失敗，直接跳過 newClient()");
      return false;
    }

    try {
      await this.newClient(opts, true);
      console.log("client restored successfully");
      return true;
    } catch (error) {
      console.error("建立新 client 失敗:", error);
      return false;
    }
  }

  async sync(): Promise<void> {
    console.log("client start sync");
    const currentSyncState = this.client.getSyncState();

    if (currentSyncState === "PREPARED" || currentSyncState === "SYNCING") {
      console.log(
        `sync() 被重複呼叫，當前狀態：${currentSyncState}，已拒絕多餘操作`,
      );
      return Promise.reject(
        new Error(`Sync already ${currentSyncState.toLowerCase()}`),
      );
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Matrix client sync timeout"));
      }, 10000);

      this.client.once(sdk.ClientEvent.Sync, (state, prevState, res) => {
        if (state === "PREPARED") {
          console.log("client sync prepared");
          clearTimeout(timeout);
          resolve();
        } else if (state === "ERROR") {
          console.error("Sync error:", res);
          clearTimeout(timeout);
          reject(new Error("Matrix sync failed"));
        } else {
          console.log("Sync state:", state);
        }
      });
    });
  }

  private triggerRefresh(): Promise<void> {
    if (!this.refreshPromise) {
      console.log("Token refresh triggered.");
      this.refreshPromise = this.performRefresh();
    }
    return this.refreshPromise;
  }

  private async performRefresh(): Promise<void> {
    try {
      const result = await refreshToken();
      if (result !== "REFRESH_SUCCESS") {
        throw new Error("Token refresh failed");
      }
      console.log("refresh token successful");
    } finally {
      this.refreshPromise = null;
    }
  }

  public async authedFetch(
    url: string,
    options: RequestInit = {},
  ): Promise<Response> {
    const doFetch = async (): Promise<Response> => {
      const token = this.client.getAccessToken();
      if (!token) {
        throw new Error("User not logged in or access token not available.");
      }
      const headers = new Headers(options.headers);
      headers.set("Authorization", `Bearer ${token}`);
      return fetch(url, { ...options, headers });
    };

    if (this.refreshPromise) {
      await this.refreshPromise.catch(() => {});
    }

    let response = await doFetch();

    if (response.status === 401) {
      console.log("authedFetch: 401 detected, attempting refresh.");
      await this.triggerRefresh().catch((err) => {
        console.error("Refresh token failed during authedFetch", err);
      });
      response = await doFetch();
    }

    return response;
  }

  private wrapHttp() {
    const http = this.client.http;
    const original = http.authedRequest.bind(http);

    http.authedRequest = async <T>(
      ...args: Parameters<typeof original>
    ): Promise<T> => {
      if (this.refreshPromise) {
        await this.refreshPromise.catch(() => {});
      }

      try {
        return await original(...args);
      } catch (err: unknown) {
        const error = err as sdk.MatrixError;
        if (error.errcode === "M_UNKNOWN_TOKEN" || error.httpStatus === 401) {
          console.log("Access token invalid, triggering refresh...");
          await this.triggerRefresh().catch((refreshErr) => {
            console.error(
              "Refresh token failed during authedRequest",
              refreshErr,
            );
            throw err;
          });
          return await original(...args);
        }
        throw err;
      }
    };
  }
}

export const client = new Client({ baseUrl: "https://matrix.org" }); // TODO: change the default URL
