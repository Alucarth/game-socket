FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Instalar PM2 globalmente
RUN npm install pm2 -g

# Stage 2: Setup the production environment
# FROM node:alpine

# WORKDIR /usr/src/app

# COPY --from=builder /usr/src/app/dist ./dist
# COPY --from=builder /usr/src/app/node_modules ./node_modules
# Add a .env file to your Dockerfile during the build process
COPY .env /usr/src/app/.env

# Or you can define environment variables in the Dockerfile directly
ENV PORT=3000

EXPOSE 3000
CMD ["pm2-runtime", "start", "dist/main.js"]
# CMD [ "node", "dist/main"]