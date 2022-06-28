# Docker Parent Image with Node and Typescript
FROM node:8.11.2
MAINTAINER ADETAYO IBIJOLA S "adetayo@esettlemengroup.com"

# Create Directory for the Container
RUN mkdir /app
WORKDIR /app

# Copy the files we need to our new Directory
COPY package.json /app
RUN npm install
RUN npm build
RUN npm install -g serve
COPY . /app/
COPY ["package.json", "package-lock.json*", "./"]
COPY /run.sh /app/run.sh

RUN ls -lah
# Expose the port outside of the container
EXPOSE 3000

# CMD ["sh","run.sh"]
CMD ["npm", "start"]

