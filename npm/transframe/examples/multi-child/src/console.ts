const textarea = document.querySelector("#messages") as HTMLTextAreaElement;

export function println(message: string) {
  textarea.value += message + "\n";
}
