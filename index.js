var FileCreator = require('broccoli-file-creator');
var RSVP = require('rsvp');
var { transformSchema } = require('cashay');

module.exports = CashaySchema;

CashaySchema.prototype = Object.create(FileCreator.prototype);
CashaySchema.prototype.constructor = CashaySchema;

function CashaySchema(graphql, rootSchemaPath, outputFile, _options) {
  if (!(this instanceof CashaySchema)) {
    return new CashaySchema(graphql, rootSchemaPath, outputFile, _options);
  }

  FileCreator.call(this, outputFile, '', _options);

  this.rootSchemaPath = rootSchemaPath;
  this.filename = outputFile;
  this.graphql = graphql;
}

CashaySchema.prototype.getContent = function() {
  // Allow es2015 syntax in our rootSchema file
  require('babel-register')({
    presets: [require.resolve('babel-preset-es2015')]
  });
  // Load the module and build the rootSchema
  var graphql = this.graphql;
  var rootSchema = require(this.rootSchemaPath).default(graphql);
  return new RSVP.Promise(function(resolve, reject) {
    // Transform the schema into a client-safe schema
    transformSchema(rootSchema, graphql.graphql).then(function(schema) {
      resolve("export default " + JSON.stringify(schema));
    });
  });
}
