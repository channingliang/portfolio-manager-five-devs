# API Documentation

## RESTful API
- GET: `/{resource}/{id}`
- POST: `/{resource}`
- DELETE: `/{resource}/{id}`
- PATCH: `/{resource}`

## Account Module


### create account

`POST /account`

Request Body:
```json
{
  "name": "string",
  "currency": "number"
}
```
Response:
{
  "user_id": 1,
  "name": "Alice",
  "currency": "USD",
  "balance": 0.00,
  "created_at": "2025-07-24T10:00:00"
}


### get account

`GET /account/{id}`

```json
{
  "id": "number"
}
```
Response:
{
  "user_id": 1,
  "name": "Alice",
  "currency": "USD",
  "balance": 100.00,
  "created_at": "2025-07-24T10:00:00",
  "updated_at": "2025-07-24T10:10:00"
}


#### delete account

`DELETE /account/{id}`

```json
{
  "id": "number"
}
```
Response:
{
  "message": "Account deleted successfully."
}


Cash Transaction Module

Deposit cash

POST /cash/deposit

Request Body:
{
  "account_id": 1,
  "amount": 200.00,
  "description": "Initial deposit"
}

Response:（type=1表示存款）
{
  "cash_account_id": 101,
  "account_id": 1,
  "type": 1,
  "amount": 200.00,
  "related_id": 0,
  "description": "Initial deposit",
  "occurred_at": "2025-07-24T10:15:00"
}

Spend cash

POST /cash/spend

Request Body:

{
  "account_id": 1,
  "amount": 50.00,
  "description": "Purchase of book"
}

Response:（type=2表示支出）
{
  "cash_account_id": 102,
  "account_id": 1,
  "type": 2,
  "amount": 50.00,
  "related_id": 0,
  "description": "Purchase of book",
  "occurred_at": "2025-07-24T10:20:00"
}

Query cash transactions by account

GET /cash/account/{account_id}

Response:
[
  {
    "cash_account_id": 101,
    "type": 1,
    "amount": 200.00,
    "description": "Initial deposit",
    "occurred_at": "2025-07-24T10:15:00"
  },
  {
    "cash_account_id": 102,
    "type": 2,
    "amount": 50.00,
    "description": "Purchase of book",
    "occurred_at": "2025-07-24T10:20:00"
  }
]
