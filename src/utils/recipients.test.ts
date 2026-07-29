import { describe, expect, it, vi } from 'vitest'

const readXlsxFile = vi.hoisted(() => vi.fn())
vi.mock('read-excel-file/browser', () => ({ default: readXlsxFile }))

const { parseRecipients } = await import('./recipients')

/**
 * 名单解析。core 把整个 Excel 传给服务端解析,rice 收的是一个数组 ——
 * 所以这一步挪到了浏览器里,名单文件不再离开这台机器。
 *
 * 出错的代价不对称:多留一个垃圾行,服务端会整批拒绝并把它报出来(全有或全无);
 * 少读一行,那个人就**静默地**没收到稻米。所以过滤宁松勿紧。
 */
const file = new File([''], '名单.xlsx')

describe('parseRecipients', () => {
  it('读第一列', async () => {
    readXlsxFile.mockResolvedValue([['13800000001'], ['13800000002']])

    await expect(parseRecipients(file)).resolves.toEqual(['13800000001', '13800000002'])
  })

  // Excel 会把手机号存成数字,读出来是 13800000000 而不是字符串
  it('数字型的手机号转成字符串,不带小数点', async () => {
    readXlsxFile.mockResolvedValue([[13800000001], [13800000002.0]])

    await expect(parseRecipients(file)).resolves.toEqual(['13800000001', '13800000002'])
  })

  it('丢掉表头', async () => {
    readXlsxFile.mockResolvedValue([['手机号'], ['13800000001']])

    await expect(parseRecipients(file)).resolves.toEqual(['13800000001'])
  })

  it('只有表头时返回空数组', async () => {
    readXlsxFile.mockResolvedValue([['手机号']])

    await expect(parseRecipients(file)).resolves.toEqual([])
  })

  it('丢掉空行 —— 粘一列号码末尾常带几个空行', async () => {
    readXlsxFile.mockResolvedValue([['13800000001'], [null], [''], ['   '], [undefined]])

    await expect(parseRecipients(file)).resolves.toEqual(['13800000001'])
  })

  it('服务端认的五种写法都留下', async () => {
    readXlsxFile.mockResolvedValue([
      ['13800000001'],
      ['a@example.com'],
      ['alice.web5.xjdao.xyz'],
      ['did:plc:abc123'],
      // rice id 最容易被漏掉:13 位小写字母数字,既没有 @ 也没有点
      ['3ke6kg3wk223e'],
    ])

    await expect(parseRecipients(file)).resolves.toEqual([
      '13800000001',
      'a@example.com',
      'alice.web5.xjdao.xyz',
      'did:plc:abc123',
      '3ke6kg3wk223e',
    ])
  })

  // 名单整列都是 rice id 时,第一个不该被当成表头吃掉
  it('第一行就是 rice id 时不当表头', async () => {
    readXlsxFile.mockResolvedValue([['3ke6kg3wk223e'], ['3ke6kg3wk1abc']])

    await expect(parseRecipients(file)).resolves.toEqual(['3ke6kg3wk223e', '3ke6kg3wk1abc'])
  })

  // 少读一行 = 那个人静默地没收到;多留一行 = 服务端整批拒绝并把它报出来。
  // 后者可见,前者不可见,所以只丢确定该丢的。
  it('看不懂的行留着,让服务端去拒绝', async () => {
    readXlsxFile.mockResolvedValue([['13800000001'], ['这是什么'], ['13800000002']])

    await expect(parseRecipients(file)).resolves.toEqual([
      '13800000001',
      '这是什么',
      '13800000002',
    ])
  })

  it('去掉首尾空白', async () => {
    readXlsxFile.mockResolvedValue([['  13800000001  ']])

    await expect(parseRecipients(file)).resolves.toEqual(['13800000001'])
  })

  it('后面几列不管', async () => {
    readXlsxFile.mockResolvedValue([['13800000001', '张三', '备注']])

    await expect(parseRecipients(file)).resolves.toEqual(['13800000001'])
  })

  it('空表返回空数组,而不是抛错', async () => {
    readXlsxFile.mockResolvedValue([])

    await expect(parseRecipients(file)).resolves.toEqual([])
  })
})
