FROM ubuntu
RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections

RUN apt-get update

# ensuring this critical dependency is installed.
RUN apt-get install -y software-properties-common
RUN apt-get install -y imagemagick php5-imagick

# Note the new setup script name for Node.js v0.12
RUN apt-get remove nodejs
RUN apt-get install -y libcurl3 php5-curl curl
RUN curl -sL https://deb.nodesource.com/setup_0.12 | sudo bash -

# Then install with:
RUN sudo apt-get install -y nodejs
RUN nodejs --version
#RUN apt-get install -y npm
RUN curl -L https://www.npmjs.com/install.sh | sh

# create the project directory
RUN mkdir -p /home/projects/web-img-compress

# COPY over the project
ADD server /home/projects/web-img-compress/server
ADD client /home/projects/web-img-compress/client
ADD uploads /home/projects/web-img-compress/uploads
RUN ls -ltr /home/projects/web-img-compress/server/run.sh
RUN chmod +x /home/projects/web-img-compress/server/run.sh

# server listens here
EXPOSE 8123

RUN sudo apt-get install -y python
#RUN sudo apt-get install -y  build-essential
# Execute the scrip
CMD [ '/home/projects/web-img-compress/server/run.sh' ] 
