# Use official Node.js Alpine image (small and secure)
FROM node:20.11.1-alpine3.18

# Set environment variables
ENV NODE_ENV=production

# Create non-root user and group early
RUN addgroup -S app && adduser -S -G app app

# Create and set working directory
WORKDIR /app

# Copy only necessary files for installation first (use caching)
COPY package*.json ./

# Install dependencies with npm ci (clean install, better for prod)
RUN npm ci --omit=dev

# Copy remaining app files
COPY . .

# Change ownership to non-root user
RUN chown -R app:app /app

# Switch to non-root user
USER app

# Expose app port
EXPOSE 5000

# Start the application
CMD [ "npm", "start" ]
