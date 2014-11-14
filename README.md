# GU Energy Dashboard

This is the senior design repository for the CPSC 002 GU Energy Dashboard

## Installing

1) Install NodeJS from their website.  Default options should be fine.

2) Install ruby (mac may already have this).  Make sure to add ruby to path when installing!

3)  Restart!

4) In Webstorm, create new project from version control which should theoretically pull down everything...

    > Linux or Mac users may need "sudo" in front of some of the following commands:

5) Run:

    $ gem install compass
    $ npm install -g grunt-cli bower nodemon

6) In the server folder from the command line/terminal run:

    $ npm install

7) In the client folder from the command line/terminal run:

    $ npm install
    $ bower install


## Running

# In development mode (what you will do most of the time):

In the client folder run:

    $ grunt serve

In the server folder run:

    $ npm test

    > make sure your browser is pointing to http://localhost:3000/#/

#In prod:

In the client folder run:

    $ grunt

In the server folder run:

    $ npm start