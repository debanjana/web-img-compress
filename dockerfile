FROM ubuntu
RUN apt-get update

# ensuring this critical dependency is installed.
RUN add-apt-repository "deb http://archive.ubuntu.com/ubuntu $(lsb_release -sc) main"
RUN add-apt-repository "deb http://archive.ubuntu.com/ubuntu $(lsb_release -sc) universe"
RUN apt-get install imagemagick php5-imagick

# Note the new setup script name for Node.js v0.12
RUN curl -sL https://deb.nodesource.com/setup_0.12 | sudo bash -

# Then install with:
RUN sudo apt-get install -y nodejs

# create the project directory
RUN mkdir -p /home/projects/web-img-compress

# COPY over the project
ADD server /home/projects/web-img-progress/
ADD client /home/projects/web-img-progress/
ADD uploads /home/projects/web-img-progress/

# Execute the script
RUN sh /home/projects/web-img-compress/server/run.sh
