module.exports = {

  class: "Validate",
  extends: "Class",
  description: "The Validate class provides essential methods for validating arguments & parameters.",

  methods: {

    creditCard: {
      description: "The value must be a valid credit card number."
    },

    date: {
      description: "The value must be a valid date."
    },

    datetime: {
      description: "The value must be a valid date."
    },

    email: {
      description: "The value must be a valid e-mail address."
    },

    empty: {
      description: "The value must be empty."
    },

    float: {
      description: "The value must be a float value."
    },

    folderName: {
      description: "The value must be in folder name format."
    },

    in: {
      description: "The value must be in a set of values."
    },

    integer: {
      description: "The value must be an integer."
    },

    json: {
      description: "The value must be valid JSON."
    },

    latitude: {
      description: "The value must be a valid latitude."
    },

    len: {
      description: "The value must have a length between the specified amount of characters."
    },

    longitude: {
      description: "The value must be a valid longitude."
    },

    lowercase: {
      description: "The value must be all lowercase characters."
    },

    max: {
      description: "The value must be less than this amount."
    },

    maxLength: {
      description: "The value can have this many characters."
    },

    min: {
      description: "The value must be greater than this amount."
    },

    minLength: {
      description: "The value can have a minimum of this many characters."
    },

    notEmpty: {
      description: "The value cannot be empty."
    },

    object: {
      description: "The value must be an object."
    },

    required: {
      description: "The value is required and must not be empty or null."
    },

    string: {
      description: "The value must be a string."
    },

    subdomain: {
      description: "The value must be a valid subdomain."
    },

    text: {
      description: "The value must be text."
    },

    url: {
      description: "The value must be a valid URL."
    }
  }

};
