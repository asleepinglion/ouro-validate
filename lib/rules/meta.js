module.exports = {

  class: "Rules",
  extends: "Class",
  description: "The Rules class provides common validaiton rules.",

  methods: {

    creditCard: {
      description: "The value must be a valid credit card number.",
      rule: true
    },

    date: {
      description: "The value must be a valid date.",
      rule: true
    },

    datetime: {
      description: "The value must be a valid date.",
      rule: true
    },

    email: {
      description: "The value must be a valid e-mail address.",
      rule: true
    },

    empty: {
      description: "The value must be empty.",
      rule: true
    },

    float: {
      description: "The value must be a float value.",
      rule: true
    },

    folderName: {
      description: "The value must be in folder name format.",
      rule: true
    },

    in: {
      description: "The value must be in a set of values.",
      rule: true
    },

    int: {
      description: "The value must be an integer.",
      rule: true
    },

    integer: {
      description: "The value must be an integer.",
      rule: true
    },

    json: {
      description: "The value must be valid JSON.",
      rule: true
    },

    latitude: {
      description: "The value must be a valid latitude.",
      rule: true
    },

    len: {
      description: "The value must have a length between the specified amount of characters.",
      rule: true
    },

    longitude: {
      description: "The value must be a valid longitude.",
      rule: true
    },

    lowercase: {
      description: "The value must be all lowercase characters.",
      rule: true
    },

    max: {
      description: "The value must be less than this amount.",
      rule: true
    },

    maxLength: {
      description: "The value can have this many characters.",
      rule: true
    },

    min: {
      description: "The value must be greater than this amount.",
      rule: true
    },

    minLength: {
      description: "The value can have a minimum of this many characters.",
      rule: true
    },

    notEmpty: {
      description: "The value cannot be empty.",
      rule: true
    },

    number: {
      description: "The value must be an number.",
      rule: true
    },

    object: {
      description: "The value must be an object.",
      rule: true
    },

    required: {
      description: "The value is required and must not be empty or null.",
      rule: true
    },

    string: {
      description: "The value must be a string.",
      rule: true
    },

    subdomain: {
      description: "The value must be a valid subdomain.",
      rule: true
    },

    text: {
      description: "The value must be text.",
      rule: true
    },

    undefined: {
      description: "The value must not be defined.",
      rule: true
    },

    url: {
      description: "The value must be a valid URL.",
      rule: true
    }
  }

};
