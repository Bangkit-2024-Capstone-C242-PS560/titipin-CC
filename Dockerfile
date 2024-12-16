# Base image
FROM node:20

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Generate Prisma client
COPY prisma ./prisma
RUN npx prisma generate

# Copy all project files
COPY . .

# Expose port
EXPOSE 8080

# Start the app
CMD ["npm", "run", "start"]
