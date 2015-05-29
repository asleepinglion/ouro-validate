"use strict";

/**
 * Validations return true or false depending on whether they pass or fail.
 */

var Base = require('superjs-base');
var SuperJS = require('superjs');
var _ = require('underscore');
var validator = require('validator');
var Promise = require('bluebird');

module.exports = Base.extend({

  _metaFile: function() {
    this._super();
    this._loadMeta(__filename);
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

  int: validator.isInt,

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

  len: function(x, length) { //todo: changed to handle single value
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

  number: validator.isInt,

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

  undefined: function(x) {
    return (typeof x === 'undefined');
  },

  url: function(x, val) {
    return validator.isURL(x, val === true ? undefined : val);
  }

});