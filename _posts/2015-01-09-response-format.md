---
title: 'Response Format'

layout: nil
---

### GET

If multiple resources are requested the response will contain a JSON array of the requested resources.

Example: `GET /beacondetections`
Response:
```[
 {
    "_id" : "5447adb6be39b4cd09ef0c92",
    "__v" : 0,
    "time" : "2014-10-22T13:14:30.329Z",
    "uuid" : "787654ffrgy",
    "major" : 1,
    "minor" : 1,
    "tx" : -65,
    "rssi" : -75,
    "distance" : 3.7,
    "agentId" : "98asd7fa9s8d7fa"
 },
 {
    "_id" : "5447adb6be39b4cd09ef0c93",
    "__v" : 0,
    "time" : "2014-10-22T13:14:30.329Z",
    "uuid" : "787654ffrgy",
    "major" : 1,
    "minor" : 1,
    "tx" : -61,
    "rssi" : -72,
    "distance" : 3.1,
    "agentId" : "98sd7f9asd87po"
 },
 ...
```
 
If a single resource is requested the response will contain a single JSON object for the resource.

Example: `GET /beacons`
Response:


### POST, PUT

### DELETE

