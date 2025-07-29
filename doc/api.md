# API Documentation

## RESTful API
- GET: `/{resource}/{id}`
- POST: `/{resource}`
- DELETE: `/{resource}/{id}`
- PATCH: `/{resource}/{id}`

## Portfolio Module

### Holding
### create portfolio

`POST /portfolio/holding`

```json
{
  "account_id": "number",
  "ticker": "string",
  "ticker_type": "number",
  "transaction_type": "number",
  "quantity": "number",
  "price_per_unit": "number"
  
}
```
Response:

{
  "code" = 201,
  "message" = "创建投资组合持仓成功",
  "data": {
    "portfolio_holding_id": 1,
    "account_id": 1,
    "ticker": "Alice",
    "ticker_type": 1,
    "quantity": 0.00,
    "created_at": "2025-07-24T10:00:00",
    "updated_at": "2025-07-24T10:10:00"
  }
}

#### URL

### get portfolio holding

`GET /portfolio/holding/{id}`

```json
{}
```
Response:
{
  "code" = 200,
  "message" = "获取投资组合持仓成功",
  data: {
    "portfolio_holding_id": 1,
    "account_id": 1,
    "ticker": "Alice",
    "ticker_type": 1,
    "quantity": 0.00,
    "created_at": "2025-07-24T10:00:00",
    "updated_at": "2025-07-24T10:10:00"
  }
}


#### update portfolio holding

`PATCH /portfolio/holding/{id}`

```json
{
  "quantity": "number"
}
```

#### Response

```json
{
  "code" = 200,
  "message" = "更新投资组合持仓${id}成功",
  "data": {
    "portfolio_holding_id": 1,
    "ticker": "Alice",
    "quantity": 0.00,
    "updated_at": "2025-07-24T10:10:00"
  }
}


#### delete portfolio holding

`DELETE /portfolio/holding/{id}`

```json
{}
```
Response:
{
  success: true,
  message: `投资组合持仓 ${id} 删除成功`,
}



### Transaction
### create Transaction

`POST /transaction`

Request Body:
```json
{
  "account_id": "number",
  "ticker": "string",
  "ticker_type": "number",
  "transaction_type": "number",
  "quantity": "number",
  "price_per_unit": "number",
  "cash_transaction_id": "number"
}
```
Response:
{
  "code" = 201,
  "message" = "投资组合交易创建成功",
  "data": {
    "portfolio_holding_id": 1,
    "account_id": 1,
    "ticker": "Alice",
    "ticker_type": 1,
    "transaction_type": 1,
    "quantity": 0.00,
    "price_per_unit": 0.00,
    "total_amount": 0.00,
    "occurred_at": "2025-07-24T10:00:00"
  }
}


### get portfolio transaction

`GET /portfolio/transaction/{id}`

```json
{}
```
Response:
{
  "code" = 200,
  "message" = "获取投资组合持仓成功",
  data: {
    "portfolio_holding_id": 1,
    "account_id": 1,
    "ticker": "Alice",
    "ticker_type": 1,
    "transaction_type": 1,
    "quantity": 0.00,
    "created_at": "2025-07-24T10:00:00",
    "updated_at": "2025-07-24T10:10:00",
    "price_per_unit": 0.00,
    "total_amount": 0.00,
    "cash_transaction_id": 1,
    "occurred_at": "2025-07-24T10:00:00" 
  }
}


#### update portfolio transaction

`PATCH /portfolio/transaction/{id}`

```json
{
  "price_per_unit": "number",
  "quantity": "number",
  "cash_transaction_id": "number"
}
```
Response:
{
  "code" = 200,
  "message" = "更新投资组合交易${id}成功",
  "data": {
    "portfolio_holding_id": 1,
    "total_amount": 0.00
  }
}


#### delete portfolio transaction

`DELETE /portfolio/transaction/{id}`

```json
{}
```
Response:
{
  success: true,
  message: `投资组合交易 ${id} 删除成功`,
}