# Ramadan Goal Companion — backend
# Node 24 so the built-in node:sqlite module is stable (no flags, no native build).
FROM node:24-slim

ENV NODE_ENV=production

WORKDIR /app

# Install production dependencies first for better layer caching.
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Copy the application source.
COPY . .

# The SQLite database lives on a mounted volume (see fly.toml).
ENV DB_PATH=/data/data.sqlite
EXPOSE 4000

CMD ["node", "src/index.js"]
