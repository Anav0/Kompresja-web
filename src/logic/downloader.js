import * as calc from "./calc";
import * as notify from "./notify";

export function downloadTextArray(words, fileName = "text") {
  if (!words) return;

  const element = document.createElement("a");
  const file = new Blob([words.join("\n")], { type: "text/plain" });
  element.href = URL.createObjectURL(file);
  element.download = fileName += ".txt";
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
}
export function downloadText(text, fileName = "text") {
  if (calc.isEmpty(text)) return;

  const element = document.createElement("a");
  const file = new Blob([text], { type: "text/plain" });
  element.href = URL.createObjectURL(file);
  element.download = fileName += ".txt";
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
}
