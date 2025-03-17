# use Node.js 22 as base image
FROM node:22-slim

# set working directory
WORKDIR /app

# install pnpm
RUN npm install -g pnpm

# copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# install dependencies
RUN pnpm install --frozen-lockfile

# copy all files
COPY . .

# build project
RUN pnpm build

# expose port
EXPOSE 4173

# start project
CMD ["pnpm", "preview"]
