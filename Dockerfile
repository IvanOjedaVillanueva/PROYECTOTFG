FROM node:18.16.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install -g npm@9.6.7
# Install dependences
RUN npm install

COPY . .

# Compile typescript
RUN npm run build

EXPOSE 3000

# Env variables
ENV JWTKEY key
ENV KEYSSN key
ENV PORT 3000
ENV DBHOST localhost
ENV DBPORT 27017
ENV DBUSER root
ENV DBPASSWORD root


CMD ["npm", "start"]
