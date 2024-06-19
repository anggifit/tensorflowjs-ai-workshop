const consoleDiv = document.getElementById("console") as HTMLDivElement;

export function log(message: string) {
  consoleDiv.innerHTML += `\n${message}`;
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
