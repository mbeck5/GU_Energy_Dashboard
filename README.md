# GU Energy Dashboard

This is the senior design repository for the CPSC 002 GU Energy Dashboard.

## Installing

 > Ensure you have the project downloaded somehow  
 > Linux or Mac users may need "sudo" in front of some of the following commands:

### Server

1) Install NodeJS from their website.  Default options should be fine.

2) Run:

    $ npm install -g grunt-cli bower forever nodemon node-inspector
    
3) In the server folder from the command line/terminal run:

    $ npm install
    
### Client

1) Install ruby (mac may already have this).  Make sure to add ruby to path when installing!

2)  Restart!

5) Run:

    $ gem install compass
    
4) In the client folder from the command line/terminal run:

    $ npm install
    $ bower install

## Running

### In development mode (what you will do most of the time):

In the client folder run:

    $ grunt serve

In the server folder run:

    $ npm test

> Make sure your browser is pointing to http://localhost:3000/#/

### In production mode:

In the client folder run:

    $ grunt

In the server folder run:

    $ npm start
