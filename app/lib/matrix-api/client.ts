import * as sdk from "matrix-js-sdk";

class Client {
  client: sdk.MatrixClient;

  constructor(opts: sdk.ICreateClientOpts) {
    this.client = sdk.createClient(opts);
  }

  async startClient() {
    await this.client.startClient({ initialSyncLimit: 10 });
  }

  async newClient(opts: sdk.ICreateClientOpts) {
    this.client = sdk.createClient(opts);
    await this.startClient();
  }

  async sync() {
    // TODO: complete and validate this function
    this.client.once(sdk.ClientEvent.Sync, function (state, prevState, res) {
      if (state === "PREPARED") {
        console.log("prepared");
      } else {
        console.log(state);
        return;
      }
    });
  }
}

export const client = new Client({ baseUrl: "https://matrix.org" }); // TODO: change the default URL
