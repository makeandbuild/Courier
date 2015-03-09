Courier Server & Admin Console
=======
The Courier project is broken down into four pieces - Agent, Engine, Server & Admin Console - and is divided up between three different repos.

1. Agent - https://github.com/makeandbuild/courier-agent-nodejs
2. Server & Admin Console - https://github.com/makeandbuild/Courier
3. Engine - https://github.com/makeandbuild/courier-agent-engine

For a high level overview including architecture diagrams refer to our blog post [Courier iBeacon Implementation](http://makeandbuild.com/blog/post/courier-ibeacon-implementation)

## Server

### Summary
We chose to write the server in Node.js using the Express framework to get everything up and running quickly.  Node allowed us to get our web server running in just a few lines of code and Express helped simplify building the REST API.  We started out using REST for all communication with the server but have since started using WebSockets with socket.io as well.  Most notably we switched to WebSockets for communication with agents to remove the overhead of HTTP when publishing detections to the server every two seconds.

Once the server receives a detection payload from an agent, it saves the detections to a MongoDB database and analyzes them to determine which beacons came in range for the first time, which ones are still in range, and which ones are no longer detected - enter, alive, or exit events respectively.  Based on the event type, we send action commands to the configured engines.  Currently we send commands to play audio files when we receive an enter event for a beacon, but you can customize this to do whatever you want.

```javascript
var engineNamespace = socketio.of('/engine');
engineNamespace.to(engineId).emit('playaudio', { filename: 'hello.wav' });
```

### Server - REST API Layer
**WARNING: DOCS ARE NOT UP TO DATE YET**  We haven't had time to fully document the API so until then you are probably better off just refering to the code itself.  All the REST endpoints can be found in the ```server/api``` folder.  The files are named like ```agent.controller.js```.

Most of the site is still in boiler plate sample format.  The only pages that are currently up to date are the following:

* Authenticate - http://makeandbuild.github.io/Courier/#/authentication
* Response Format - http://makeandbuild.github.io/Courier/#/response-format
* GET /beacondetections - http://makeandbuild.github.io/Courier/#/get-beacon-detections
* POST /beacondetections - http://makeandbuild.github.io/Courier/#/post-beacon-detections

_For everything else please refer to the documentation in the code itself._

Development is in the ```gh-pages``` branch.

Current docs can be viewed at http://makeandbuild.github.io/Courier/

### Server - Service Layer
The service layer code is located in the ```server/service``` folder.  The files are named like ```agent.service.js```.

### Server - DAO Layer
The DAO layer uses MongoDB.  The code is located in the ```server/dao``` folder.  The files are named like ```agent.dao.js```.

### Server - Rules Engine
This is the code that is responsible for taking actions based on the _enter_, _alive_, and _exit_ events for the beacons.  Eventually we want to pull this code into a separate module and use socket.io to send events from the Server to the Rules Engine for processing but we haven't gotten that far yet.  We have separated the code to its own ```server/rules``` folder so that it is easy to separate when we have time.

Any custom actions you want to take when an event is recieved should be registered in the ```detection.event.service.js``` by passing the behavior/rule as a function to the ```registerRule(ruleFunction)```.  When an event is detected it all registered rules will be processed.

## Admin Console

### Summary
The admin console is written in Angular.js and connects to the server using its REST API.  You can use it to manage and check the status of your agents, beacons, and engines.  You can also view a list of the saved detections.

### Admin Console Credentials
The source code comes with two built in users by default.  You can add additional users by using the 'Sign Up' page and you can change a user's password under the Settings once logged in.

|Username|Password|
|--------|--------|
|admin@admin.com|admin|
|test@test.com|test|

## Roadmap
This repo is a work in progress - *IT IS NOT PRODUCTION READY*.  We don't expect you to use the entire thing as is, but we're hoping that you'll at least find parts of it useful for your own development.

This is subject to change, but the items that we plan to work on next are the following:
- Fix broken tests
- Make rules engine pluggable
- Add socket.io authentication
- Publish websocket events that the rules engine listens for instead of calling directly
- Auto register beacons when they are first seen (like we do for agents)
- Make uuids case and dash insensitive (currently only supports uuids in all lowercase without dashs)
- Pull list of audio file choices and urls from S3 bucket in order to provide list of files to play dynamically (currently we the UI is hardcoded)

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

_Warning_: We know that some of these are broken.  We are working on it.

### Intellij Setup
Javascript developers, don't laugh but we have Java developers working on this code and they like to use IntelliJ.  So be it.  Feel free to use your favorite Javascript editor - Sublime, Atom, etc.  This is more for our own reference, but perhaps you'll find it useful.

Instructions are posted in the wiki https://github.com/makeandbuild/Courier/wiki/IntelliJ-Setup

