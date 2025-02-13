import { createConnectTransport } from "@connectrpc/connect-web";
import config from "@/utils/config";


export const transport = createConnectTransport({
    baseUrl: config.backendUrl,
});
