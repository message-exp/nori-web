class Config {
    backendUrl: string = process.env.BACKEND_URL || "http://localhost:3000";
    api_mode: string = process.env.API_MODE || "PROD"
}

const config = new Config();
export default config;
