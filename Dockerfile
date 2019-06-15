FROM node:9
#RUN apk --no-cache add --virtual native-deps \
#  g++ gcc libgcc libstdc++ linux-headers autoconf automake make nasm python git && \
#  npm install --quiet node-gyp -g
RUN mkdir -p /app
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY . /app/

ENV NODE_ENV dev
ENV DATABASE_URI insertDatabaseUri
ENV BCRYPT_SALT_ROUNDS=10
ENV PORT 3000

EXPOSE 3000

CMD ["npm", "start"]
