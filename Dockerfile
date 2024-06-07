# Use an official Ubuntu base image
FROM ubuntu:22.04

# Set metadata(optional)
LABEL maintainer="sourabh404sourabh@gmail.com"

# Install necessary packages 
RUN apt-get update && apt-get install -y
\ 
nodejs
npm \
-g serve 
 \

# Copy your project files into the image
COPY ./Rasozon 

# Set the working directory
WORKDIR /Rasozon

# Specify the dafault command to run when the container starts
CMD ["./scripts/deploy.js"]
