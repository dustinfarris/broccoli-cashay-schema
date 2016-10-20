var FileCreator = require('broccoli-file-creator');
var RSVP = require('rsvp');
var { transformSchema } = require('cashay');
var graphql = require('graphql');

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
}

CashaySchema.prototype.getContent = function() {
  require('babel-register')({
    presets: [require.resolve('babel-preset-es2015')]
  });
  var rootSchema = require(this.rootSchemaPath).default(graphql);
  var _this = this;
  return new RSVP.Promise(function(resolve, reject) {
    transformSchema(rootSchema, graphql.graphql).then(function(schema) {
      _this.content = "export default " + JSON.stringify(schema);
      resolve(_this.content);
    });
  });
}
