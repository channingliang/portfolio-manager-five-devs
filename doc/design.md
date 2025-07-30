# Design Document

- [Design Document](#design-document)
- [Database Schema](#database-schema)
    - [`account` Table](#account-table)
    - [`cash_transaction` Table](#cash_transaction-table)
    - [`portfolio_holding` Table](#portfolio_holding-table)
    - [`portfolio_transaction` Table](#portfolio_transaction-table)
    - [Changes](#changes)
- [API](#api)
    - [Account Management](#account-management)
        - [Create Account](#create-account)
        - [Get Account](#get-account)
        - [Update Account](#update-account)
        - [Delete Account](#delete-account)
    - [Cash Transactions](#cash-transactions)
        - [Create Cash Transaction](#create-cash-transaction)
        - [Get Cash Transactions](#get-cash-transactions)
        - [Get Cash Distribution](#get-cash-distribution)
    - [Portfolio Management](#portfolio-management)
        - [Get Portfolio Holdings](#get-portfolio-holdings)
        - [Create Portfolio Transaction](#create-portfolio-transaction)
        - [Get Portfolio Transactions](#get-portfolio-transactions)
        - [Get Portfolio Holdings Weekly Change](#get-portfolio-holdings-weekly-change)
        - [Get Stock Market Data](#get-stock-market-data)

## Database Schema

### `account` Table

| Column     | Type          | Attributes         | Description                       |
|------------|---------------|--------------------|-----------------------------------|
| user_id    | int           | auto increment, PK | Unique ID of the account owner    |
| name       | varchar(45)   |                    | Name of the account               |
| currency   | varchar(3)    |                    | Currency code (e.g. USD, EUR)     |
| balance    | decimal(18,2) | default = 0.00     | Current balance of the account    |
| created_at | datetime      |                    | Time the account was created      |
| updated_at | datetime      |                    | Last time the account was updated |

---

### `cash_transaction` Table

| Column          | Type          | Attributes         | Description                                    |
|-----------------|---------------|--------------------|------------------------------------------------|
| cash_account_id | int           | auto increment, PK | Unique ID for the cash transaction             |
| account_id      | int           | FK to account      | Related account's user ID                      |
| type            | tinyint       |                    | Transaction type (e.g. deposit, withdraw)      |
| amount          | decimal(18,2) | default = 0.00     | Transaction amount                             |
| related_id      | int           |                    | ID referencing a related portfolio transaction |
| description     | varchar(255)  |                    | Notes or description of the transaction        |
| occurred_at     | datetime      |                    | When the transaction occurred                  |

---

### `portfolio_holding` Table

| Column               | Type          | Attributes         | Description                             |
|----------------------|---------------|--------------------|-----------------------------------------|
| portfolio_holding_id | int           | auto increment, PK | Unique ID for the portfolio holding     |
| account_id           | int           | FK to account      | Related account's user ID               |
| ticker               | varchar(16)   |                    | Stock or asset symbol                   |
| ticker_type          | tinyint       |                    | Type of asset (e.g. stock, ETF, crypto) |
| quantity             | decimal(18,2) | default = 0.00     | Amount of asset held                    |
| created_at           | datetime      |                    | When the holding was first recorded     |
| updated_at           | datetime      |                    | When the holding was last updated       |

---

### `portfolio_transaction` Table

| Column                   | Type          | Attributes             | Description                               |
|--------------------------|---------------|------------------------|-------------------------------------------|
| portfolio_transaction_id | int           | auto increment, PK     | Unique ID for the portfolio transaction   |
| account_id               | int           | FK to account          | Related account's user ID                 |
| ticker                   | varchar(16)   |                        | Stock or asset symbol                     |
| ticker_type              | tinyint       |                        | Type of asset (e.g. stock, ETF, crypto)   |
| transaction_type         | tinyint       |                        | Buy, sell, dividend, etc.                 |
| quantity                 | decimal(16,2) |                        | Number of units transacted                |
| price_per_unit           | decimal(16,2) |                        | Price per unit of the asset               |
| total_amount             | decimal(16,2) |                        | Total cost or proceeds of the transaction |
| cash_transaction_id      | int           | FK to cash_transaction | Link to the related cash transaction      |
| occurred_at              | datetime      |                        | Date and time of the transaction          |

### Changes

- [ ] change `cash_account_id` in `cash_transaction` to `cash_transaction_id`

## API

All API endpoints follow the RESTful design principles and return JSON responses. The API uses standard HTTP status
codes to indicate success or failure.

### Account Management

#### Create Account

`POST /account`

Request body:

```json
{
  "name": "John Doe",
  "currency": "USD"
}
```

Response:

```json
{
  "code": 201,
  "msg": "Account created successfully.",
  "data": {
    "user_id": 1,
    "name": "John Doe",
    "currency": "USD",
    "balance": 0.00,
    "created_at": "2025-07-25T05:24:42.000Z",
    "updated_at": null
  }
}
```

#### Get Account

`GET /account/{id}`

Request parameters:

```json
{
  "id": 1
}
```

Response:

```json
{
  "code": 200,
  "msg": "Account retrieved successfully.",
  "data": {
    "user_id": 1,
    "name": "John Doe",
    "currency": "USD",
    "balance": 0.00,
    "created_at": "2025-07-25T05:24:42.000Z",
    "updated_at": null
  }
}
```

#### Update Account

`PATCH /account/{id}`

Request parameters:

```json
{
  "id": 1,
  "name": "John Doe Updated",
  "currency": "EUR",
  "balance": 100.00
}
```

Response:

```json
{
  "code": 200,
  "msg": "Account updated successfully.",
  "data": {
    "user_id": 1,
    "name": "John Doe Updated",
    "currency": "EUR",
    "balance": 100.00,
    "created_at": "2025-07-25T05:24:42.000Z",
    "updated_at": "2025-07-25T06:00:00.000Z"
  }
}
```

#### Delete Account

`DELETE /account/{id}`

Request parameters:

```json
{
  "id": 1
}
```

Response:

```json
{
  "code": 204,
  "msg": "Account deleted successfully.",
  "data": {}
}
```

### Cash Transactions

#### Create Cash Transaction

Responsible for managing cash transactions such as deposits and withdrawals.

> Do not use anything like `POST /cash/deposit` or `POST /cash/spend`, because it does not follow RESTful
> principles. Use a single endpoint for all cash transactions.

`POST /cash`

Request body:

```json
{
  "account_id": 1,
  "type": 1,
  "amount": 100.00,
  "description": "Initial deposit"
}
```

In this case, `type` can be:

- `1` for money-in
- `2` for money-out

Response:

```json
{
  "code": 201,
  "msg": "Cash transaction created successfully.",
  "data": {
    "cash_transaction_id": 1,
    "account_id": 1,
    "type": 1,
    "amount": 100.00,
    "related_id": null,
    "description": "Initial deposit",
    "occurred_at": "2025-07-25T05:24:42.000Z",
    "current_balance": 100.00
  }
}
```

#### Get Cash Transactions

`GET /cash`

Request parameters:

```json
{
  "account_id": 1
}
```

Response:

```json
{
  "code": 200,
  "msg": "Cash transactions retrieved successfully.",
  "data": [
    {
      "cash_transaction_id": 1,
      "account_id": 1,
      "type": 1,
      "amount": 100.00,
      "related_id": 1,
      "description": "Initial deposit",
      "occurred_at": "2025-07-25T05:24:42.000Z",
      "current_balance": 100.00
    }
  ]
}
```

#### Get Cash Distribution

`GET /cash/distribution`

Request parameters:

```json
{
  "account_id": 1
}
```

Response:

```json
{
  "code": 200,
  "msg": "Cash distribution retrieved successfully.",
  "data": [
    {
      "name": "Cash",
      "value": 40
    },
    {
      "name": "Stock",
      "value": 30
    }
  ]
}
```

### Portfolio Management

#### Get Portfolio Holdings

`GET /portfolio/holding`

Request parameters:

```json
{
  "account_id": 1
}
```

Response:

```json
{
  "code": 200,
  "msg": "Portfolio holdings retrieved successfully.",
  "data": [
    {
      "portfolio_holding_id": 1,
      "account_id": 1,
      "ticker": "AAPL",
      "ticker_type": 1,
      "quantity": 10.00,
      "created_at": "2025-07-25T05:24:42.000Z",
      "updated_at": null,
      "current": {
        "price_per_unit": 150.00
      },
      "transactions": [
        {
          "portfolio_transaction_id": 1,
          "account_id": 1,
          "ticker": "AAPL",
          "ticker_type": 1,
          "transaction_type": 1,
          "quantity": 10.00,
          "price_per_unit": 150.00,
          "total_amount": 1500.00,
          "cash_transaction_id": 1,
          "occurred_at": "2025-07-25T05:24:42.000Z"
        }
      ]
    }
  ]
}
```

#### Create Portfolio Transaction

`POST /portfolio/transaction`

Request body:

```json
{
  "account_id": 1,
  "ticker": "AAPL",
  "ticker_type": 1,
  "transaction_type": 1,
  "quantity": 10.00,
  "price_per_unit": 150.00
}
```

Response:

```json
{
  "code": 201,
  "msg": "Portfolio transaction created successfully.",
  "data": {
    "portfolio_transaction_id": 1,
    "account_id": 1,
    "ticker": "AAPL",
    "ticker_type": 1,
    "transaction_type": 1,
    "quantity": 10.00,
    "price_per_unit": 150.00,
    "total_amount": 1500.00,
    "cash_transaction_id": 1,
    "occurred_at": "2025-07-25T05:24:42.000Z"
  }
}
```

#### Get Portfolio Transactions

`GET /portfolio/transaction`

Request parameters:

```json
{
  "account_id": 1
}
```

Response:

```json
{
  "code": 200,
  "msg": "Portfolio transactions retrieved successfully.",
  "data": [
    {
      "portfolio_transaction_id": 1,
      "account_id": 1,
      "ticker": "AAPL",
      "ticker_type": 1,
      "transaction_type": 1,
      "quantity": 10.00,
      "price_per_unit": 150.00,
      "total_amount": 1500.00,
      "cash_transaction_id": 1,
      "occurred_at": "2025-07-25T05:24:42.000Z"
    }
  ]
}
```

#### Get Portfolio Holdings Weekly Change

`GET /portfolio/week`

Request parameters:

```json
{
  "account_id": 1
}
```

Response:

```json
{
  "code": 200,
  "msg": "Portfolio weekly change retrieved successfully.",
  "data": [
    {
      "name": "Cash",
      "data": [
        1000,
        1200,
        1500,
        1300,
        1600,
        1800,
        1555
      ]
    },
    {
      "name": "Portfolio",
      "data": [
        150,
        200,
        250,
        300,
        350,
        400,
        450
      ]
    },
    {
      "name": "Profit",
      "data": [
        50,
        80,
        100,
        120,
        150,
        180,
        200
      ]
    }
  ]
}
```

### Get Stock Market Data

`GET /market/stock`

*Optional* request parameters:

```json
{
  "search": "AAPL"
}
```

Response:

```json
{
  "code": 200,
  "msg": "Stock market data retrieved successfully.",
  "data": [
    {
      "ticker": "AAPL",
      "name": "Apple Inc.",
      "detail": [
        {
          "date": "2025-07-28T00:00:00.000Z",
          "close": 214.05,
          "high": 214.845,
          "low": 213.06,
          "open": 214.03,
          "volume": 37858017,
          "adjClose": 214.05,
          "adjHigh": 214.845,
          "adjLow": 213.06,
          "adjOpen": 214.03,
          "adjVolume": 37858017,
          "divCash": 0.0,
          "splitFactor": 1.0
        }
      ]
    }
  ]
}
```

## Function Modules

### Cash Top-up

1. User clicks top-up payment button
2. Frontend will send `POST /cash`, with the following parameters:
    - `account_id`: The ID of the account to top up
    - `type`: Set to `1` for deposit
    - `amount`: The amount to deposit
    - `description`: Optional description for the transaction
3. Backend will process the request
4. Create a new data in `cash_transaction` table
5. Update the `balance` in the `account` table
6. Add balance to the `current_balance` field in the response
7. Return a response

### Get Stock Market Data

1. User enters stock market page
2. Frontend will send `GET /market/stock` request with optional search parameters:
    - `search`: Optional search term to filter stocks by ticker or name
3. Backend will process the request
4. If `search` is provided, filter the stock companies by ticker or name. Otherwise, return all stock companies
5. Get the latest 30 days stock data for each company and return it

### Buy Stock

1. User clicks buy button on the specific stock in the stock market page
2. Frontend will send `POST /portfolio/transaction` request with the following parameters:
    - `account_id`: The ID of the account making the purchase
    - `ticker`: The stock ticker symbol
    - `ticker_type`: The type of the product
    - `transaction_type`: Set to `1` for buying
    - `quantity`: The number of shares to buy
    - `price_per_unit`: The price per share
3. Backend will process the request
4. Check if user's balance is sufficient to cover the purchase
5. Create a new record in the `cash_transaction` table with type `2` (money-out)
6. Update the `balance` in the `account` table
7. Create a new record in the `portfolio_transaction` table, remember to link `cash_transaction_id`
8. Check if the user already has a holding for this stock
9. If not, create a new record in the `portfolio_holding` table, otherwise update the existing holding
10. Return a response with the transaction detail

### Dashboard Cash Transactions Table

1. User enters the dashboard page
2. Frontend will send `GET /cash` request with the following parameters:
    - `account_id`: The ID of the account to retrieve transactions for
3. Backend will process the request
4. Find all cash transactions for the specified account
5. Return a response with the list of cash transactions

### Dashboard Portfolio Holdings Overview

1. User enters the dashboard page
2. Frontend will send `GET /portfolio/holding` request with the following parameters:
    - `account_id`: The ID of the account to retrieve holdings for
3. Backend will process the request
4. Find all portfolio holdings for the specified account
5. For each holding, retrieve the transaction details, and calculate the get current value based on the latest market
   data (specification needed)
6. Return a response with the list of portfolio holdings, including current value and transaction details

### Dashboard Pie Chart

1. User enters the dashboard page
2. Frontend will send `GET /cash/distribution` request with the following parameters:
    - `account_id`: The ID of the account to retrieve holdings for
3. Backend will process the request
4. Calculate the distribution of cash by wallet, stock, and other assets (currently we only have cash and stocks)
5. Return a response with the distribution data for the pie chart

### Dashboard Line Graph

1. User enters the dashboard page
2. Frontend will send `GET /portfolio/week` request with the following parameters:
    - `account_id`: The ID of the account to retrieve holdings for
3. Backend will process the request
4. Calculate the change of balance over the past week
5. Calculate the overall value of the portfolio over the past week
6. Calculate the profit of the portfolio over the past week
7. Return a response with the data for the line graph, including balance, portfolio value, and profit

### Sell Stock

1. User clicks sell button on the specific stock in the portfolio page
2. Frontend will send `POST /portfolio/transaction` request with the following parameters:
    - `account_id`: The ID of the account making the sale
    - `ticker`: The stock ticker symbol
    - `ticker_type`: The type of the product
    - `transaction_type`: Set to `2` for selling
    - `quantity`: The number of shares to sell
    - `price_per_unit`: The price per share
3. Backend will process the request
4. Check if the user has enough shares to sell
5. Create a new record in the `cash_transaction` table with type `1` (money-in)
6. Update the `balance` in the `account` table
7. Create a new record in the `portfolio_transaction` table, remember to link `cash_transaction_id`
8. Update the existing holding in the `portfolio_holding` table
9. Return a response with the transaction detail
