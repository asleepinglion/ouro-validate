
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

    creditCard: "The value must be a valid credit card number.",
    date: "The value must be a valid date.",
    email: "The value must be a valid e-mail address.",
    empty: "The value must be empty.",
    float: "The value must be a float value.",
    folderName: "The value must be in folder name format.",
    in: "The value must be in a set of values.",
    integer: "The value must be an integer.",
    json: "The value must be valid JSON.",
    latitude: "The value must be a valid latitude.",
    len: "The value must have a length between the specified amount of characters.",
    longitude: "The value must be a valid longitude.",
    lowercase: "The value must be all lowercase characters.",
    max: "The value must be less than this amount.",
    maxLength: "The value can have this many characters.",
    min: "The value must be greater than this amount.",
    minLength: "The value can have a minimum of this many characters.",
    notEmpty: "The value cannot be empty.",
    object: "The value must be an object.",
    required: "The value is required and must not be empty or null.",
    string: "The value must be a string.",
    subdomain: "The value must be a valid subdomain.",
    text: "The value must be text.",
    url: "The value must be a valid URL."

  },

  //todo: add underscore prefix or move validations into an object namespace to prevent
  //the setup or process methods from being used as validations

  //setup validations for the given property by creating an array of closures
  //which contain promises to validate
  setup: function(validations, propertyName, value) {

    //maintain reference to instance
    var self = this;

    //maintain list of closures
    var list = [];

    //loop through validations asynchronously
    Object.keys(validations).map(function(validation, index ){

      var options = validations[validation];

      list.push(function() {

        return new Promise(function(resolve,reject) {

          if( self[validation](value,options) ) {
            resolve();
          } else {
            reject({property: propertyName, value: value, rule: validation, options: options, description: self.rules[validation]});
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

  creditCard: validator.isCreditCard,

  date: validator.isDate,

  datetime: validator.isDate,

  email: validator.isEmail,

  empty: _.isEmpty,

  float: validator.isFloat,

  folderName: function(x) {
    return /^[a-zA-Z0-9-_]+$/.test(x);
  },

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

  latitude:  function(x){
    return /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/.test(x);
  },

  len: function(x, min, max){
    return validator.len(x, min, max);
  },

  longitude: function(x){
    return /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/.test(x);
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

  notEmpty: function (x) {
      // Transform data to work properly with node validator
      if (!x) x = '';
      else if (typeof x.toString !== 'undefined') x = x.toString();
      else x = '' + x;

      return !validator.isNull(x);
  },

  object: function(x) {

    if( (typeof x === 'object') && (x !== null ) ) {
      return true;
    } else {
      return false;
    }

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

  subdomain: function(x) {
    return /(?:[A-Za-z0-9][A-Za-z0-9\-]{0,61}[A-Za-z0-9]|[A-Za-z0-9])/.test(x);
  },

  text: _.isString,

  url: function(x, val) {
    return validator.isURL(x, val === true ? undefined : val);
  }

  });

