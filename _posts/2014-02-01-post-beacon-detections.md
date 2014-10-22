---
category: beacon detections
path: '/beacondetections'
title: 'Post beacon detections'
type: 'POST'

layout: nil
---

This method allows users to create new beacon detections.

### Request

* **The body can't be empty** and must include at least the name attribute, a `string` that will be used as the name of the thing.

### Response

**If succeeds**, returns the created beacon detections.

```Status: 201 Created```
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

For errors responses, see the [response status codes documentation](#response-status-codes).

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
