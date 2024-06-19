import { log } from "./utils.js";

export enum Theme {
  DEFAULT = "default",
  SUMMER = "summer",
  AUTUMN = "autumn",
  WINTER = "winter",
  SPRING = "spring",
}

const consoleDiv = document.getElementById("console") as HTMLDivElement;
let currentTheme = Theme.DEFAULT;

export function setTheme(theme: Theme) {
  if (currentTheme === theme) {
    // If theme has not changed no need to do anything
    return;
  }
  log(`Setting ${theme} theme`);
  document.body.classList.remove(`${currentTheme}-theme`);
  consoleDiv.classList.remove(`${currentTheme}-theme`);
  currentTheme = theme;
  document.body.classList.add(`${theme}-theme`);
  consoleDiv.classList.add(`${theme}-theme`);
}
