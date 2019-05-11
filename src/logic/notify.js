export var snackBarCallbacks = [];

export function showSnackbar(msg, variant = "error") {
  for (var callback of snackBarCallbacks) {
    callback(msg, variant);
  }
}

