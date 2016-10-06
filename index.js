var FileCreator = require('broccoli-file-creator');
var RSVP = require('rsvp');
var { transformSchema } = require('cashay');
// const graphql = require('graphql').graphql;

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
  require('babel-register')({
    presets: [require.resolve('babel-preset-es2015')]
  });
  const rootSchema = require(this.rootSchemaPath).default;
  var _this = this;
  return new RSVP.Promise(function(resolve, reject) {
    transformSchema(rootSchema, _this.graphql).then(function(schema) {
      _this.content = "module.exports = " + JSON.stringify(schema);
      console.log(_this.content);
      console.log(_this.filename);
      resolve(_this.content);
    });
  });
}
