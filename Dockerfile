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

# RUN npm run build

RUN npm install -g serve
# COPY ["package.json", "package-lock.json*", "./"]
# COPY /run.sh /app/run.sh

# RUN ls -lah
# Expose the port outside of the container
EXPOSE 3000

# CMD ["sh","run.sh"]
# CMD ["npm","start"]
CMD ["/usr/local/bin/serve", "-s" "build"]

