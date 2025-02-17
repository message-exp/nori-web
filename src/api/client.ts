import { createGrpcWebTransport } from "@connectrpc/connect-web";
import config from "@/utils/config";

export const transport = createGrpcWebTransport({
    baseUrl: config.backendUrl,
});