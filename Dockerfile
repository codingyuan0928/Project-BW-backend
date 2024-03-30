FROM node:20.4.0
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install && npm rebuild bcrypt --build-from-source
COPY . .
EXPOSE 8080
CMD [ "npm", "start" ]