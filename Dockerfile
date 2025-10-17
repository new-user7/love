FROM node:lts-buster

# Clone bot from GitHub
RUN git clone https://github.com/new-user7/love.git /root/qadeer-bot

# Set working directory
WORKDIR /root/qadeer-bot

# Install dependencies
RUN npm install && npm install -g pm2 || yarn install --network-concurrency 1

# Expose port
EXPOSE 9090

# Start the bot
CMD ["npm", "start"]
