export function encryptEmail(val?: string) {
  if (!val) return '';
  const [p1, p2] = val.split('@');
  if (!p2 || (p1.length < 6)) return val;
  return `${p1.slice(0, 3)}***@${p2}`;
}

export function encryptPhone(phone?: string) {
  if (!phone) return '';
  const reg=/^(1[3-9][0-9])\d{4}(\d{4}$)/
  return phone.replace(reg,"$1****$2")
}

export function firstCharToLowerCase(str: string[]): string[]
export function firstCharToLowerCase(str: string): string
export function firstCharToLowerCase(str: string | string[]): string | string[] {
  if(typeof str === 'string') return `${str.slice(0, 1).toLowerCase()}${str.slice(1)}`;
  return str.map(firstCharToLowerCase);
}


