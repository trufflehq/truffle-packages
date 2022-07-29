export interface PageInfo {
  startCursor: string;
  endCursor: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface Connection<T> {
  nodes: T[];
  pageInfo: PageInfo;
  totalCount: number;
}

export interface Form {
  id: string;
  name: string;
  data: any;
  description: string;
  maxResponsesPerUser: number;
  formQuestionConnection: Connection<FormQuestion>;
}

export interface FormQuestion {
  id: string;
  question: string;
}

export interface FormQuestionAnswer {
  id: string;
  formQuestionId: string;
  value: string;
}

export interface AvatarImage {
  cdn: string;
  prefix: string;
  ext: string;
  aspectRatio: number;
}

export interface User {
  id: string;
  name: string;
  avatarImage: AvatarImage;
}

export interface FormResponse {
  id: string;
  user: User;
  time: string;
  formQuestionAnswerConnection: Connection<FormQuestionAnswer>;
}