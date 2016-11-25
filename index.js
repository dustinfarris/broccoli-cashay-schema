require('string.prototype.startswith');
// TODO: remove this polyfill when cashay addresses
// https://github.com/mattkrick/cashay/issues/136

var Filter = require('broccoli-filter');
var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');

module.exports = CashaySchema;

CashaySchema.prototype = Object.create(Filter.prototype);
CashaySchema.constructor = CashaySchema;

function checkOptions(options) {
  if (!options.graphql) {
    throw new Error(
    'You must provide the graphql package to broccoli-cashay-schema');
  }

  if (!options.cashay) {
    throw new Error(
    'You must provide the cashay package to broccoli-cashay-schema');
  }
}

function CashaySchema(inputNode, _options) {
  var options = _options || {};

  if (!(this instanceof CashaySchema)) {
    return new CashaySchema(inputNode, options);
  }

  checkOptions(options);

  Filter.call(this, inputNode, {
    annotation: options.annotation
  });

  // Cashay package
  this.cashay = options.cashay;
  // GraphQL package
  this.graphql = options.graphql;
  // Server schema path relative to `inputNode`
  this.serverSchemaPath = options.serverSchemaPath || 'schema.js';
  // Output path for the client schema (will be appended to plugin output dir)
  this.clientSchemaPath = options.clientSchemaPath || 'client/schema.js';
}

CashaySchema.prototype.canProcessFile = function(relativePath) {
  return relativePath === this.serverSchemaPath;
}

CashaySchema.prototype.getDestFilePath = function() {
  return this.clientSchemaPath;
}

CashaySchema.prototype.processFile = function(srcDir, destDir, relativePath) {

  var outputPath = path.join(destDir, this.getDestFilePath(relativePath));

  // Load the server schema
  var fullPath = path.join(srcDir, relativePath);
  var rootSchema = require(fullPath)(this.graphql);

  // Generate a client-safe schema
  return this.cashay.transformSchema(rootSchema, this.graphql.graphql).
    then(function(clientSchema) {
      var content = 'export default ' + JSON.stringify(clientSchema);
      mkdirp.sync(path.dirname(outputPath));
      fs.writeFileSync(outputPath, content, { encoding: 'utf-8' });
    });
}
