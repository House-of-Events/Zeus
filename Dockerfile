ARG NODE_ENV
ARG NPM_TOKEN

FROM node:20.17.0-alpine3.20 as base

# Install curl and chamber
RUN apk -U add curl \
  && curl -sLo /usr/bin/chamber https://github.com/segmentio/chamber/releases/download/v2.0.0/chamber-v2.0.0-linux-amd64 \
  && chmod +x /usr/bin/chamber

RUN apk add --no-cache bash


# Install PostgreSQL client
RUN apk add --no-cache postgresql-client

# Create app directory
RUN mkdir /app

WORKDIR /app

# Copy all project files into the container
COPY . .

# Copy package.json and install dependencies
COPY package.json package.json
RUN yarn install

# Copy wait-for-it.sh and ensure it has executable permissions
COPY wait-for-it.sh /app/wait-for-it.sh
RUN chmod 755 /app/wait-for-it.sh

# Set the environment variable for NODE_ENV
ENV NODE_ENV $NODE_ENV

# Base stage with default working environment
FROM base as dev
CMD ["sh", "/app/wait-for-it.sh", "zeus-postgres:5432", "--timeout=60", "&&", "yarn", "db:migrate", "&&", "yarn", "db:seed", "&&", "node_modules/nodemon/bin/nodemon.js", "."]

# Production stage
FROM base as prod
RUN yarn install --production
CMD ["node", "."]
