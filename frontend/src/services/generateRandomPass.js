export const generateRandomPassword = (length = 6) => {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const rnd = new Uint32Array(length);
  if (typeof window !== "undefined" && window.crypto && window.crypto.getRandomValues) {
    window.crypto.getRandomValues(rnd);
  } else {
    for (let i = 0; i < length; i++) rnd[i] = Math.floor(Math.random() * 2 ** 32);
  }
  return Array.from(rnd, (n) => charset[n % charset.length]).join("");
};