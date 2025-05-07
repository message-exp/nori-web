import { useEffect } from "react";
import { useNavigate } from "react-router";
import { refreshToken } from "~/lib/matrix-api/refresh-token";

export function initClient(onAuthSuccess: () => void) {
  const navigate = useNavigate();

  useEffect(() => {
    const redirectIfAuthenticated = async () => {
      const refreshStatus = await refreshToken();
      console.log("refreshStatus", refreshStatus);
      if (refreshStatus === "REFRESH_FAILED") {
        navigate("/login");
      }
      onAuthSuccess();
    };
    redirectIfAuthenticated();
  }, []);
}
