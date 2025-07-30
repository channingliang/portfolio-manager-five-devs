## Account Module

### Create Account

#### URL

```http
POST /account
```

#### Request

```json
{
  "name": "string",
  "currency": "number"
}
```
#### Response:

```json
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
```

#### URL

```http
GET /account/{id}
```

#### Request

```json
{
  "id": "number"
}
```
#### Response:

```json
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
```

### delete account

#### URL `DELETE /account/{id}`

#### Request

```json
{
  "id": "number"
}
```

#### Response

```json
{
    "code": 200,
    "msg": "Account deleted successfully.",
    "data": {}
}
```

### Deposit cash

#### URL POST /cash/deposit 

#### Request

```json
{
  "account_id": 1,
  "type": 1,
  "amount": 200.00,
  "description": "Initial deposit"
}
```

####　Response:（type=1表示存款，已对边界值判断逻辑进行了完善）

```json
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
```

###　Spend cash

#### URL POST /cash/spend

#### Request:

```json
{
  "account_id": 1,
  "amount": 50.00,
  "description": "Purchase of book"
}
```

#### Response:（type=2表示支出,已对边界值判断逻辑进行了完善）

```json
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
```

### Query cash transactions by account

#### URL GET /cash/account/{account_id}

#### Response

```json
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
```

### Interface to get stock information from Tiingo

#### URL POST /tiingo

#### Request

```json
{
  "ticker": "aapl",
  "startDate": "2025-01-01T00:00:00.000Z",
  "endDate": "2025-07-28T23:59:59.999Z",
  "sort" : "DESC"
}
```

#### Response

```json
Response:
{
    "code": 200,
    "msg": "获取股票信息成功",
    "data": [
        {
            "date": "2025-07-01T00:00:00.000Z",
            "close": 207.82,
            "high": 210.1865,
            "low": 206.1401,
            "open": 206.665,
            "volume": 78788867,
            "adjClose": 207.82,
            "adjHigh": 210.1865,
            "adjLow": 206.1401,
            "adjOpen": 206.665,
            "adjVolume": 78788867,
            "divCash": 0.0,
            "splitFactor": 1.0
        },
        {
            "date": "2025-07-02T00:00:00.000Z",
            "close": 212.44,
            "high": 213.34,
            "low": 208.14,
            "open": 208.91,
            "volume": 67941811,
            "adjClose": 212.44,
            "adjHigh": 213.34,
            "adjLow": 208.14,
            "adjOpen": 208.91,
            "adjVolume": 67941811,
            "divCash": 0.0,
            "splitFactor": 1.0
        }
    ]
}
```

### Interface to get end-of-day information from Tiingo, completed

#### URL POST /tiingo/end_of_day

#### Request

```json
{
  "ticker": "aapl",  //该参数为必须项，其余为可选项
  "startDate": "2025-01-01T00:00:00.000Z",
  "endDate": "2025-07-28T23:59:59.999Z",
  //"resampleFreq" : "DESC"
}
```

#### Response

```json
Response:
{
    "code": 200,
    "msg": "获取日终信息信息成功",
    "data": {
            "date": "2025-07-01T00:00:00.000Z",
            "open": 206.665,
            "high": 210.1865,
            "low": 206.1401,
            "close": 207.82,
            }    
}
```

### Interface to get Definitions Data information from Tiingo, completed

#### URL POST /tiingo/def

#### Request

```json
{
  "ticker": "aapl",  
  //"Response Format": "json"
}
```

#### Response

```json
Response:
{
    "code": 200,
    "msg": "获取定义数据信息信息成功",
    "data": {
            "dataCode": "peRatio",
            "name": "A human-friendly readable name of the field.",
            "description": "A description of the field."
            }    
}
```

### Interface to get Fund Overview information from Tiingo

#### URL POST /tiingo/foud_overview

#### Request

```json
{
  "ticker": "aapl",  //必选项
}
```

#### Response

```json
Response:
{
    "code": 200,
    "msg": "获取基金概述信息成功",
    "data": {
            "ticker": "aapl",
            "name": "Full-length name of the fund.",
            }    
}
```

### Interface to get Meta Endpoint information from Tiingo

#### URL POST /tiingo/metaEndpoint

#### Request

```json
{
  "ticker": "aapl", 
  //"Response Format": "json"
}
```

#### Response

```json
Response:
{
    "code": 200,
    "msg": "获取Meta Endpoint信息成功",
    "data": {
            "ticker": "aapl",
            "name": "Full-length name of the fund.",
            }    
}
```