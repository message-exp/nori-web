class Config {
    backendUrl: string = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
}

const config = new Config();
export default config;
