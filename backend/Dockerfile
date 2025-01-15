FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# RUN npm run coverage

EXPOSE 3001

CMD ["npm", "start"]