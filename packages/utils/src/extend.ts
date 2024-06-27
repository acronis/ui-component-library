export function extend(to: { [x: string]: any }, from: { [x: string]: any }) {
  for (const key in from) {
    to[key] = from[key];
  }

  return to;
}
