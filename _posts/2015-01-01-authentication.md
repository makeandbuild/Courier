---
path: '/token'
title: 'Authenticate'

layout: nil
---

All resources require authentication unless otherwise noted.

### Request Token

To request a token you must include your username and password in the request headers 
of a *`GET /tokens`* request.

```{
  "username" : "test@test.com",
  "password" : "test",
}
```

### Token Response

The response body will contain a JSON object with the token.

```{
  "token" : "eyJ0eXAiOiJKV1QiLCJhbGciOiJ...",
  "expires" : 1414015729863,
  "user" :
     {
        "_id" : "5447ba71afc247840a6391c6",
        "email" : "test@test.com"
     }
}
```

### Using the Token

For routes that require authentication you can pass the token in the following ways.

1. Include as the POST value `access_token`
1. Include as the GET parameter `access_token`
1. Include as the `x-access-token` header


For errors responses, see the [response status codes documentation](#response-status-codes).