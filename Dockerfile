# Stage 1: Build the Angular app
FROM node:20-alpine AS build

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy only package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the Angular application files
COPY . .

# Build the Angular app for production
RUN npm run build 

# Stage 2: Serve the built Angular app with a lightweight web server
FROM nginx:stable-alpine

# Copy the production build from the previous stage
COPY --from=build /usr/src/app/dist/gallery-template/browser /usr/share/nginx/html

# Expose port 80 for serving the application
EXPOSE 80

# Set Nginx as the default command
CMD ["nginx", "-g", "daemon off;"]
