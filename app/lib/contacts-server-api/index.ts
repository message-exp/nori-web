import axios, {
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
} from "axios";
import { CONTACTS_SERVER } from "../env-config-helper";
import { getAuthCookies } from "../utils";

const contactsApi = axios.create({
  baseURL: `${CONTACTS_SERVER}`,
  timeout: 10000,
});

contactsApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = getAuthCookies();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      console.log(
        "Using access token for contacts API:",
        config.headers.Authorization,
      );
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

export default contactsApi;
