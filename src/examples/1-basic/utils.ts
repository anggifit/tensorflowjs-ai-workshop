const consoleDiv = document.getElementById("console") as HTMLDivElement;

export function log(message: string) {
  consoleDiv.innerHTML += `\n${message}`;
}
