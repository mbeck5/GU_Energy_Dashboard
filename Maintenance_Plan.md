# GU Energy Dashboard Maintenance Plan

## Contents

[Installation](#installation)

[Running](#running)

- Development
- Production

[Dependencies](#dependencies)

- For development
- For the application

[The Application](#the-application)

- Client
  - Views
  - Styles
  - Scripts
- Server
- Database

[Deliverables](#deliverables)

## Installation

The project is hosted on GitHub: [https://github.com/mbeck5/GU\_Energy\_Dashboard](https://github.com/mbeck5/GU_Energy_Dashboard)

**The repository will need to be cloned** using this address: [https://github.com/mbeck5/GU\_Energy\_Dashboard.git](https://github.com/mbeck5/GU_Energy_Dashboard.git)

We used WebStorm IDE to develop the application.  This is not required, but we found this IDE to be very effective.

The environments and dependencies will also need to be installed and configured.  The process will split into the Server and Client.  Administrator or root permissions may be required for certain steps depending on your system configuration.

**Server**

1. 1.Install NodeJS preferable from their website: [https://nodejs.org/](https://nodejs.org/)
2. 2.Run the following command: `install -g grunt-cli bower nodemon`
3. 3.In gu\_energy\_dashboard/server run: `npm install`

**Client**

1. Install Ruby
  - Mac users may already have this installed
  - For windows users: [http://rubyinstaller.org/](http://rubyinstaller.org/)
  - Be sure to add Ruby to your path when installing if the option is given!

2. Restart
3. Run: gem install compass
4. In gu\_energy\_dashboard/client run the following:
  - `npm install`
  - `bower install`

## Running

There are two ways of running the web application: development mode and production mode.

**\*Note** : the file that contains the scripts to start the server will need to be changed depending on your operating system.  If you are Windows change "scripts" property of the gu\_energy\_dashboard/server/package.json file to look like this:

    "scripts": {
      "start": "SET \"NODE\_ENV=production\" && node ./bin/www",
      "test": "SET \"NODE\_ENV=development\" && nodemon ./bin/www"
    }

If you are on MAC or Linux change the section to look like this:

    "scripts": {
      "start": "NODE\_ENV=production && node ./bin/www",
      "test": "NODE\_ENV=development && nodemon ./bin/www"
    }

### Development mode

Development mode will use non-minified and non-uglified code making debugging easier. Additionally, listeners will be active in development mode that will watch for any changes in the code and apply those changes to the running application so you do not have to manually restart any services. The webserver that is started will be serving content from the gu\_energy\_dashboard/client/app directory. Finally the database will point to the non-production database located in a senior design server. The data in this database is never updated.

In the gu\_energy\_dashboard/server directory run: `npm test`

This will start a local web server which is necessary if you wish to see data returned from the database.  Additionally, if any changes are made to the back-end code, the server will automatically restart.

The view the application, **make sure you point your browser to http://localhost:7457**

If you are going to be making changes to the SASS the following command needs to be run in gu\_energy\_dashboard/client:  grunt serve (adding –- force to this command may be necessary)

Grunt will be watching for changes to the SASS files and alert Compass to compile them into CSS to be viewable by a web browser.

HTML and front-end JavaScript changes will be take change immediately as long the web browser being used is refreshed for each change.

### Production mode

Production mode will use minified and uglified code so that the application will load faster, but will be harder to debug.  There are also no listeners watching for changes to the code.  The webserver that is started will be serving content from the gu\_energy\_dashboard/server/dist directory. Additionally, the database will point to the production database in Barney that is continually updated. The web server will need to be running in Barney in order to access that database.

In the gu\_energy\_dashboard/client directory run: `grunt -f`

This will optimize all of the client code and put in the gu\_energy\_dashboard/server/dist directory.

To start the webserver run: `npm start`

## Dependencies

### For Development

These are the packages that assisted us in developing the project.  These dependencies are handled entirely by NPM.  Additionally, the versions of each package are already declared.

#### Client

Packages used for client development are listed in the gu\_energy\_dashboard/client/package.json file.

We are using Grunt as a task running / automation tool.  We are using many additional modules to extend the functionality of Grunt.  The configuration of Grunt is provided in the Gruntifle.js in gu\_energy\_dashboard/client.  This file should not need to be modified.

Bower is used to handle the dependencies for the client application.

#### Server

There were no additional packages used to assist in server development.

### For the application

#### Client

Bower was used to handle client-side application dependencies.  The complete listing is in the gu\_energy\_dashboard/client/bower.json file.  The most influential packages are listed below:

- AngularJS was used as the web application framework for our application. [https://angularjs.org/](https://angularjs.org/)
- Restangular was used for our REST calling. [https://github.com/mgonto/restangular](https://github.com/mgonto/restangular)
- Bootstrap was used as our front-end framework. The SASS version was used. [http://getbootstrap.com/](http://getbootstrap.com/)
- Bootstrap was used to provide angular-compatible directive versions of the Boostrap JavaScript components. [https://angular-ui.github.io/bootstrap/](https://angular-ui.github.io/bootstrap/)
- Font-Awesome was used as our font toolkit. [http://fortawesome.github.io/Font-Awesome/](http://fortawesome.github.io/Font-Awesome/)
- MomentJS was used for much of our date management. [http://momentjs.com/](http://momentjs.com/)
- NVD3 was used for our graph generation. We are using an angular-nvd3 directive library to integrate it better with our application. [http://krispo.github.io/angular-nvd3/#/](http://krispo.github.io/angular-nvd3/#/)

#### Server

NPM was also used to handle the server-side application dependencies.  The complete listing is in the gu\_energy\_dashboard/server/packages.json file.  The most influential packages are listed below:

- Express is the back-end web application framework we are using to run on Node.
- We are also using MomentJS for our back-end date management. [http://momentjs.com/](http://momentjs.com/)
- As we are using MySQL for our database, we are using the mysql package for node to interact with the database. [https://github.com/felixge/node-mysql/](https://github.com/felixge/node-mysql/)

## The application

The application is divided into two primary components: the client and server.  The following section will describe how the application is organized and how the different components interact with each other.  It will be assumed that the reader is familiar with the frameworks and components being used.

### Client

As this is a web application, the application code is divided into three components: HTML, CSS, and JavaScript.  Since Angular is being used as the underlying web application framework, the code will be structured according to its design practices.

#### index.html

The gu\_energy\_dashboard/client/app/index.html is responsible for loading resources used by the entire application.  The CSS resources obtained through the Bower dependencies should automatically include themselves in this file, but can be added or edited manually under the <!-- bower:css --> line.  User created styling code should not be added in this file, but rather in main.scss which will be explained later.

JavaScript resources obtained through the Bower dependencies should also automatically include themselves, but can be added or edited manually under the <!-- bower:js --> line.

User created JavaScript code **needs** to be included, however, in this file under the  <!-- build:js({.tmp,app}) scripts/scripts.js --> line.

Finally, this file is also responsible for the **header** HTML code and the JavaScript code that automatically changes the application background based upon the time of day.

#### Views (HTML)

The view / HTML code is located under gu\_energy\_dashboard/client/app/views.  The files will be explained below:

- buildingSelector.html is responsible for the home page which has the building selector, tips, and campus summary graph panels.
- buildingDisplay.html is responsible for the singular and comparative building graphs.
- compDisplay.html is responsible for the competitions page.
- CreateCompDisplay.html is responsible for the create and edit competition modals.
- DeleteCompDisplay.html is responsible for the delete competition modal.

#### Styles (SASS)

We are using the SASS extension language for our styling language.  It is later compiled into CSS by the Compass Ruby module.  The SASS code is located under gu\_energy\_dashboard/client/app/styles.  The files will be explained below:

- main.scss the main SASS file that **imports all** other SASS files. Any new user created SASS files need to be included in this file.
- buildingSelector.css is responsible for the styling code for the main page.
- buildingDisplay.css is responsible for the styling code for the individual and comparative graph page.
- compDisplay.scss is responsible for the competition graph page styling code.
- bootstrap/
  - oobootstrap.scss imports all the various Bootstrap components and themes. This file should not need to be modified.
  - _bootswatch.scss is one of two files that is used for our Bootstrap theme. This is may need to be updated if Bootstrap is updated significantly. Newer versions can be downloaded here: [https://bootswatch.com/sandstone/](https://bootswatch.com/sandstone/)
  - _variables.scss is one of two files that is used for our Bootstrap theme. This is may need to be updated if Bootstrap is updated significantly. Newer versions can be downloaded here: [https://bootswatch.com/sandstone/](https://bootswatch.com/sandstone/)

#### Scripts (JavaScript)

Our Angular script files are separated into three primary types: controllers, services, and directives.  Our services were primarily used to assist in communication between controllers and to initiate REST calls.

app.js:

- This file is the primarily Angular module and is responsible for loading the modules used by the framework, route management, Restangular configuration, and Spinner configuration.
controllers:
- header.js controls the header
- buildingSelector.js controls the building selector panel
- frontPageSummary.js controls the campus summary graphs and knobs
- buildingDisplay.js controls the building and comparative graphs
- compDisplay.js controls the competition list panel. It also contains additional controllers for the create, edit, and delete competition modals.
- competitionGraph.js controls the competition graph panel

services:

- buildingSvc.js is used to communicate between the buildingSelector and buildingDisplay controllers. Additionally it executes REST calls relevant to buildings and their data.
- compEditSvc.js is used to communicate the compDisplay, competitionGraph, and modal controllers. It also executes REST calls relevant to retrieving and editing competition information.

directives:

- knob.js provides a directive for the jQuery Knob components used on our home page.

### Server

The back-end runs on NodeJS using the Express web application framework.  Since our site is client-rendered, the back-end does little except serve up static content and manage any API requests.

bin/www

- This script actually creates the webserver listening on port 7457 and also runs the app.js script.

app.js

- This file is the primary script that is run when the server is started. It is responsible for importing many of the dependencies, creating the database connection, and starting the correct running mode.

routes.js

- This file manages our routes used for our RESTful API and routes requests to the corresponding controller.

controllers

- buildings.js executes queries related to buildings and their data. It is imperative that aliases in the queries **do not change**.
- compQuery.js executes queries related to retrieving and editing competitions. It is imperative that aliases in the queries **do not change**.

services

- standardDeviation.js implements a standard deviation filter that is used by our controllers to remove erroneous data points.

### Database

## Deliverables

### Deployment

#### Web Server

The web server is hosted on Barney.  The directory is /home/energydash/.  Access will need to be granted to this directory.  We were in contact with RyAnne Jones who is a Linux Administrator.  Any other questions related to the operation of thee web server should also go to RyAnne or another Linux Administrator.

#### Database

The production version of our database also resides in Barney. A script has been written to copy over data from Plant Services to our database daily. This process was created by Tim Powers who is an Enterprise Applications Administrator. Other production database related questions should also go to Tim or another Database Administrator.

#### Google Analytics

A Google Analytics account has been created an integrated with the application.  The account guenergydashboard@gmail.com is responsible for sending email confirmation for account creation and has also been given permission to manage the Analytics account. Here is a link to the account: [Google Analytics](https://www.google.com/analytics/web/?hl=en#report/visitors-overview/a59391709w93557215p98569197/).
