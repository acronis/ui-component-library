export function valueEquals(a: string | any[], b: string | any[]) {
  // see: https://stackoverflow.com/questions/3115982/how-to-check-if-two-arrays-are-equal-with-javascript
  if (a === b) {
    return true;
  }
  if (!(Array.isArray(a))) {
    return false;
  }
  if (!(Array.isArray(b))) {
    return false;
  }
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i !== a.length; ++i) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}
