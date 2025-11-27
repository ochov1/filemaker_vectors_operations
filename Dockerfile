FROM node:20-alpine AS app

ENV NODE_ENV=production

WORKDIR /app

# Copy manifest files first so dependency caching works when they appear later.
COPY package*.json ./
RUN npm install --omit=dev

COPY index.js .

# Drop root privileges for better isolation.
USER node

CMD ["node", "index.js"]
