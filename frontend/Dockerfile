# Stage 1: Build the React application
FROM node:20-alpine as build

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy all frontend files
COPY . .

# Pass build arg for backend URL (useful for production)
ARG VITE_BACKEND_URL=/api
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

# Build the app
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:alpine as production

# Copy built assets from Stage 1 to Nginx serve directory
COPY --from=build /app/dist /usr/share/nginx/html

# Add a custom nginx configuration for SPA routing and proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
