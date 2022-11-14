/**
 * perplexity takes in an array, and returns an array.
 * But what does it do??
 */
function perplexity(array) {
  let befuddled = array[0];
  let baffled = [befuddled];
  for (let i = 1; i < array.length; i++) {
    befuddled = Math.max(array[i], befuddled + array[i]);
    baffled.push(Math.max(befuddled, baffled[i - 1]));
  }
  return baffled;
}

/**
 * conundrum takes in a string, and returns an array.
 * But what does it do??
 */
function conundrum(str) {
  let len = 0;
  let result = [0];
  for (let i = 1; i < str.length; i++) {
    if (str.charAt(i) === str.charAt(len)) {
      len++;
      result.push(len);
    } else if (len === 0) {
      result.push(0);
    } else {
      len = result[len - 1];
      i--;
    }
  }
  return result;
}
