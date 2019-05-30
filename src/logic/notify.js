export var snackBarCallbacks = [];
var showLoaderCall;
var hideLoaderCall;

export function showSnackbar(msg, variant = "error") {
  for (var callback of snackBarCallbacks) {
    callback(msg, variant);
  }
}


export function assignShowLoaderCall(call) {
  if (!call)
    throw new Error("Argument cannot be null");

  showLoaderCall = call;
}

export function assignHideLoaderCall(call) {
  if (!call)
    throw new Error("Argument cannot be null");

  hideLoaderCall = call;
}

export function showLoader() {
  if (showLoaderCall)
    showLoaderCall();
}

export function hideLoader() {
  if (hideLoaderCall)
    hideLoaderCall();
}