"use strict";

/**
 * Validations return true or false depending on whether they pass or fail.
 */

var Base = require('superjs-base');
var SuperJS = require('superjs');
var _ = require('underscore');
var validator = require('validator');
var Promise = require('bluebird');

module.exports = Base.extend(SuperJS.Meta, {

  _metaFile: function() {
    this._loadMeta(__filename);
  },

  //todo: add underscore prefix or move validations into an object namespace to prevent
  //the setup or process methods from being used as validations

  //setup validations for the given property by creating an array of closures
  //which contain promises to validate
  setup: function(validations, context, propertyName, contextName) {

    //maintain reference to instance
    var self = this;

    //maintain list of closures
    var list = [];

    //default context name to property
    if( !contextName ) {
      contextName = 'property';
    }

    //loop through validations asynchronously
    Object.keys(validations).map(function(validation, index ){

      var options = validations[validation];

      list.push(function() {

        var response = {};

        response[contextName] = propertyName;
        response.value = context[propertyName];
        response.validation = validation;

        if( options !== true ) {
          response.options = options;
        }

        response.description = self.meta.methods[validation];

        console.log(':: executing validation:', JSON.stringify({context: contextName, property: propertyName, validation: validation}));
        if( self[validation](context[propertyName], options) ) {
          return true;
        } else {
          return response;
        }



      });


    });

    return list;

  },

  process: function(list) {

    //maintain reference to instance
    var self = this;

    //maintain list of promises for all parameters of this request
    var validations = [];

    return new Promise(function(resolve, reject) {

      for( var validation in list ) {

        var response = list[validation]();

        if( response !== true) {
          console.log(response);
          return reject(new SuperJS.Error('validation_error', 'A validation error occurred processing the request.', {status: 422, exceptions: [response]}));
        }

      }

      resolve();

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

  /*len: function(x, min, max){ //todo: how do we pass two values?
   return validator.isLength(x, min, max);
   },*/

  len: function(x, length){ //todo: changed to handle single value
    return validator.isLength(x, length, length);
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

