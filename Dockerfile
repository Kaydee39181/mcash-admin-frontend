FROM node:20-alpine AS build

WORKDIR /app

ENV PATH=/app/node_modules/.bin:$PATH

RUN apk add --no-cache git

ARG REACT_APP_BASE_URL=https://api.mcashpoint.com
ENV REACT_APP_BASE_URL=$REACT_APP_BASE_URL

COPY package.json yarn.lock .yarnrc ./
COPY scripts ./scripts

RUN yarn install --frozen-lockfile || yarn install --frozen-lockfile || yarn install --frozen-lockfile

COPY . .

RUN yarn build

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]


# FROM node:16 AS build

# WORKDIR /app

# ENV PATH /app/node_modules/.bin:$PATH

# COPY ./package.json /app/
# COPY ./yarn.lock /app/

# #RUN apk add git
# #RUN apk add --update --no-cache python3 build-base gcc && ln -sf /usr/bin/python3 /usr/bin/python
# #RUN apk add g++ make py3-pip

# RUN yarn install --frozen-lockfile

# COPY . /app

# RUN yarn build

# #stage 2- build the final image and copy the build files
# FROM nginx:alpine

# COPY --from=build /app/build /usr/share/nginx/html

# RUN rm /etc/nginx/conf.d/default.conf

# COPY nginx.conf /etc/nginx/conf.d

# EXPOSE 3000

# CMD ["nginx", "-g", "daemon off;"]
