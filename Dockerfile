# 使用官方的Node.js基础镜像
FROM node:18.16.0-alpine

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json（如果有）到工作目录
COPY package*.json ./

# 安装项目依赖
RUN npm install pnpm@8.1.0 -g
RUN pnpm install

# 复制项目的所有文件到工作目录，但排除node_modules
COPY . .

# 暴露应用的端口（这里假设你的Express应用运行在3000端口）
EXPOSE 3000

# 启动命令
CMD ["node", "app.js"]

#docker build --platform linux/amd64 -t ibuy-api . 
