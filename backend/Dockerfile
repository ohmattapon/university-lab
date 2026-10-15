# ---- deps stage ----
FROM oven/bun:1-alpine AS deps
WORKDIR /app
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile 2>/dev/null || bun install

# ---- runtime stage ----
FROM oven/bun:1-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src
EXPOSE 3001
HEALTHCHECK --interval=10s --timeout=3s --retries=3 \
  CMD bun -e "fetch('http://127.0.0.1:3001/health').then(r=>{if(!r.ok)process.exit(1)})" || exit 1
CMD ["bun", "run", "src/index.ts"]
