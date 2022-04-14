const { ALLOWED_CONTENT_TYPES } = require("../constants");
const schema = {
  content_type: {
    type: String,
    required: true,
    use: { valueOk: (val) => ALLOWED_CONTENT_TYPES.indexOf(val) != -1 },
  },
};

module.exports = schema;
