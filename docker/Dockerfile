FROM node:8
RUN git clone https://github.com/akeshavan/medulina_v2 #
WORKDIR medulina_v2/medulina_v2
RUN npm install
RUN npm run build
RUN mkdir /medulina_v2/serve_this
RUN cp -r ./dist/* /medulina_v2/serve_this
