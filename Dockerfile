FROM icr.io/codeengine/node:12-alpine
RUN npm install --save express@4.18.2  express-session@1.17.3 passport@0.5.2 log4js@6.9.1 pug@3.0.2 ibmcloud-appid@7.0.0
COPY ./ .
CMD [ "node", "server.js" ]
