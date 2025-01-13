# Expense Tracker API

## Project Description

This project is an Expense API built using Node.js and Express. The purpose of this project is to practice creating a Rest API with Authentication and filtering using query parameters.

## API Endpoints

### Auth Routes

1. `POST /api/v1/auth/register` - Pass in req body name, email, and password to create a user
2. `POST /api/v1/auth/login` - Login by passing in email and password

### Expense Routes

1. `GET /api/v1/expense` - Retrieves a list of expense. Query parameters can be added 
   - category - (groceries, leisure, electronics, utilities, clothing, health, other)
   - time - (week, month, 3month)
   - startDate and endDate - start and end date of time frame we want to see
   - limit - limit of items we want returned, defaults to 10
   - page - the page of results we want to see

2. `GET /api/v1/expense/:expenseId` - Retrieves the expense corresponding to expense ID passed in
3. `POST /api/v1/expense` - Adds an expense. Pass in fields in body. Fields - name, cost (cost are stored as integers, so for 12.99 store it as 1299), category(groceries, leisure, electronics, utilities, clothing, health, other), date
4. `DELETE /api/v1/expense/:expenseId` - Deletes the expense corresponding to expense ID passed in
5. `PATCH /api/v1/expense/:expenseId` - Updates the expense corresponding to expense ID passed in. Pass in fields to update in body

## Requirements

[Node.js](https://nodejs.org/en)\
[MongoDB](https://www.mongodb.com/)

## Setup

1. Clone repo
2. run `npm install`
3. Create .env file and Add environmental variables below
    - MONGO_URI (URI of your MongoDB instance)
    - JWT_LIFETIME (Duration of jwt ex. 30d)
    - JWT_SECRET (Your generated JWT secret [Use this link to generate 256 key](https://acte.ltd/utils/randomkeygen])
4. Start up MongoDB instance of running locally
5. run `npm start`
6. Make sure to register and login before hitting any of the expense routes

## Credits

This project idea is from [roadmap.sh](https://roadmap.sh/projects/expense-tracker-api)
