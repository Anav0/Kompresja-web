export var callbacks = [];

export function showSnackbar(msg, variant = "error") {
  for (var callback of callbacks) {
    callback(msg, variant);
  }
}
