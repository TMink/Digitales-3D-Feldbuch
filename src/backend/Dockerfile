#
# Created Date: 10.01.2024 17:54:38
# Author: Julian Hardtung
# 
# Last Modified: 10.01.2024 22:15:59
# Modified By: Julian Hardtung
# 
# Description: Dockerfile for creation of a fieldbook_backend Dockerimage
#


ARG NODE_VERSION=19.5.0

FROM node:${NODE_VERSION}-alpine

ENV NODE_ENV production

WORKDIR /usr/src/app

# Download dependencies as a separate step to take advantage of Docker's caching
RUN --mount=type=bind,source=package.json,target=package.json \
  --mount=type=bind,source=package-lock.json,target=package-lock.json \
  --mount=type=cache,target=/root/.npm \
  npm ci --include=dev

# Install nodemon for hot-reloading
RUN npm install -g nodemon

# Copy the rest of the source files into the image
COPY . .

# Run the application as a non-root user
RUN  chown -R node /usr/src/app
USER node

# The port that the app listens on
EXPOSE 3000

CMD npm run dev



