import readXlsxFile from 'read-excel-file/browser'

/**
 * 从批量发放的名单里读出收款人。
 *
 * core 是把整个 Excel 传给服务端解析(`fileId`),rice 收的是一个收款人数组 ——
 * 服务端不该为了一个功能长出一个表格解析器。所以解析在浏览器里做,
 * **名单文件根本不离开这台机器**。
 *
 * 取第一列,丢掉空行(从表格里粘一列手机号,末尾常带几个空行),
 * 以及第一行的表头。
 *
 * **除此之外一律原样保留。** 两种错法的代价不对称:多留一行垃圾,服务端会
 * 整批拒绝并把那一行报出来(全有或全无);少读一行,那个人就**静默地**
 * 没收到东西,没有任何人会发现。所以这里只丢确定该丢的。
 */
export async function parseRecipients(file: File): Promise<string[]> {
  const rows = (await readXlsxFile(file)) as unknown[][]

  const values = rows.map(row => cell(row?.[0])).filter(value => value !== '')
  const [first, ...rest] = values

  if (first === undefined) return []

  // 第一行不像个标识符就当表头。只对第一行这么判 —— 中间的行看不懂也留着,
  // 让服务端去说它认不认得。
  return looksLikeIdentifier(first) ? values : rest
}

function cell(value: unknown): string {
  if (value === null || value === undefined) return ''
  // 手机号在 Excel 里常被存成数字,读出来是 13800000000 而不是字符串
  if (typeof value === 'number') return String(Math.round(value))
  if (value instanceof Date) return ''
  return String(value).trim()
}

/** TSID:13 位,字母表去掉了 0/1/8/9 和容易看错的字母。 */
const TSID = /^[234567abcdefghijklmnopqrstuvwxyz]{13}$/

/**
 * 像不像一个标识符。**只用来判断第一行是不是表头。**
 *
 * 服务端认的五种写法都要认得出来 —— 少认一种,那种写法的名单就会被
 * 当成表头把第一个人吃掉。rice id 是最容易漏的:13 位小写字母数字,
 * 既没有 `@` 也没有点,和「账号」这种表头长得一样普通。
 */
function looksLikeIdentifier(value: string): boolean {
  if (!value) return false
  if (/^\d{5,20}$/.test(value)) return true // 手机号
  if (value.includes('@')) return true // 邮箱
  if (value.startsWith('did:')) return true // DID
  if (value.includes('.')) return true // handle
  if (TSID.test(value)) return true // rice id
  return false
}
