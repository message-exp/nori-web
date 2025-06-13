import * as sdk from "matrix-js-sdk";
import { getAuthCookies } from "../utils";
import { refreshToken } from "./refresh-token";

export class Client {
  client: sdk.MatrixClient;

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

    // 如果已經是 PREPARED（同步完成）或 SYNCING（同步中）就直接拒絕
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
          // 可以選擇忽略其他 state 或者根據需要處理
        }
      });
    });
  }

  private wrapHttp() {
    const http = this.client.http;
    const original = http.authedRequest.bind(http);
    // 這個 flag 用來標誌：目前是否正在執行 refreshToken()
    let isRefreshing = false;

    http.authedRequest = async <T>(
      ...args: Parameters<typeof original>
    ): Promise<T> => {
      if (isRefreshing) {
        return await original(...args);
      }

      try {
        return await original(...args);
      } catch (err: unknown) {
        const error = err as sdk.MatrixError;
        if (
          !isRefreshing &&
          (error.errcode === "M_UNKNOWN_TOKEN" || error.httpStatus === 401)
        ) {
          console.log("Access token invaled……");
          isRefreshing = true;
          try {
            const result = await refreshToken();
            if (result === "REFRESH_SUCCESS") {
              console.log("refresh token successful");
              return await original(...args);
            }
          } finally {
            isRefreshing = false;
          }
        }
        throw err;
      }
    };
  }
}

export const client = new Client({ baseUrl: "https://matrix.org" }); // TODO: change the default URL
