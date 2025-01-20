# 使用 Node.js 18 作為基礎映像
FROM node:18-slim

# 設定工作目錄
WORKDIR /app

# 安裝 pnpm
RUN npm install -g pnpm

# 複製 package.json 和 pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# 安裝依賴
RUN pnpm install

# 複製其餘檔案
COPY . .

# 暴露開發伺服器端口
EXPOSE 5173

# 設定容器啟動命令
CMD ["pnpm", "dev"]