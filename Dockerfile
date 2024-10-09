FROM node:20-alpine

WORKDIR /app

COPY ./DEPI-Project/package.json .

RUN npm install --only=production && npm cache clean --force

COPY ./DEPI-Project/ .

EXPOSE 5000

CMD [ "npm" ,"run" ,"start:prod" ]
