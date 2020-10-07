# Games Ecommerce Admin
This repository is part of a long-term project of mine, called *Games Ecommerce*.
As the name says, it is an e-commerce focused on Games, to sell physical games and consoles.
All the products and transactions are fake, so in case of a user making order, this user won't be charged and also won't receive the product.

This repository is the frontend for the Admin Portal. It is responsible for all the interactions an admin user can make, such as manage products, users and orders.

There are other two repositories that complement *games-ecommerce-admin*:

- [games-ecommerce-server](https://github.com/vitorbraga/games-ecommerce-server): backend of the whole project, which handles the database access and all the requests users can make
- [games-ecommerce-app](https://github.com/vitorbraga/games-ecommerce-app): frontend Store, where users can see the products and make orders

The project is in an MVP state. It has a basic ecommerce functionality. It still has lot of features and improvements to make and I plan to implement them over time.



## Stack

- **React.Js**: The UI Framework I'm most familiar with. I think it's a very complete tool and it has a good backup in it's community.
- **Typescript**: I like it because it prevents lots of errors at compile time
- **Redux:** Global state library. There are other libraries I could choose, but I went with Redux as this is the one I'm most familiar with
- **Material UI React**: Pack of UI elements, the first pack I learned to use. I would like to keep this repository using this library as a reference for future use.
- **Formik + Yup:** great combo for handling forms and validation



## Current features

- [x] Authentication
  - [x] Registration, Login, Password recovery
- [x] Products
  - [x] List, Create, Update products
- [x] Categories
  - [x] List, create and delete subcategories tree
- [x] Admin Account overview
- [x] Change password



## Next features in the backlog

- [ ] Products pagination
- [ ] Delete product
- [ ] Coupons
- [ ] Discounts
- [ ] Dashboard overview with orders and users



## Running the project

Steps to run this project:

##### First things first:

Run `npm i` command to install the dependencies.

##### Running development

1. Run `npm run start:dev` command to start development environment and you are good to go
2. The server will start at `http://localhost:5000`

##### Running production

TODO

## Environment variables

This application is complex, then we have lots of configuration to do. As this configuration is either confidential data or is environment-based, we need to make environment variables out of them, so we are more protected and the application can run properly.
All custom environment variables should have the prefix `REACT_APP_` in order to be correctly loaded by CreateReactApp.

| Variable                             | Expected values                                              |
| ------------------------------------ | ------------------------------------------------------------ |
| NODE_ENV                             | Environment: *development* or *production*                   |
| REACT_APP_SERVER_BASE_URL            | Base URL for the backend<br />Example for development:  http://localhost:4000<br />Example for production: https://games-ecommerce-server.herokuapp.com/ |
| REACT_APP_WEBSITE_BASE_URL           | Base URL for the Store.<br />Example for development:  http://localhost:3000<br />Example for production: https://games-ecommerce-app.herokuapp.com/ |
| REACT_APP_S3_BUCKET_PRODUCT_PICTURES | Name of the AWS S3 bucket where the product pictures are stored. |