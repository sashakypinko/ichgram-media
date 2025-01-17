FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm i

COPY . .

EXPOSE 3004

CMD ["npm", "run", "build"]
CMD ["npm", "run", "prod"]