Courier
=======

Beacon Registering 

Environment Setup

Mac OS X 

```
ruby -e "$(curl -fsSL https://raw.github.com/Homebrew/homebrew/go/install)" //Installs homebrew package manager
sudo brew update
sudo brew install node
sudo npm install grunt-cli -g
sudo npm install bower -g

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
