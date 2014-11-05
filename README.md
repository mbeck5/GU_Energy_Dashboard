GU_Energy_Dashboard
===================

This is the senior design repository for the CPSC 002 GU Energy Dashboard

Installing:
1) install NodeJS from their website
    -default options should be fine
2) install ruby (mac may already have this)
    -make sure to add ruby to path when installing!
3)  Restart!
4) in Webstorm create new project from version control which should theoretically pull down everything...

***Linux or Mac users may need "sudo" in front of some of the following commands:

5) run:
    - gem install compass
    - npm install -g grunt-cli
    - npm install -g bower
    - npm install -g nodemon
6) in the server folder from the command line/terminal run:
    - npm install
7) in the client folder from the command line/terminal run:
    - npm install
    - bower install


Running:
In dev (what you will do most of the time):
    in the client folder run:
        - grunt serve
    in the server folder run:
        - npm test

In prod:
    in the client folder run
        - grunt
    in the server folder run:
        - npm start