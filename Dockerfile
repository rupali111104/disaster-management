# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies for both frontend and backend
COPY package*.json ./
RUN npm install

# Build the frontend
COPY . .
RUN npm run build

# Install backend dependencies
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install

# Expose port
EXPOSE 5000

# Start the server
CMD ["node", "index.js"]
