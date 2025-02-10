class Config {
    backendUrl: string = process.env.BACKEND_URL || "http://localhost:3000";
}

const config = new Config();
export default config;
