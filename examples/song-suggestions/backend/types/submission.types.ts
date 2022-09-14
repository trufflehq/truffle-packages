import { ConnectionType } from './connection.types.ts'

export type SubmissionUpsertInput = Omit<SubmissionRecord, "id" | "timestamp" | "username" | "userProfileUrl" | "channelTitle" | "songDurationMs"> & {
  title?: string;
  username?: string;
  userProfileUrl?: string;
  channelTitle?: string;
  songDurationMs?: number;
};


export type SubmissionStatus = 'review' | 'approved'

export type SubmissionRecord = {
  id: string
  orgId: string
  userId: string
  username?: string
  channelTitle?: string
  title?: string
  connectionType: ConnectionType
  connectionId: string
  songDurationMs?: number
  link: string
  status: SubmissionStatus
  timestamp: Date
}
