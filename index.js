var fs = require('fs');
var path = require('path');
var Plugin = require('broccoli-plugin');
var mkdirp = require('mkdirp');
var transformSchema = require('cashay').transformSchema;

module.exports = CashaySchema;

CashaySchema.prototype = Object.create(Plugin.prototype);
CashaySchema.prototype.constructor = CashaySchema;

function CashaySchema (graphql, rootSchemaPath, outputFile, _options) {
  var options = _options || {};

  if (!(this instanceof CashaySchema)) {
    return new CashaySchema(graphql, rootSchemaPath, outputFile, options);
  }

  // If user supplies a `watchNode` option, we will pass it as `inputNodes`
  // to the broccoli-plugin base class, which will have the effect of
  // re-building the cashay client schema whenever the node is changed
  // e.g. when the user writes changes to a file in their project
  var inputNodes = options.watchNode ? [options.watchNode] : [];

  Plugin.call(this, inputNodes, {
    annotation: options.annotation || this.constructor.name + ' ' + outputFile,
    persistentOutput: true
  });

  this.rootSchemaPath = rootSchemaPath;
  this.filename = outputFile;
  this.graphql = graphql;
}


CashaySchema.prototype.build = function() {
  var outputFilePath = path.join(this.outputPath, this.filename);
  // Allow es2015 syntax in our rootSchema file
  require('babel-register')({
    presets: [require.resolve('babel-preset-es2015')]
  });
  // Load the module and build the rootSchema
  var graphql = this.graphql;
  var rootSchema = require(this.rootSchemaPath).default(graphql);

  return transformSchema(rootSchema, graphql.graphql).then(function(schema) {
    var content = "export default " + JSON.stringify(schema);
    mkdirp.sync(path.dirname(outputFilePath));
    fs.writeFileSync(outputFilePath, content, { encoding: 'utf-8' });
  });
}
