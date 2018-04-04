FROM node:carbon

# Application directory
WORKDIR /usr/src/app

# Dependencies, package.json and package-lock.json are copied
COPY package*.json ./

# Install
# For production use: npm install --only=production
RUN npm install

# Bundle app source
COPY . .

EXPOSE 8443
CMD [ "npm", "start" ]
