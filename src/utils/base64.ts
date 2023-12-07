import { EncryptionFactory } from '/@/utils/cipher';

export function decode(base64: string) {
  if (!base64) return;

  const decode = EncryptionFactory.createBase64Encryption().decrypt(base64);

  return decode;
}

export function encode(str: string) {
  if (!str) return;
  const base64 = EncryptionFactory.createBase64Encryption().encrypt(str);
  return base64;
}
