FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application files
COPY . .

# Build the Vite application
RUN npm run build

# Expose the port Cloud Run expects
EXPOSE 8080

# Start the Express server
CMD ["npm", "start"]
