import * as sdk from "matrix-js-sdk";

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

  async sync(): Promise<void> {
    // TODO: complete and validate this function
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
