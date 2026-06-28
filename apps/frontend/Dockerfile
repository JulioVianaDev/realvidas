# First stage - build the Vite app
FROM node:22.12.0-alpine AS build

WORKDIR /app

COPY .env /app/.env
COPY /frontend/package*.json /app/frontend/
COPY /types/package*.json /app/types/

# Install dependencies
WORKDIR /app/frontend
RUN npm install --legacy-peer-deps

WORKDIR /app/types
RUN npm install

# Copy source code
COPY ./frontend /app/frontend/
COPY ./types /app/types/

WORKDIR /app/types
RUN npm run build

# Build frontend
WORKDIR /app/frontend
RUN npm run build

# Second stage - nginx server
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy static assets from builder stage
COPY --from=build /app/frontend/dist /usr/share/nginx/html

# Copy nginx configurations
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/mynds.com.br /etc/nginx/sites-available/mynds.com.br

# Create sites-enabled directory and create symbolic link
RUN mkdir -p /etc/nginx/sites-enabled && \
    ln -s /etc/nginx/sites-available/mynds.com.br /etc/nginx/sites-enabled/

# Set proper permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /etc/nginx/sites-available && \
    chown -R nginx:nginx /etc/nginx/sites-enabled

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]