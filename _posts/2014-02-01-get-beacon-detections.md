---
category: beacon detections
path: '/beacondetections'
title: 'Get beacon detections'
type: 'GET'

layout: nil
---

This method allows users to retrieve stuff.

### Request

* The headers must include a **valid authentication token**.

### Filters

Optional query parameters:

1. *```uuid```*: beacon uuid
    - ```GET /api/beacondetections?uuid=<your value here>```
1. *```agentId```*: agent mongo id
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
```{
    {
        id: thing_1,
        name: 'My first thing'
    },
    {
        id: thing_2,
        name: 'My second thing'
    }
}```

For errors responses, see the [response status codes documentation](#response-status-codes).