# API Documentation

## RESTful API
- GET: `/{resource}/{id}`
- POST: `/{resource}`
- DELETE: `/{resource}/{id}`
- PATCH: `/{resource}`

## Account Module


### create account

`POST /account`

```json
{
  "name": "string",
  "currency": "number"
}
```


### get account

`GET /account/{id}`

```json
{
  "id": "number"
}
```

#### delete account

`DELETE /account/{id}`

```json
{
  "id": "number"
}
```

