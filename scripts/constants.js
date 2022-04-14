const TOPIC = "topic";
const PROJECT = "project";
const NONE = "none";
const COURSE = "course";
const ALLOWED_CONTENT_TYPES = [NONE, COURSE, PROJECT, TOPIC];

const REPO = "repo";
const CONTINUE_REPO = "continue_repo";
const LINK = "link";

const ALLOWED_PROJECT_SUBMISSION_TYPES = [REPO, CONTINUE_REPO, LINK];

module.exports = {
  NONE,
  COURSE,
  PROJECT,
  TOPIC,
  ALLOWED_CONTENT_TYPES,
  ALLOWED_PROJECT_SUBMISSION_TYPES,
};
