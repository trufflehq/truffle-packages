import FormatService from 'https://tfl.dev/@truffle/utils@0.0.1/format/format.js'

// viewPrivateBlock, viewPrivateDashboard
const ONE_MINUTE_SECONDS = 60

export default class ClubhouseListener {
  constructor ({ auth }) {
    this.auth = auth
  }

  search = ({ query, sort, limit }) => {
    return this.auth.stream({
      query: `
        query ClubhouseListenerSearch($query: ESQuery, $sort: JSON, $limit: Int) {
          clubhouseListeners(query: $query, sort: $sort, limit: $limit) {
            totalCount
            nodes {
              id
              name
              photoUrl
              secondsInRoom
              timeJoinedAsSpeaker
              gender
            }
          }
        }`,
      variables: { query, sort, limit },
      pull: 'clubhouseListeners'
    })
  }

  searchByName = (nameQueryStr) => {
    return this.auth.stream({
      query: `
        query ClubhouseListenerSearchByName($nameQueryStr: String) {
          clubhouseListeners(nameQueryStr: $nameQueryStr) {
            nodes {
              id
              orgId
              user { id, name }
            }
          }
        }`,
      variables: { nameQueryStr },
      pull: 'clubhouseListeners'
    })
  }

  getFilters = ({ lang }) => {
    return [
      {
        id: 'secondsInRoom', // used as ref/key
        field: 'secondsInRoom',
        type: 'minMax',
        name: lang.get('adminClubhouseListeners.minutesInRoom'),
        minOptions: [
          { value: '0', text: lang.get('filter.noMin') },
          { value: `${ONE_MINUTE_SECONDS}`, text: FormatService.abbreviateNumber(1) },
          { value: `${5 * ONE_MINUTE_SECONDS}`, text: FormatService.abbreviateNumber(5) },
          { value: `${10 * ONE_MINUTE_SECONDS}`, text: FormatService.abbreviateNumber(10) },
          { value: `${20 * ONE_MINUTE_SECONDS}`, text: FormatService.abbreviateNumber(100) },
          { value: `${40 * ONE_MINUTE_SECONDS}`, text: FormatService.abbreviateNumber(1000) }
        ],
        maxOptions: [
          { value: '0', text: lang.get('filter.noMax') },
          { value: `${ONE_MINUTE_SECONDS}`, text: FormatService.abbreviateNumber(1) },
          { value: `${5 * ONE_MINUTE_SECONDS}`, text: FormatService.abbreviateNumber(5) },
          { value: `${10 * ONE_MINUTE_SECONDS}`, text: FormatService.abbreviateNumber(10) },
          { value: `${20 * ONE_MINUTE_SECONDS}`, text: FormatService.abbreviateNumber(100) },
          { value: `${40 * ONE_MINUTE_SECONDS}`, text: FormatService.abbreviateNumber(1000) }
        ]
      },
      {
        id: 'gender', // used as ref/key
        field: 'gender',
        fields: ['gender'],
        type: 'fieldList',
        items: [
          { key: 'male', label: lang.get('gender.male') },
          { key: 'female', label: lang.get('gender.female') },
          { key: 'unknown', label: lang.get('gender.unknown') },
          { key: 'unisex', label: lang.get('gender.unisex') }
        ],
        name: lang.get('filter.gender'),
        placeholder: lang.get('filter.gender')
      },
      {
        id: 'wasSpeaker', // used as ref/key
        field: 'timeJoinedAsSpeaker',
        name: lang.get('adminClubhouseListeners.wasSpeaker'),
        type: 'boolean',
        checkExists: true,
        isBoolean: true
      }
    ]
  }
}
