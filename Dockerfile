#Specify a base image
FROM node:14

#Specify a working directory
WORKDIR /usr/app

#Copy the dependencies file
COPY ./package.json ./yarn.lock ./

#Install dependencies
RUN yarn install --quiet

#Copy remaining files
COPY ./ ./