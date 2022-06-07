import _ from 'https://esm.sh/lodash'

export default function (classes) {
  return _.map(_.keys(_.pickBy(classes, _.identity)), _.kebabCase).join(' ')
}
