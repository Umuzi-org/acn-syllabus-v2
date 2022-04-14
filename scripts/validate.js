const validateSchema = require("yaml-schema-validator");
const tildeSchema = require("./schemas/tilde_schema.js");
const contentTypeSchema = require("./schemas/content_type_partial_schema.js");
const projectContentSchema = require("./schemas/project_content_schema");
const courseContentSchema = require("./schemas/course_content_schema");
const topicContentSchema = require("./schemas/topic_content_schema");
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const fm = require("front-matter");
const { exit } = require("process");
const { NONE, COURSE, PROJECT, TOPIC } = require("./constants");

var knownDbIds = {
  courses: {},
  content: {},
};

const checkIdNotRepeated = (filePath, frontmatter) => {
  const dbId = frontmatter._db_id;
  if (!dbId) return;

  if (frontmatter.content_type === COURSE) seen = knownDbIds.courses;
  else seen = knownDbIds.content;

  if (seen[dbId]) {
    throw new Error(`Repeated database id!\n\t${filePath}\n\t${seen[dbId]}`);
  }
  seen[dbId] = filePath;
};

const logValidatingFile = (filePath) => {
  const FgGreen = "\x1b[32m";
  const Reset = "\x1b[0m";
  const Bright = "\x1b[1m";
  console.log(
    `${Bright}${FgGreen}VALIDATING ${Reset}${FgGreen}${filePath} ...`
  );
};

/* This would be used for checking .tilde.yaml */
const validateSingleFile = (filePath, schema) => {
  logValidatingFile(filePath);
  const errors = validateSchema(filePath, {
    schema,
  });
  if (errors.length) {
    throw new Error(errors);
  }
};

const validateCourseFrontmatter = (frontmatter) => {
  const errors = validateSchema(frontmatter, { schema: courseContentSchema });
  if (errors.length) {
    throw new Error(errors);
  }
};

const validateProjectFrontmatter = (frontmatter) => {
  const errors = validateSchema(frontmatter, { schema: projectContentSchema });
  if (errors.length) {
    throw new Error(errors);
  }

  // TODO: make sure any mentioned flavours are inside .tilde.yaml
  // TODO: make sure continue_from_repo points to a valid thing (content or url)
  // TODO: make sure learning_outcomes are inside learning_outcomes.yaml
};

const validateTopicFrontmatter = (frontmatter) => {
  const errors = validateSchema(frontmatter, { schema: topicContentSchema });
  if (errors.length) {
    throw new Error(errors);
  }
};

const validateSingleFileFrontMatter = (filePath) => {
  logValidatingFile(filePath);

  data = fs.readFileSync(filePath, "utf8");
  const content = fm(data);
  frontmatter = content.attributes;

  const contentTypeOnly = { content_type: frontmatter.content_type };
  let errors = validateSchema(contentTypeOnly, {
    schema: contentTypeSchema,
  });
  if (errors.length) {
    throw new Error(errors);
  }
  const contentType = frontmatter.content_type;
  switch (contentType) {
    case NONE:
      break;
    case COURSE:
      validateCourseFrontmatter(frontmatter);
      break;
    case PROJECT:
      validateProjectFrontmatter(frontmatter);
      break;
    case TOPIC:
      validateTopicFrontmatter(frontmatter);
      break;
    default:
      throw new Error(
        f`Content type validation is not implemented for ${contentType}`
      );
  }
  checkIdNotRepeated(filePath, frontmatter);
};

const validateDirectory = (directoryPath) => {
  const validateDirectoryContents = (err, contents) => {
    contents.forEach((item) => {
      const name = path.parse(item).name;

      const filePath = path.join(directoryPath, item);
      if (fs.lstatSync(filePath).isDirectory()) {
        if (!/^[\da-z0-9\-]*$/.test(name)) {
          // we are being stricter than technically required. But it's best to keep things tidy
          throw new Error(
            `invalid directory name at ${filePath}. Use lowercase letters, numbers and dashes only`
          );
        }
        //recurse
        validateDirectory(filePath);
      } else {
        // it's a file
        if (name === "index" || name === "_index") {
          validateSingleFileFrontMatter(filePath);
        }
      }
    });
  };
  fs.readdir(directoryPath, validateDirectoryContents);
};

validateSingleFile(".tilde.yaml", tildeSchema);
// get the content path from the main settings file

try {
  const doc = yaml.load(fs.readFileSync(".tilde.yaml", "utf8"));
  contentLocation = doc.content_location;
  // now we need to validate all the content files
} catch (e) {
  console.log(e);
  exit();
}
validateDirectory(contentLocation);
