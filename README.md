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

### Intellij Setup
Instructions are posted in the wiki https://github.com/makeandbuild/Courier/wiki/IntelliJ-Setup

## API Docs
*WARNING: DOCS ARE NOT UP TO DATE YET*

Most of the site is still in boiler plate sample format.  The only pages that are currently up to date are the following:

* Authenticate - http://makeandbuild.github.io/Courier/#/authentication
* Response Format - http://makeandbuild.github.io/Courier/#/response-format
* GET /beacondetections - http://makeandbuild.github.io/Courier/#/get-beacon-detections
* POST /beacondetections - http://makeandbuild.github.io/Courier/#/post-beacon-detections

_For everything else please refer to the documentation in the code itself._

Development is in the ```gh-pages``` branch.

Current docs can be viewed at http://makeandbuild.github.io/Courier/

## Wamp Routing
We have a _crossbar.io_ router configured in the ```.crossbar``` folder of this project.

Install crossbar
```
pip install crossbar
```
Verify install
```
crossbar version
```
Ensure ```NODE_PATH``` is set to ```/usr/local/bin/node``` in your ```.profile``` or ```.bash_profile```

Start crossbar router
```
cd <wherever your repo lives>/Courier
crossbar start
```


