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



## Market Service

### get query info

`GET /market-info`

request:

var request = require('request');
var requestOptions = {
    'url': 'https://api.tiingo.com/tiingo/utilities/search?query=apple&token=c3bf7802828040c9d69ae657be6130d00007e071',
    'headers': {
        'Content-Type': 'application/json'
        }
};

request(requestOptions,
    function(error, response, body) {
        console.log(body);
    }
);        
    
                

"
response：
[
    {
    "ticker":"AAPL",
    "assetType":"Stock",
    "countryCode":"US",
    "isActive":true,
    "name":"Apple Inc",
    "openFIGI":"BBG000B9XRY4",
    "permaTicker":"US000000000038"
    },
    {
    "ticker":"PNPL",
    "assetType":"Stock",
    "countryCode":"US",
    "isActive":true,
    "name":"Pineapple Exprss",
    "openFIGI":null,
    "permaTicker":"US000000047877"
    },
..]
    
"

### get market price

`GET /market-price`

request:

var request = require('request');
var requestOptions = {
    'url': 'https://api.tiingo.com/tiingo/daily/aapl/prices?startDate=2019-01-02&token=c3bf7802828040c9d69ae657be6130d00007e071',
    'headers': {
        'Content-Type': 'application/json'
        }
};

request(requestOptions,
    function(error, response, body) {
        console.log(body);
    }
);        
          


" response:
[
    {
        "date":"2019-01-02T00:00:00.000Z",
        "close":157.92,
        "high":158.85,
        "low":154.23,
        "open":154.89,
        "volume":37039737,
        "adjClose":157.92,
        "adjHigh":158.85,
        "adjLow":154.23,
        "adjOpen":154.89,
        "adjVolume":37039737,
        "divCash":0.0,
        "splitFactor":1.0
    },
    {
        "date":"2019-01-03T00:00:00.000Z",
        "close":142.19,
        "high":145.72,
        "low":142.0,
        "open":143.98,
        "volume":91312195,
        "adjClose":142.19,
        "adjHigh":145.72,
        "adjLow":142.0,
        "adjOpen":143.98,
        "adjVolume":91312195,
        "divCash":0.0,
        "splitFactor":1.0
    },
    {
        "date":"2019-01-04T00:00:00.000Z",
        "close":148.26,
        "high":148.5499,
        "low":143.8,
        "open":144.53,
        "volume":58607070,
        "adjClose":148.26,
        "adjHigh":148.5499,
        "adjLow":143.8,
        "adjOpen":144.53,
        "adjVolume":58607070,
        "divCash":0.0,
        "splitFactor":1.0
    },
    {
        "date":"2019-01-07T00:00:00.000Z",
        "close":147.93,
        "high":148.83,
        "low":145.9,
        "open":148.7,
        "volume":54777764,
        "adjClose":147.93,
        "adjHigh":148.83,
        "adjLow":145.9,
        "adjOpen":148.7,
        "adjVolume":54777764,
        "divCash":0.0,
        "splitFactor":1.0
    }
]
"


### get Crypto price

`GET /crypto-price`

request:

var request = require('request');
var requestOptions = {
        'url': 'https://api.tiingo.com/tiingo/crypto/prices?tickers=btcusd&startDate=2019-01-02&resampleFreq=5min&token=c3bf7802828040c9d69ae657be6130d00007e071',
        'headers': {
            'Content-Type': 'application/json'
            }
        };

request(requestOptions,
        function(error, response, body) {
            console.log(body);
        }
);        

"
response:
[
    {
        "ticker":"btcusd",
        "baseCurrency":"btc",
        "quoteCurrency":"usd",
        "priceData":[
            {
                "open":3914.749407813885,
                "high":3942.374263716895,
                "low":3846.1755315352952,
                "close":3849.1217299601617,
                "date":"2019-01-02T00:00:00+00:00",
                "tradesDone":756.0,
                "volume":339.68131616889997,
                "volumeNotional":1307474.735327181
            }
        ]
    }
]
"


### get fund price

b`GET /fund-price`

var request = require('request');
var requestOptions = {
        'url': 'https://api.tiingo.com/tiingo/funds/berix/metrics?token=c3bf7802828040c9d69ae657be6130d00007e071',
        'headers': {
            'Content-Type': 'application/json'
            }
        };

request(requestOptions,
        function(error, response, body) {
            console.log(body);
        }
);        

response:
"
[
    {
        "prospectusDate":"2021-03-01",
        "netExpense":0.0049,
        "grossExpense":0.0061,
        "managementFee":0.004,
        "12b1":0.0,
        "non12b1":0.0,
        "otherExpenses":0.0021,
        "acquiredFundFees":0.0,
        "feeWaiver":-0.0012,
        "exchangeFeeUSD":0.0,
        "exchangeFeePercent":0.0,
        "backLoad":0.0,
        "frontLoad":0.0,
        "dividendLoad":0.0,
        "shareholderFee":15.0,
        "accountFeeUSD":0.0,
        "accountFeePercent":0.0,
        "redemptionFeeUSD":0.0,
        "redemptionFeePercent":0.0,
        "portfolioTurnover":0.63,
        "miscFees":45.0,
        "customFees":[
            {
                "label":"Wire Fee",
                "value":20.0,
                "units":"$",
                "parentFee":"miscFees"
            },
            {
                "label":"Overnight check delivery fee",
                "value":25.0,
                "units":"$",
                "parentFee":"miscFees"
            }
        ],

    }
    ...
]
"