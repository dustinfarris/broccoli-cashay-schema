# broccoli-cashay-schema

Convert a server graphql schema into a client-safe schema to use with [Cashay][].


## Installation

```
npm i --save broccoli-cashay-schema
```


## Quick Start

Create a server schema builder function that accepts graphql as its only argument, e.g.:

```js
// server/schema-builder.js

export default function(graphql) {
  const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString
  } = graphql;
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
  return new GraphQLSchema({
    query
  });
};
```

broccoli-cashay-schema will execute the function in this file, and then convert the
resulting schema into a new client-safe schema, and then write it back out to a
path that you specify.


## Usage

Note: You must bring your own graphql

```js
var cashaySchemaGenerator = require('broccoli-cashay-schema');
var graphql = require('graphql');

// The plugin will look for a schema.js file in the node you provide
//   You can override with the option `serverSchemaPath`
var node = cashaySchemaGenerator(inputNode, {
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
  graphql: graphql,
  clientSchemaPath: 'client/schema.js'
});
```


## License

This project is distributed under the MIT license



[Cashay]: https://github.com/mattkrick/cashay
