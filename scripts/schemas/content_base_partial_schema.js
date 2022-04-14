const contentTypeSchema = require("./content_type_partial_schema.js");

const prerequisitesSchema = [
  {
    path: { type: String, required: true },
    hard: { type: Boolean, required: true },
  },
];

module.exports = {
  ...contentTypeSchema,
  _db_id: { type: Number, required: false },
  title: { type: String, required: true },
  eleventyNavigation: {
    title: { type: String, required: false },
  },
  learning_outcomes: [{ type: String }],
  prerequisites: prerequisitesSchema,
  tags: [{ type: String, required: false }],
  agile_weight: { type: Number, required: false },
  flavours: [{ type: String, required: false }],
  flavour_overrides: [
    {
      flavour: { type: String, required: true },
      prerequisites: prerequisitesSchema,
    },
  ],
};
