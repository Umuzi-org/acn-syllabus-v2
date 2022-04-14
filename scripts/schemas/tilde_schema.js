module.exports = {
  content_location: { type: String, required: true },
  base_url: { type: String, required: true },
  flavours: [
    {
      name: { type: String, required: true },
      includes: [{ type: String, required: false }],
    },
  ],
};
