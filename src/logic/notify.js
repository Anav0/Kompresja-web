export var snackBarCallbacks = [];
export var showProgressbarCallbacks = [];
export var hideProgressbarCallbacks = [];

export function showSnackbar(msg, variant = "error") {
  for (var callback of snackBarCallbacks) {
    callback(msg, variant);
  }
}
export function showProgressbar() {
  for (var callback of showProgressbarCallbacks) {
    callback();
  }
}
export function hideProgressbar() {
  for (var callback of hideProgressbarCallbacks) {
    callback();
  }
}
