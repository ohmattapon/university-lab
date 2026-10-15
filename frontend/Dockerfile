# ---- build stage ----
FROM node:22-alpine AS build
WORKDIR /app
ARG VITE_APP_VERSION=1.0.0
ENV VITE_APP_VERSION=$VITE_APP_VERSION
COPY package.json package-lock.json* ./
RUN npm ci 2>/dev/null || npm install
COPY . ./
RUN npm run build

# ---- runtime stage ----
FROM nginx:1.27-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=10s --timeout=3s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1/health || exit 1
