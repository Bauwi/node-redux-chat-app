# Project Title

Basic Chat App built with React/Redux, Express, MongoDB and Mongoose

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

* Having a node 7.6 or later version installed on your machine.
* Having MongoDB installed on your machine.

### Installing

After cloning the repo:

install node modules:

```
npm install
```

Run the local MongoDB specifying the dbPath for mongod to use as a data directory

```
./mongod --dbpath ~/mongo-data
```

Start the webpack development server

```
npm run dev-client
```

Start the Express server

```
npm run dev-server
```

## Running the tests

In construction.

## Deployment

You can build your bundle before deploying using :

```
npm run build:dev
```

You will need to setup a JWT_SECRET and MONGODB_URI env variables to your server.

## Built With

* [React](https://reactjs.org/) - 16.0.0 - The web framework used
* [Redux](https://redux.js.org/) - 5.0.6 - Predictable state container for JavaScript apps
* [Express](http://expressjs.com/) - 4.15.4 - Web framework for Node.js
* [Antd](https://ant.design/docs/spec/introduce) - 3.1.3 - Components Library

## Contributing

As it is a very simple demo for a portfolio, no contribution is needed.

## Authors

**Bauwi**

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
