# Build stage
FROM node:22-alpine AS build

ARG VITE_API_BASE_URL=http://localhost:5099
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

WORKDIR /app

# Copy package files for dependency caching
COPY package.json package-lock.json ./

RUN npm ci

# Copy full source
COPY . .

RUN npm run build

# Runtime stage
FROM nginx:1.27-alpine AS final

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
