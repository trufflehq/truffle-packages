import globalContext from "https://tfl.dev/@truffle/global-context@^1.0.0/index.ts";
import config from '../config.ts'
import { Submission, SubmissionStatus, SubmissionPage } from '../types/mod.ts'

export async function fetchLatestSubmissions(limit?: number) {
  const context = globalContext.getStore();

  const result = await fetch(`${config.BASE_API_URL}/admin/submissions?orgId=${context.orgId}&limit=${limit}&order=asc`)

  const submissions: Submission[] = await result.json()

  return submissions
}

export async function fetchOldestSubmissions(limit?: number) {
  const context = globalContext.getStore();

  const result = await fetch(`${config.BASE_API_URL}/admin/submissions?orgId=${context.orgId}&limit=${limit}&order=desc`)

  const submissions: Submission[] = await result.json()

  return submissions
}

export async function fetchSubmissions(status: SubmissionStatus, limit?: number) {
  const context = globalContext.getStore();
  const t0 = performance.now()
  try {

    const result = await fetch(`${config.BASE_API_URL}/admin/submissions?orgId=${context.orgId}&status=${status}&limit=${limit}&order=asc`)
    const t1 = performance.now()
    const submissions: Submission[] = await result.json()
    const t2 = performance.now()
  
    // console.log(`submission fetch took ${t1 - t0} milliseconds`)
    // console.log(`serialization took ${t2 - t1}`)
    return submissions
  } catch(err) {
    console.error('error fetching submissions', err)
  }
}

export async function fetchSubmissionPage(status: SubmissionStatus, page?: number, size?: number) {
  const context = globalContext.getStore();
  const t0 = performance.now()
  try {
    const url = `${config.BASE_API_URL}/admin/submissions/page?orgId=${context.orgId}&status=${status}&page=${page}&size=${size}`

    const result = await fetch(url)
    const t1 = performance.now()
    const submissionPage: SubmissionPage = await result.json()
    const t2 = performance.now()
  
    // console.log(`submission fetch took ${t1 - t0} milliseconds`)
    // console.log(`serialization took ${t2 - t1}`)
    return { submissions: submissionPage?.submissions, count: submissionPage?.count }
  } catch(err) {
    console.error('error fetching submission page', err)
  }
}

export async function fetchSubmissionCount() {
  const context = globalContext.getStore();
  const t0 = performance.now()
  try {
    const url = `${config.BASE_API_URL}/admin/submissions/count?orgId=${context.orgId}`

    const result = await fetch(url)
    const t1 = performance.now()
    const totalCount: number = await result.json()
    const t2 = performance.now()
  
    // console.log(`submission fetch took ${t1 - t0} milliseconds`)
    // console.log(`serialization took ${t2 - t1}`)
    console.log('totalCount', totalCount)
    return totalCount
  } catch(err) {
    console.error('error fetching submission count', err)
  }
}


export async function fetchRandomSubmission() {
  const context = globalContext.getStore();

  const result = await fetch(`${config.BASE_API_URL}/admin/submission/random?orgId=${context.orgId}&status=approved`)

  const submission: Submission = await result.json()

  console.log('submission', submission)

  return submission
}

export function getApproveSubmissionInput(submissionId: string) {
  return {
    input: {
      actionPath: "@truffle/core@latest/_Action/webhook",
      runtimeData: {
        endpoint: `${config.BASE_API_URL}/admin/submission/update`,
        submissionId,
        status: 'approved'
      },
      packageId: config.PACKAGE_ID
    },
  };
}

export function getDeleteSubmissionInput(submissionId: string) {
  return {
    input: {
      actionPath: "@truffle/core@latest/_Action/webhook",
      runtimeData: {
        endpoint: `${config.BASE_API_URL}/admin/submission/delete`,
        submissionId
      },
      packageId: config.PACKAGE_ID
    },
  };
}

export function getClearSubmissionInput() {
  return {
    input: {
      actionPath: "@truffle/core@latest/_Action/webhook",
      runtimeData: {
        endpoint: `${config.BASE_API_URL}/admin/submissions/clear`,
      },
      packageId: config.PACKAGE_ID
    },
  };
}
