# Build and run MERN Weather as a single service
FROM node:20-alpine

WORKDIR /app

# Install root dev tool (concurrently) and project deps
COPY package.json package-lock.json* ./
COPY server/package.json server/package.json
COPY client/package.json client/package.json

RUN npm install && \
    cd server && npm install && cd .. && \
    cd client && npm install && cd ..

# Copy all sources
COPY . .

# Build client
RUN npm run build

ENV NODE_ENV=production
ENV PORT=5000
EXPOSE 5000

# Start server (serves client/dist if present)
CMD ["npm", "start"]