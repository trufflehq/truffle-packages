import _ from "https://npm.tfl.dev/lodash?no-check";

export default function (classes) {
  return _.map(_.keys(_.pickBy(classes, _.identity)), _.kebabCase).join(" ");
}
