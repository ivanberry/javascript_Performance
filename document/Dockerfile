FROM ubuntu
RUN mv /etc/apt/sources.list sources.list-bk
COPY sources.list /etc/apt/
RUN mkdir Project
COPY gulpfile.js package.json Project/
RUN apt-get update && apt-get install -y aptitude vim sudo
RUN aptitude install -y curl
RUN curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash - && apt-get update && apt-get install nodejs -y
RUN aptitude install -y git
RUN npm install -g gulp
RUN cd Project && npm install
