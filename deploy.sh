#!/bin/sh
npx @11ty/eleventy && \
node scripts/validate.js && echo bar
yes | gcloud app deploy --project whaaaaaaaat?