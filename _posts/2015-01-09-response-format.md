---
title: 'Response Format'

layout: nil
---

### GET

#### Single Get

If a single resource is requested the response will contain a single JSON object for the resource.

Example: `GET /beacons/5447cb16cc80d1090c6c836c`
Response:
```{
  "_id" : "5447cb16cc80d1090c6c836c",
  "name" : "New Name",
  "uuid" : "9090",
  "major" : 89,
  "minor" : 90987,
  "__v" : 0
}
```

#### Batch Get

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
]
```
 

 
### POST

If the resource only supports creating one at a time the response will contain the newly created resource as a JSON object.

#### Single Create

Example: `POST /beacons` 
Response:
```{
  "_id" : "5447cb16cc80d1090c6c836c",
  "name" : "New Name",
  "uuid" : "9090",
  "major" : 89,
  "minor" : 90987,
  "__v" : 0
}
```

#### Batch Create

If the resource supports *batch* create the response JSON will contain a collection of successful 
creates and a collection containing details for any creates that failed.

Batch creates are NOT transactional.  If one fails you will be given details on what failed and why.
 The successful creates will NOT be rolled back.  It is up to you to handle any resources that were not created. 

*Successful Creates*

The response body will contain a *`succeeded`* object that contains a collection of the newly created resources.

Example:
```...
"succeeded" :
    [
       {
          // properties of new resource
       },
       ...
    ],
...
```

*Failed Creates*

The response body will contain a *`failed`* object that contains a collection of objects that contain 
the error that happened and the original resource data that couldn't be created.

Example:
```...
"failed" :
     [
        {
           "error" :
              {
                 // info about the error - TODO - we still need to standardize this
              },
           "data" :
              {
                 // resource data that couldn't be created
              }
        },
        ...
     ]
...
```

 
Example: `POST /beacondetections`
Response - All Successful:
```{
  "succeeded" :
     [
        {
           "__v" : 0,
           "time" : "2014-10-21T19:53:18.206Z",
           "uuid" : "aufoiasufasiduf7",
           "major" : 1,
           "minor" : 1,
           "tx" : -68,
           "rssi" : -75,
           "distance" : 4.9,
           "agentId" : "98sd7f9asd87po",
           "_id" : "5446b9aea3e5c96c31e65225"
        },
        {
           "__v" : 0,
           "time" : "2014-01-02T00:00:00.000Z",
           "uuid" : "aufoiasufasiduf7",
           "major" : 11,
           "minor" : 10,
           "tx" : -44,
           "rssi" : -66,
           "distance" : 3.6,
           "agentId" : "5f7as65f7s",
           "_id" : "5446b9aea3e5c96c31e65226"
        }
     ],
  "failed" :
     [
     ]
}```

Response - All Failed:
```{
  "succeeded" :
     [
     ],
  "failed" :
     [
        {
           "error" :
              {
                 "name" : "MongoError",
                 "code" : 11000,
                 "err" : "insertDocument :: caused by :: 11000 E11000 duplicate key error index: courier-dev.beacondetections.$_id_  dup key: { : ObjectId('5446b79815a0d86331cf0ee6') }"
              },
           "data" :
              {
                 "__v" : 0,
                 "time" : "2014-10-21T19:44:23.749Z",
                 "uuid" : "787654ffrgy",
                 "major" : 1,
                 "minor" : 1,
                 "tx" : -65,
                 "rssi" : -75,
                 "distance" : 3.7,
                 "agentId" : "98asd7fa9s8d7fa",
                 "_id" : "5446b79815a0d86331cf0ee6"
              }
        },
        {
           "error" :
              {
                 "name" : "MongoError",
                 "code" : 11000,
                 "err" : "insertDocument :: caused by :: 11000 E11000 duplicate key error index: courier-dev.beacondetections.$_id_  dup key: { : ObjectId('5446b79815a0d86331cf0ee7') }"
              },
           "data" :
              {
                 "__v" : 0,
                 "time" : "2014-10-21T19:44:23.749Z",
                 "uuid" : "787654ffrgy",
                 "major" : 1,
                 "minor" : 1,
                 "tx" : -61,
                 "rssi" : -72,
                 "distance" : 3.1,
                 "agentId" : "98sd7f9asd87po",
                 "_id" : "5446b79815a0d86331cf0ee7"
              }
        }
     ]
}
```

Response - Success/Failure Mix:
```{
  "succeeded" :
     [
         {
            "__v" : 0,
            "time" : "2014-10-21T19:53:18.206Z",
            "uuid" : "aufoiasufasiduf7",
            "major" : 1,
            "minor" : 1,
            "tx" : -68,
            "rssi" : -75,
            "distance" : 4.9,
            "agentId" : "98sd7f9asd87po",
            "_id" : "5446b9aea3e5c96c31e65225"
         }
     ],
  "failed" :
     [
        {
           "error" :
              {
                 "name" : "MongoError",
                 "code" : 11000,
                 "err" : "insertDocument :: caused by :: 11000 E11000 duplicate key error index: courier-dev.beacondetections.$_id_  dup key: { : ObjectId('5446b79815a0d86331cf0ee6') }"
              },
           "data" :
              {
                 "__v" : 0,
                 "time" : "2014-10-21T19:44:23.749Z",
                 "uuid" : "787654ffrgy",
                 "major" : 1,
                 "minor" : 1,
                 "tx" : -65,
                 "rssi" : -75,
                 "distance" : 3.7,
                 "agentId" : "98asd7fa9s8d7fa",
                 "_id" : "5446b79815a0d86331cf0ee6"
              }
        }
     ]
}
```


### PUT

### DELETE

