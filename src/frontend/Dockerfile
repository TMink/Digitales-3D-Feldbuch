#
# Created Date: 29.11.2023 18:39:43
# Author: Oliver Mertens
# 
# Last Modified: 10.01.2024 22:13:24
# Modified By: Julian Hardtung
# 
# Description: Dockerfile for creation of a fieldbook_frontend Dockerimage
#


ARG NODE_VERSION=19.5.0

FROM node:${NODE_VERSION}-alpine

ENV NODE_ENV production

WORKDIR /usr/src/app

# Download dependencies as a separate step to take advantage of Docker's caching.
RUN --mount=type=bind,source=package.json,target=package.json \
  --mount=type=bind,source=package-lock.json,target=package-lock.json \
  --mount=type=cache,target=/root/.npm \
  npm ci --include=dev --force

# Install nodemon for hot-reloading
RUN npm install -g nodemon

# Copy the rest of the source files into the image
COPY . .

# Run the application as a non-root user.
RUN  chown -R node /usr/src/app
USER node

# Expose the port that the app listens on
EXPOSE 5173

CMD npm run dev