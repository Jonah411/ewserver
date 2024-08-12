const crypto = require("crypto");

const algorithm = "aes-256-cbc";

function generateKeyAndIV() {
  return {
    key: crypto.randomBytes(32),
    iv: crypto.randomBytes(16),
  };
}

function encrypt(text) {
  const { key, iv } = generateKeyAndIV();

  let cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return {
    iv: iv.toString("hex"),
    key: key.toString("hex"),
    content: encrypted.toString("hex"),
  };
}

function decrypt(encrypted) {
  if (key.length !== 32 || Buffer.from(encrypted.iv, "hex").length !== 16) {
    throw new Error("Invalid key or IV length");
  }

  let iv = Buffer.from(encrypted.iv, "hex");
  let encryptedText = Buffer.from(encrypted.content, "hex");
  let decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

module.exports = { encrypt, decrypt };
