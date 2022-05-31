import * as _ from 'https://jspm.dev/lodash-es'

export default function (classes) {
  return _.map(_.keys(_.pickBy(classes, _.identity)), _.kebabCase).join(' ')
}
