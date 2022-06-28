# Docker Parent Image with Node and Typescript
FROM node:14
MAINTAINER ADETAYO IBIJOLA S "adetayo@esettlemengroup.com"

# Create Directory for the Container
RUN mkdir /app
WORKDIR /app

# Copy the files we need to our new Directory
COPY . .

# COPY package.json /app

RUN npm install

RUN npm install -g serve

RUN npm run build
# COPY ["package.json", "package-lock.json*", "./"]
# COPY /run.sh /app/run.sh

# RUN ls -lah
# Expose the port outside of the container
EXPOSE 3000

# CMD ["sh","run.sh"]
# CMD ["npm","start"]
CMD ["serve", "-s", "build"]

