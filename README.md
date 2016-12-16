# broccoli-cashay-schema

[![CircleCI](https://circleci.com/gh/dustinfarris/broccoli-cashay-schema.svg?style=svg)](https://circleci.com/gh/dustinfarris/broccoli-cashay-schema)

Convert a server graphql schema into a client-safe schema to use with [Cashay][].

Compatible with graphql 0.7.1 and cashay ^0.22.1. (You must install them yourself)

Note that the version of graphql _must_ match the version used by Cashay.  When Cashay [removes graphql as a dependency](https://github.com/mattkrick/cashay/issues/148), this will no longer be a restriction.

```
npm i --save graphql
npm i --save cashay
```


## Installation

```
npm i --save broccoli-cashay-schema
```


## Quick Start

Create a server schema, e.g.:

```js
// server/schema-builder.js

import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString
} from 'graphql';

const query = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    hello: {
      type: GraphQLString,
      resolve() {
        return 'world';
      }
    }
  }
});

export default new GraphQLSchema({ query });
```

broccoli-cashay-schema will convert the schema into a new client-safe schema, and then write it back out to a path that you specify.


## Usage

Note: You must bring your own graphql and cashay

```js
var cashaySchemaGenerator = require('broccoli-cashay-schema');
var cashay = require('cashay');
var graphql = require('graphql');

// The plugin will look for a schema.js file in the node you provide
//   You can override with the option `serverSchemaPath`
var node = cashaySchemaGenerator(inputNode, {
  cashay: cashay,
  graphql: graphql,
  clientSchemaPath: 'client/schema.js'
});
```


## ES6 Syntax

If you are (likely) using ES6 (ECMAScript 2015), you will need to transpile the schema
file before passing it to broccoli-cashay-schema.

This can be done easily with [broccoli-babel-transpiler](https://github.com/babel/broccoli-babel-transpiler):

```js
var esTranspiler = require('broccoli-babel-transpiler');

var node = cashaySchemaGenerator(esTranspiler(inputNode), {
  cashay: cashay,
  graphql: graphql,
  clientSchemaPath: 'client/schema.js'
});
```


## License

This project is distributed under the MIT license



[Cashay]: https://github.com/mattkrick/cashay
