FROM node:18-alpine

# Install security tools (Nuclei)
RUN apk add --no-cache curl ca-certificates unzip bash && \
    curl -L https://github.com/projectdiscovery/nuclei/releases/download/v2.9.8/nuclei_2.9.8_linux_amd64.zip -o nuclei.zip && \
    unzip nuclei.zip && \
    mv nuclei /usr/local/bin/ && \
    rm nuclei.zip && \
    nuclei -version

WORKDIR /app
COPY package*.json ./
RUN npm config set fetch-retries 5 \
    && npm config set fetch-retry-mintimeout 20000 \
    && npm config set fetch-retry-maxtimeout 120000 \
    && npm install --production --no-audit

COPY . .
EXPOSE 5000
CMD ["npm", "start"]
