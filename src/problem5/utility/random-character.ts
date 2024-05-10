export function makeId(length) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export function generateRandomPassword() {
  const min = 100000000; // Minimum 9-digit number
  const max = 999999999; // Maximum 9-digit number

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate a random password of length 12

