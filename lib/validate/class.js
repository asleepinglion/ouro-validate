"use strict";

/**
 * Validations return true or false depending on whether they pass or fail.
 */

var Base = require('superjs-base');
var SuperJS = require('superjs');
var _ = require('underscore');
var validator = require('validator');
var Promise = require('bluebird');
var Rules = require('../rules/class');

module.exports = Base.extend(SuperJS.Meta, Rules, {

  _metaFile: function() {
    this._loadMeta(__filename);
  },

  //setup validations for the given property by creating an array of closures
  setup: function(validations, context, propertyName, contextName) {

    //maintain reference to instance
    var self = this;

    //maintain list of closures
    var list = [];

    //default context name to property
    if( !contextName ) {
      contextName = 'property';
    }

    //create a list of validations to execute together
    Object.keys(validations).map(function(validation, index ) {

      var options = validations[validation];

      if( self.meta.methods[validation].async ) {

        list.push({

          meta: self.meta.methods[validation],
          method: new Promise(function(resolve, reject) {

            self[validation](context[propertyName], options)

            var response = {};

            response[contextName] = propertyName;
            response.value = context[propertyName];
            response.validation = validation;

            if( options !== true ) {
              response.options = options;
            }

            response.description = self.meta.methods[validation].description;

            console.log(':: executing validation:', JSON.stringify({
              context: contextName,
              property: propertyName,
              validation: validation
            }));

            self[validation](context[propertyName], options)
              .then(function() {
                resolve();
              })
              .catch(function(err) {
                reject(err);
              });

          })
        });

      } else {


        list.push({

          meta: self.meta.methods[validation],
          method: function () {

            var response = {};

            response[contextName] = propertyName;
            response.value = context[propertyName];
            response.validation = validation;

            if (options !== true) {
              response.options = options;
            }

            response.description = self.meta.methods[validation].description;

            console.log(':: executing validation:', JSON.stringify({
              context: contextName,
              property: propertyName,
              validation: validation
            }));

            if (self[validation](context[propertyName], options)) {
              return true;
            } else {
              return response;
            }

          }
        });
      }



    });

    return list;

  },

  //execute vallidations and reject on any failure
  process: function(list) {

    //maintain reference to instance
    var self = this;

    //maintain list of promises for all parameters of this request
    var validations = [];

    return new Promise(function(resolve, reject) {

      var response = false;
      var asyncList = [];

      for( var validation in list ) {

        //only methods marked as rules can be used as validations
        if( !list[validation].meta.rule ) {
          continue;
        }

        var response = false;

        if( list[validation].meta.async ) {

          asyncList.push(list[validation].method);

        } else {

          response = list[validation].method();

          if (response !== true) {
            console.log(response);
            return reject(new SuperJS.Error('validation_error', 'A validation error occurred processing the request.', {
              status: 422,
              exceptions: [response]
            }));
          }
        }

      }

      if( asyncList.length > 0 ) {

        Promise.all(asyncList)
          .then(function() {
            resolve();
          })
          .catch(function(err) {
            err.status = 422;
            return reject(new SuperJS.Error('validation_error', 'A validation error occured processing the request.', err));
          })
      }

      resolve();

    });



  }

});
