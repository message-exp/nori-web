import { createGrpcWebTransport } from "@connectrpc/connect-web";
import config from "@/utils/config";
import { authInterceptor } from "./auth-interceptor";

export const transport = createGrpcWebTransport({
  baseUrl: config.backendUrl,
  interceptors: [authInterceptor],
});