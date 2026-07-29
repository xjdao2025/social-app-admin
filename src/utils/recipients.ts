import readXlsxFile from 'read-excel-file/browser'

/**
 * 从批量发放的名单里读出收款人。
 *
 * core 是把整个 Excel 传给服务端解析(`fileId`),rice 收的是一个收款人数组 ——
 * 服务端不该为了一个功能长出一个表格解析器。所以解析在浏览器里做,
 * **名单文件根本不离开这台机器**。
 *
 * 取第一列。表头(第一行不像联系方式的)会被丢掉,空行也是 ——
 * 从表格里粘一列手机号,末尾常带几个空行。
 */
export async function parseRecipients(file: File): Promise<string[]> {
  const rows = (await readXlsxFile(file)) as unknown[][]

  return rows
    .map(row => cell(row?.[0]))
    .filter(value => value !== '' && looksLikeContact(value))
}

function cell(value: unknown): string {
  if (value === null || value === undefined) return ''
  // 手机号在 Excel 里常被存成数字,读出来是 13800000000 而不是字符串
  if (typeof value === 'number') return String(Math.round(value))
  if (value instanceof Date) return ''
  return String(value).trim()
}

/**
 * 像不像一个联系方式。
 *
 * 只用来甩掉表头(「手机号」「账号」这类)—— 真正认不认得出这个人由服务端说了算,
 * 而且它是全有或全无的:一个认不出来整批都不发。这里过滤得太狠反而危险,
 * 会把运营真填的东西悄悄吃掉。
 */
function looksLikeContact(value: string): boolean {
  if (!value) return false
  if (/^\d{5,20}$/.test(value)) return true // 手机号
  if (value.includes('@')) return true // 邮箱
  if (value.startsWith('did:')) return true // DID
  if (value.includes('.')) return true // handle
  return false
}
