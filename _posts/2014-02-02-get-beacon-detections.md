---
category: beacon detections
path: '/beacondetections'
title: 'Get beacon detections'
type: 'GET'

layout: nil
---

Get a collection of beacon detections.

### Request

#### Filters

Optional query parameters:

1. *```uuid```*: beacon uuid
    - ```GET /api/beacondetections?uuid=<your value here>```
1. *```agentId```*: agent custom id (most likely the mac address)
    - ```GET /api/beacondetections?agentId=<your value here>```
1. *```time```*:
    - ```GET /api/beacondetections?time=<your value here>```

Supported time comparators:

   - ```gt``` = greater than
   - ```gte``` = grater than or equal
   - ```lt``` = less than
   - ```lte``` = less than or equal
 
Example time ranges:

  - ```time=gte 2013-10-09T08:40 lte 2014-10-09T08:40```
  - ```time=gte 2014-10-09T08:40```
  - ```time=gt 2014-10-09T08:40```
  - ```time=lte 2014-10-09T08:40```
  - ```time=lt 2014-10-09T08:40```


### Response

Sends back a collection of beacon detections.

```Status: 200 OK```
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
  {
     "_id" : "5447adb6be39b4cd09ef0c94",
     "__v" : 0,
     "time" : "2014-10-22T13:14:30.329Z",
     "uuid" : "aufoiasufasiduf7",
     "major" : 1,
     "minor" : 1,
     "tx" : -68,
     "rssi" : -75,
     "distance" : 2.9,
     "agentId" : "98sd7f9asd87po"
  },
  {
     "_id" : "5447adb6be39b4cd09ef0c95",
     "__v" : 0,
     "time" : "2014-01-01T00:00:00.000Z",
     "uuid" : "aufoiasufasiduf7",
     "major" : 11,
     "minor" : 10,
     "tx" : -44,
     "rssi" : -66,
     "distance" : 4.1,
     "agentId" : "5f7as65f7s"
  }
]
```

For errors responses, see the [response status codes documentation](#response-status-codes).