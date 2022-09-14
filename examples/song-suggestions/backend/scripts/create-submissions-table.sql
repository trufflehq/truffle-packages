create table submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "orgId" uuid,
  "userId" uuid,
  "connectionType" text,
  "connectionId" text,
  "link" text,
  "timestamp" TIMESTAMP,
  "channelTitle" text,
  "userProfileUrl" text,
  "songDurationMs" BIGINT,
  "status" text DEFAULT 'review' NOT NULL,
  "title" text,
  "username" text DEFAULT 'Truffle User' NOT NULL
);