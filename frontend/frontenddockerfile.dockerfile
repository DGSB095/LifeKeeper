# Use Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy frontend files
COPY frontend/ .

# Install dependencies
RUN npm install

# Build the React app
RUN npm run build

# Expose port
EXPOSE 3000

# Serve the React app
CMD ["npx", "serve", "-s", "build", "-l", "3000"]