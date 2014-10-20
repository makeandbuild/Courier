Courier
=======

Beacon Registering 

## Environment Setup

### Mac OS X 

```
ruby -e "$(curl -fsSL https://raw.github.com/Homebrew/homebrew/go/install)" //Installs homebrew package manager
sudo brew update
sudo brew install node
npm install grunt-cli -g
npm install bower -g

//Installs all of the NodeJS Courier packages.
npm install
bower install
```

Install and start MongoDb

```
brew install mongodb

//Add to start up
ln -sfv /usr/local/opt/mongodb/*.plist ~/Library/LaunchAgents
launchctl load ~/Library/LaunchAgents/homebrew.mxcl.mongodb.plist

//Or just launch once
mongod --dbpath=/usr/local/var/mongodb

```

Run grunt serve to get it running:

```
grunt serve
```

#### Tests

Run Mocha Tests
```
grunt mochaTest
```

#### Logging
Logging is configured to use Winston in the ```\utils\logger.js``` file.  The following log files are configured:
 1. ```courier.log``` - use for general purpose logging
 1. ```pings.log``` - used to log pings sent from the agent
 
Usage
```
var logger = require('/utils/logger.js');
// log to pings.log
logger.pings(logLine);

// log to courier.log
logger.courier('error', 'Error message!');
// or
logger.log('error', 'Error message!');

```
 

### Intellij Setup
Instructions are posted in the wiki https://github.com/makeandbuild/Courier/wiki/IntelliJ-Setup

## API Docs
WARNING: THESE ARE NOT EVEN CLOSE TO BEING CORRECT OR UP TO DATE YET.  The base template is the only thing there now.
Currently in development here: http://makeandbuild.github.io/Courier/
