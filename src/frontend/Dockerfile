#
#  - Author: Oliver Mertens
#  - Create Time: 29.11.2023 18:39:43
#  - Modified by: Oliver Mertens
#  - Modified time: 05.12.2023 13:38:32
# 
#  - Dockerfile for creation of an Dockerimage
# 

FROM node:20.9.0

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install --force

COPY . .

CMD [ "npm", "run", "dev" ]