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
  "code": 200,
  "msg": "Account create successfully.",
    "data": {
        "user_id": 1,
        "name": "Alice",
        "currency": "USD",
        "balance": 0.00,
        "created_at": "2025-07-24T10:00:00"
    }
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
    "code": 200,
    "msg": "获取账户信息成功",
    "data": {
        "user_id": 10,
        "name": "li",
        "currency": "USD",
        "balance": 0,
        "created_at": "2025-07-25T05:24:42.000Z",
        "updated_at": null
    }
}

{
    "code": 404,
    "msg": "未找到 ID 为 101 的账户",
    "data": {}
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
    "code": 200,
    "msg": "Account deleted successfully.",
    "data": {}
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

Response:（type=1表示存款，已对边界值判断逻辑进行了完善）

{
    "code": 201,
    "msg": "存款交易成功",
    "data": {
        "transaction_id": 10,
        "account_id": 9,
        "type": 1,
        "amount": 200,
        "description": "Initial deposit",
        "occurred_at": "2025-07-25T07:13:40.797Z",
        "current_balance": 350
    }
}
{
    "code": 404,
    "msg": "用户不存在。",
    "data": {}
}
Spend cash

POST /cash/spend

Request Body:

{
  "account_id": 1,
  "amount": 50.00,
  "description": "Purchase of book"
}

Response:（type=2表示支出,已对边界值判断逻辑进行了完善）

{
    "code": 201,
    "msg": "支出交易成功",
    "data": {
        "transaction_id": 16,
        "account_id": 9,
        "type": 2,
        "amount": 50,
        "description": "Purchase of book",
        "occurred_at": "2025-07-25T07:18:20.097Z",
        "current_balance": 201
    }
}
{
    "code": 400,
    "msg": "余额不足，无法完成支出。",
    "data": {}
}

Query cash transactions by account

GET /cash/account/{account_id}

Response:
{
    "code": 200,
    "msg": "获取交易记录成功",
    "data": [
        {
            "cash_account_id": 8,
            "type": 1,
            "amount": "200.00",
            "description": "Initial deposit",
            "occurred_at": "2025-07-25T05:23:44.000Z"
        },
        {
            "cash_account_id": 9,
            "type": 2,
            "amount": "50.00",
            "description": "Purchase of book",
            "occurred_at": "2025-07-25T05:24:09.000Z"
        }
    ]
}

