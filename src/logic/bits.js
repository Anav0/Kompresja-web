export function addBitsRight(bits, finalSize = 8) {
  if (!bits || !finalSize) throw new Error("Argument cannot be null");

  while (bits.length < finalSize) bits = bits + "0";

  return bits;
}

export function addBitsLeft(bits, finalSize = 8) {
  if (!bits || !finalSize) throw new Error("Argument cannot be null");

  while (bits.length < finalSize) bits = "0" + bits;

  return bits;
}
