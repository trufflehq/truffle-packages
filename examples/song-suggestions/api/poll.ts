import config from '../config.ts'

export function getPollStartInput(submissionId: string) {
  return {
    input: {
      actionPath: "@truffle/core@latest/_Action/webhook",
      runtimeData: {
        endpoint: `${config.BASE_API_URL}/admin/poll/start`,
        submissionId
      },
      packageId: config.PACKAGE_ID
    },
  };
}

export function getPollEndInput(pollId: string) {
  return {
    input: {
      id: pollId,
      durationSeconds: 1,
    }
  };
}


