export function validatePassword(password: string) {
  // 长度为 8~32 位
  if (password?.length < 8 || password?.length > 32) {
    return false;
  }

  let count = 0;

  // 必须包含大写字母
  if (/[A-Z]/.test(password)) {
    count++;
  }

  // 必须包含小写字母
  if (/[a-z]/.test(password)) {
    count++;
  }

  // 必须包含数字
  if (/\d/.test(password)) {
    count++;
  }

  // 必须包含特殊字符
  if (/[^A-Za-z0-9]/.test(password)) {
    count++;
  }

  // 至少包含大写字母、小写字母、数字、特殊字符中的 3 种
  return count >= 3;
}
