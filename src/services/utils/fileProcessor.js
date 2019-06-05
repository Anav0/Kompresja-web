import { showLoading, hideLoading } from "../../actions";
import store from "../../store";
import {ArrayBufferToString} from "./bits";

export function readFileContent(file) {
  return new Promise((resolve, reject) => {
    store.dispatch(showLoading);
    if (!file) reject(new Error("file cannot be null"));

    let reader = new FileReader();

    reader.onload = e => {
      store.dispatch(hideLoading);
      resolve(ArrayBufferToString(e.target.result));
    };

    try {
      reader.readAsArrayBuffer(file);
    } catch (err) {
      reject(err);
    }
  });
}
export function getFileExtention(file) {
  if (!file) throw new Error("Argument cannot be null");

  return file.name.split(".")[1];
}

export function getFileName(file) {
  if (!file) throw new Error("Argument cannot be null");

  return file.name.split(".")[0];
}
