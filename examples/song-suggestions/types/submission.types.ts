export type SubmissionStatus = 'review' | 'approved'

export type Submission = {
  id: string;
  orgId: string;
  userId: string;
  username: string;
  channelTitle?: string
  songDurationMs?: number;
  userProfileUrl?: string;
  title?: string
  connectionType: string;
  connectionId: string;
  link: string;
  status: string;
  timestamp: Date
}

export type SubmissionPage = {
  submissions: Submission[]
  count?: number
}