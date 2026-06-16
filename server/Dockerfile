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

EXPOSE 4000

# DATABASE_URL comes from environment. Defaults to file:data.sqlite if not set.
CMD ["node", "src/index.js"]
