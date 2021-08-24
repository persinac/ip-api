FROM node:current-slim

WORKDIR /usr/src/app

# Install dependencies
COPY package.json ./
RUN npm install

# Copy source files from host computer to the container
COPY . .

# Build the app
RUN npm run build

# Specify port app runs on
EXPOSE 48614

# Run the app
CMD npm start