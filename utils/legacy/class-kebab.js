import _ from 'https://esm.sh/lodash?no-check'

export default function (classes) {
  return _.map(_.keys(_.pickBy(classes, _.identity)), _.kebabCase).join(' ')
}
