Courier Server & Admin Console
=======
The Courier project is broken down into four pieces - Agent, Engine, Server & Admin Console - and is divided up between three different repos.

1. Agent - https://github.com/makeandbuild/courier-agent-nodejs
2. Server & Admin Console - https://github.com/makeandbuild/Courier
3. Engine - https://github.com/makeandbuild/courier-agent-engine

For a high level overview including architecture diagrams refer to our blog post [Courier iBeacon Implementation](http://makeandbuild.com/blog/post/courier-ibeacon-implementation)


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

### Default Admin Console Credentials
The source code comes with two built in users by default.  You can add additional users by using the 'Sign Up' page and you can change a user's password under the Settings once logged in.

|Username|Password|
|--------|--------|
|admin@admin.com|admin|
|test@test.com|test|

### Roadmap
This repo is a work in progress - *IT IS NOT PRODUCTION READY*.  We don't expect you to use the entire thing as is, but we're hoping that you'll at least find parts of it useful for your own development.

This is subject to change, but the items that we plan to work on next are the following:
- Make rules engine pluggable
- Add socket.io authentication
- Publish websocket events that the rules engine listens for instead of calling directly
- Auto register beacons when they are first seen (like we do for agents)
- Make uuids case and dash insensitive (currently only supports uuids in all lowercase without dashs)
