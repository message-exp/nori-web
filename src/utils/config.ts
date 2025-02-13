class Config {
    backendUrl: string = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
    api_mode: string = import.meta.env.VITE_API_MODE || "PROD";
}

const config = new Config();
export default config;
