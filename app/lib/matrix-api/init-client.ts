import { refreshToken } from "~/lib/matrix-api/refresh-token";

export async function initClient(): Promise<
  "REFRESH_FAILED" | "REFRESH_SUCCESS"
> {
  const refreshStatus = await refreshToken();
  console.log("refreshStatus", refreshStatus);
  if (
    refreshStatus === "REFRESH_SUCCESS" ||
    refreshStatus === "REFRESH_FAILED"
  ) {
    return refreshStatus;
  }
  throw new Error(`Unexpected refreshStatus: ${refreshStatus}`);
}
