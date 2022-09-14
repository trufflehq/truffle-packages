import { gql } from '../deps.ts'

export const ACTION_EXECUTE_MUTATION = gql `
mutation ActionExecute ($input: ActionExecuteInput!) {
  actionExecute(input: $input) {
      hasExecuted
  }
}
`