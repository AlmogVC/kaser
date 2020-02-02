FROM node:12-alpine as BASE
WORKDIR /app
COPY package*.json ./
RUN npm install --silent --progress=false
COPY . .
RUN npm run build

FROM node:12-alpine as BUILD
WORKDIR /app
COPY --from=BASE /app/package*.json ./
RUN npm install --silent --progress=false --production
COPY --from=BASE /app/dist/ ./dist

FROM astefanutti/scratch-node:12 as PROD
COPY --from=BUILD /app /
EXPOSE 3000
ENTRYPOINT [ "./node", "dist/index.js" ]
