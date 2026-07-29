import { ProColumns } from '@ant-design/pro-components';
import { Image } from 'antd';
import dayjs from 'dayjs';
import { ComponentProps, ReactNode } from 'react';

/**
 * ProColumn函数式写法
 * 1. hideInSearch默认为true
 */
class ProColumnBuilder {
  hideInSearch = true;
  valueType: ProColumns['valueType'] = 'text';
  search: ProColumns['search'] = undefined;
  render: ProColumns['render'];
  request: ProColumns['request'];
  valueEnum: ProColumns['valueEnum'];
  fieldProps: ProColumns['fieldProps'];

  constructor(
    public title: ReactNode,
    public dataIndex?: ProColumns['dataIndex'],
    partialCfg: Partial<ProColumns> = {},
  ) {
    Object.assign(this, partialCfg);
  }
  _enableSearch() {
    this.hideInSearch = false;
    return this;
  }
  _digit(fieldPropsExt = {}) {
    this.valueType = 'digit';
    this.fieldProps = {
      min: 0,
      style: { width: '100%' },
      ...fieldPropsExt,
    };
    return this;
  }
  // _avatar() {
  //   this.render = (value, record) => (
  //     <OSSAvatar
  //       src={value as string}
  //       size={40}
  //     />
  //   );
  //   return this;
  // }
  /**
   * 设置render
   */
  // _image(imgProps?: Partial<ComponentProps<typeof OssImage>>) {
  //   this.render = (value) => {
  //     return <OssImage id={value as string} width={120} height={80} mode='cover' {...imgProps} />;
  //   };
  //   return this;
  // }
  /**
   * 日期范围搜索。
   *
   * `format` 不传时发的是 ISO 8601 **UTC** 串(rice 认这个)。
   * 注意别用 `'…[Z]'` 这种格式去拼:`format` 打的是**本地**时间,末尾再补一个
   * 字面量 Z,东八区就会把范围整体推后 8 小时 —— 本地 00:00–08:00 的记录
   * 会被静默漏掉。要 UTC 就得用 `toISOString()`。
   */
  _dateRange(startTimeKey: string, endTimeKey: string, format?: string) {
    this.valueType = 'dateRange';
    this.search = {
      transform: (value: any) => ({
        [startTimeKey]: stamp(dayjs(value[0]).startOf('day'), format),
        [endTimeKey]: stamp(dayjs(value[1]).endOf('day'), format),
      }),
    };
    this.render = (_, record) => {
      return record[this.dataIndex!];
    };
    return this;
  }
  /**
   * 设置render
   */
  _render(f: ProColumns['render']) {
    this.render = f;
    return this;
  }
  _valueEnum(value: ProColumns['valueEnum'] | ProColumns['request']) {
    if (typeof value === 'function') {
      this.request = value as ProColumns['request'];
    } else {
      this.valueEnum = value as ProColumns['valueEnum'];
    }
    return this;
  }
  _treeSelect(value: ProColumns['valueEnum']) {
    this.valueType = 'treeSelect';
    this.fieldProps = {
      options: value,
      treeDefaultExpandAll: true,
    };
    return this;
  }
  _option() {
    this.valueType = 'option';
    return this;
  }
  _extend(obj: Record<string, any>) {
    Object.assign(this, obj);
    return this;
  }
}

function stamp(value: dayjs.Dayjs, format?: string) {
  return format ? value.format(format) : value.toISOString();
}

export function proColumn(...args: ConstructorParameters<typeof ProColumnBuilder>) {
  return new ProColumnBuilder(...args);
}
