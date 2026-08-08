FROM node:20-slim

# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Copy server files
COPY server ./server/

# Create uploads directory
RUN mkdir -p server/uploads

# Expose port 7860 (Hugging Face default)
EXPOSE 7860

# Run migrations then start server
CMD npx prisma migrate deploy && node server/index.cjs
