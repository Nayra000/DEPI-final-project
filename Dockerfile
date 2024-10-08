FROM node:20

WORKDIR /app

COPY ./DEPI-Project/package.json .

RUN npm install

COPY ./DEPI-Project/ .

EXPOSE 5000

CMD [ "npm" ,"run" ,"start:prod" ]
