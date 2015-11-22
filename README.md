# web-img-compress
Web-based tool for image compression

Sharing Digicam pictures online, clicked in high-resolution is a problem because the average size is 5MB !
This web-based tool gives a simplified interface to compress a batch of photos to a specified percentage with ease.
As a PoC, we are compressing it to 50% - we'll add a slider soon.

Dumb question: If it's a web-tool, wouldn't it take ages to upload the images which we wish to compress? 
Ans: True, that's why I'll walk you through the setting up of the docker image on your localhost :)


Getting started :

- Install Docker.
- Pull Image.
- Start container. ( docker run -p 8123:8123 web-img-comp /home/projects/web-img-compress/server/run.sh )
- Acccess the web app on your browser as http://127.0.0.1:<Port> 
- Multi-select the photos and upload ( to the web app running on your local ).
- Download the generated ZIP of compressed photos.


