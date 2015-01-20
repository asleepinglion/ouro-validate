
/**
 * Validations return true or false depending on whether they pass or fail. In addition to
 * the validations, the library provides a mechanism to setup and process a group of validations
 * using the bluebird Promise Library.
 *
 * @exports Validate
 * @namespace SuperJS.Validate
 * @extends SuperJS.Class
 *
 */

/**
 * Some of the methods have been copied from the Sails project's validation system `anchor`,
 * Copyright © 2012- Mike McNeil.
 */

"use strict";

var SuperJS = require('superjs');

var _ = require('underscore');
var validator = require('validator');
var Promise = require('bluebird');

//todo: move rule descrptions to blueprint?

module.exports = SuperJS.Class.extend({

  rules: {

    date: "The value must be a valid date.",

    email: "The value must be a valid e-mail address.",

    empty: "The value must be empty.",

    float: "The value must be a float value.",

    in: "The value must be in a set of values.",

    integer: "The value must be an integer.",

    json: "The value must be valid JSON.",

    len: "The value must have a length between the specified amount of characters.",

    lowercase: "The value must be all lowercase characters.",

    max: "The value must be less than this amount.",

    maxLength: "The value can have this many characters.",

    min: "The value must be greater than this amount.",

    minLength: "The value can have a minimum of this many characters.",

    required: "The value is required and must not be empty or null.",

    string: "The value must be a string.",

    text: "The value must be text.",

    url: "The value must be a valid URL."

  },

  //setup validations for the given property by creating an array of closures
  //which contain promises to validate
  setup: function(validations, propertyName, value) {

    //maintain reference to instance
    var self = this;

    //maintain list of closures
    var list = [];

    //loop through validations asynchronously
    Object.keys(validations).map(function( options, index ){

      var validation = Object.keys(validations)[index];

      list.push(function() {

        return new Promise(function(resolve,reject) {

          if( self[validation](value,options) ) {
            resolve();
          } else {
            reject({property: propertyName, rule: validation, description: self.rules[validation]});
          }

        });

      });

    });

    return list;

  },

  process: function(list) {

    //maintain reference to instance
    var self = this;

    //maintain list of promises for all parameters of this request
    var validations = [];

    //execute each closure and append each promise to the array
    for( var closure in list ) {
      validations.push(list[closure]());
    }

    //settle all validations and resolve with any exceptions
    return Promise.settle(validations)

      .then(function(results) {

        //maintain a list of exceptions
        var exceptions = [];

        //loop over results and append any reject reasons
        for( var result in results ) {

          if( results[result].isRejected() ) {
            exceptions.push(results[result].reason());
          }

        }

        //if there were any exceptions throw an error
        if( exceptions.length > 0 ) {
          throw new SuperJS.Error('validation_error', 422, 'One or more validation errors occurred processing the request.', {exceptions: exceptions});
        }

      });
  },





  date: validator.isDate,

  email: validator.isEmail,

  empty: _.isEmpty,

  float: validator.isFloat,

  in: validator.isIn,

  integer: validator.isInt,

  json: function(x) {
    try {
      JSON.parse(x);
    } catch (e) {
      return false;
    }
    return true;
  },

  len: function(x, min, max){
    return validator.len(x, min, max);
  },

  lowercase: validator.isLowercase,

  max: function (x, val) {
    var number = parseFloat(x);
    return isNaN(number) || number <= val;
  },

  maxLength: function(x, max) {
    return validator.isLength(x, 0, max);
  },

  min: function(x, val) {
    var number = parseFloat(x);
    return isNaN(number) || number >= val;
  },

  minLength: function(x, min) {
    return validator.isLength(x, min);
  },

  //todo: review code and possibly rewrite to simplify...
  required: function (x) {
    // Transform data to work properly with node validator
    if (!x && x !== 0) {
      x = '';
    } else if (typeof x.toString !== 'undefined') {
      x = x.toString();
    }
    else {
      x = '' + x;
    }
    if( validator.isNull(x) ) {
      return false;
    } else {
      return true;
    }

  },

  string: _.isString,

  text: _.isText,

  url: function(x, val) {
    return validator.isURL(x, val === true ? undefined : val);
  }

  });
