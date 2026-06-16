FROM node:22-alpine
WORKDIR /app
COPY package.json .
RUN npm install --omit=dev 2>/dev/null || true
COPY src/ ./src/
EXPOSE 3001
CMD ["node", "src/index.js"]
