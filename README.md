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
var cashaySchema = require('broccoli-cashay-schema');
var graphql = require('graphql');

var schemaBuilderPath = 'server/schema-builder.js'
var clientSafeOutputPath = 'client/schema.js'

var node = cashaySchema(graphql, schemaBuilderPath, clientSafeOutputPath);
```


## License

This project is distributed under the MIT license



[Cashay]: https://github.com/mattkrick/cashay
