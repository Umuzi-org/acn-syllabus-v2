const baseSchema = require("./content_base_partial_schema.js");

module.exports = {
  ...baseSchema,
  topic_needs_review: { type: Boolean, required: false },
};
