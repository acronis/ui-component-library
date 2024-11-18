export default function (rawString) {
  let parsed;
  try {
    parsed = JSON.parse(rawString);
  }
  catch {
    console.log(`JSON string "${rawString}" couldn't be parsed`);
  }

  return parsed;
}
