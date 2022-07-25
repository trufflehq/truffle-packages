export function getPollQuestionWithAuthorName(
  question: string,
  name: string | undefined,
) {
  return `${question} (created by ${name ?? "Anonymous"})`;
}
