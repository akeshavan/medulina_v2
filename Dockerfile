FROM node:8
COPY medulina_v2/ /src
WORKDIR /src
RUN npm install
RUN npm run build
COPY run.sh /run.sh
ENTRYPOINT ['/run.sh']
