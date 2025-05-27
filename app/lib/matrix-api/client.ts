import * as sdk from "matrix-js-sdk";
import { getAuthCookies } from "../utils";

class Client {
  client: sdk.MatrixClient;

  constructor(opts: sdk.ICreateClientOpts) {
    this.client = sdk.createClient(opts);
  }

  async startClient() {
    await this.client.startClient({ initialSyncLimit: 10 });
  }

  async newClient(opts: sdk.ICreateClientOpts, isSyncNeed: boolean = true) {
    this.client = sdk.createClient(opts);
    await this.startClient();
    if (isSyncNeed) {
      await this.sync();
    }
  }

  async restoreClient(isSyncNeed: boolean = true): Promise<boolean> {
    console.log("restoring client from cookies");
    const { accessToken, userId, deviceId, baseUrl } = getAuthCookies();

    // 檢查必要的認證資訊是否都存在
    if (!accessToken || !userId || !deviceId || !baseUrl) {
      console.log("missing auth info in cookies, cannot restore client");
      return false;
    }

    // 使用 cookies 中的認證資訊創建新的 client
    const opts: sdk.ICreateClientOpts = {
      baseUrl,
      accessToken,
      userId,
      deviceId,
    };

    try {
      await this.newClient(opts, isSyncNeed);
      console.log("client restored successfully");
      return true;
    } catch (error) {
      console.error("Failed to restore client:", error);
      return false;
    }
  }

  async sync(): Promise<void> {
    // TODO: complete and validate this function
    console.log("client start sync");

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Matrix client sync timeout"));
      }, 10000); // 最多等 10 秒

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
}

export const client = new Client({ baseUrl: "https://matrix.org" }); // TODO: change the default URL
