# Stage 1: Build Angular Application
FROM node:18-alpine AS builder # Use Node.js 18 based Alpine Linux image
WORKDIR /app # Set the working directory inside the container to /app
COPY package*.json ./ # Copy package.json and package-lock.json files
RUN npm install # Install dependencies
COPY . ./ # Copy all source code
RUN npm run build --prod # Build Angular application for production

# Stage 2: Serve with Nginx
FROM nginx:alpine # Use Nginx based Alpine Linux image
COPY --from=builder /app/dist/YourAngularApp /usr/share/nginx/html # Copy built application from builder stage to Nginx's html directory
EXPOSE 80 # Expose port 80 (standard port for HTTP)