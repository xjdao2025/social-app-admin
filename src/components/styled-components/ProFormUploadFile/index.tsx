import { Button, message, Upload } from 'antd';
import { UploadOutlined } from "@ant-design/icons";
import S from './index.module.less';
import { ProFormItem } from "@ant-design/pro-components";
import { FieldProps } from "rc-field-form/lib/Field";
import cx from "classnames";
import server, { RiceError } from "@/server/rice";
import { useEffect, useState } from "react";
import { UploadFile } from "antd/lib";
import { useTranslation } from "react-i18next";

type ProFormUploadFileProps = {
  label?: string;
  name?: FieldProps['name'];
  formItemProps?: FieldProps
} & StyledUploadFormProps

const ProFormUploadFile = (props: ProFormUploadFileProps) => {
  const {
    formItemProps,
    label,
    name,
    ...rest
  } = props;

  return <>
    <ProFormItem
      label={label}
      name={name}
      {...props.formItemProps}
    >
      <StyledUpload {...rest} />
    </ProFormItem>
  </>
}

export default ProFormUploadFile;

type StyledUploadProps = {
  maxSize?: number | string;
  accept?: string;
  maxCount?: number;
  disabled?: boolean
  value?: string | string[],
  onChange?: (value: string[] | string) => void;
  buttonText: string
  /**
   * 附件 id → 文件名。**表单值只有 id**,拿不到名字。
   *
   * 表单值的形状不能动:`document_ids` 在 rice 那边是整份替换,
   * `place/foundation/payload.ts` 的三态判断(不传 / 空数组 / 有值)全建立在
   * 「值是 id 数组」这个前提上,改成对象会把那段逻辑连带弄坏,而代价是
   * 一次误操作删掉全部已公示文件。所以名字走一个独立的旁路 prop。
   *
   * 没传的 id 退回空名字 —— 也就是修这个之前所有已有附件的样子:
   * 一排只有回形针、没有文字的空行。
   */
  fileNames?: Record<string, string>;
};

type StyledUploadFormProps = {
  className?: string;
  children?: React.ReactNode;
} & StyledUploadProps

const StyledUpload = (props: StyledUploadFormProps) => {
  const {
    className = '',
    value,
    onChange,
    maxCount,
    accept,
    maxSize,
    disabled,
    fileNames,
  } = props;

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const { t } = useTranslation('translation');

  useEffect(() => {
    const fileIdList = ([] as string[]).concat(value || []);

    setFileList(prevList => {
      const hash = prevList.reduce((h, item) => {
        h[item.response as string] = item
        return h
      }, {} as Record<string, UploadFile>);

      // rice 的附件 id 就是 id。core 那边 id 里编着 `类型-真实id-文件名`,
      // 所以曾经有个 responseType prop 决定要不要拆开;迁到 rice 后没什么可拆的,
      // 它既没人传也没人读,已经删掉。
      return fileIdList.map((fileId: string) => {
        const url = server.attachments.url(fileId);

        if (hash[fileId]) {
          return ({ ...hash[fileId], url })
        }

        return ({
          uid: fileId,
          name: fileNames?.[fileId] ?? '',
          response: fileId,
          url,
          status: 'done' as const
        })
      })
    });
  }, [value, fileNames])

  const beforeUpload = (file: any) => {
    if (!maxSize) return true
    let limitSize = maxSize ?? 5;
    let isReachLimit = false;
    const isNoNumber = isNaN(+maxSize);

    if (isNoNumber && typeof maxSize === 'string' && maxSize.includes('kb')) {
      isReachLimit = file.size / 1024 > +maxSize.replace('kb', '');
    } else {
      isReachLimit = file.size / 1024 / 1024 > +maxSize;
    }

    if (isReachLimit) {
      message.warning(`${t("validate.maxFileSize", { size: isNoNumber ? limitSize : `${limitSize}MB` })}`);
      return Upload.LIST_IGNORE;
    }

    return true;
  };

  return <div className={'flex items-baseline'}>
    <Upload
      disabled={disabled}
      beforeUpload={beforeUpload}
      customRequest={async function customRequest(options) {
        const { file } = options;

        try {
          // 上传要登录 —— core 的上传接口是 AllowAnonymous
          const attachment = await server.attachments.upload(file as File, 'file');
          options.onSuccess?.(attachment.id);
        } catch (e) {
          message.error((e as RiceError).message);
          options.onError?.(e as Error);
          return;
        }
      }}
      accept={accept}
      maxCount={maxCount}
      itemRender={(node) => {
        return node;
      }}
      fileList={fileList}
      onChange={({ fileList: nextFileList }) => {
        setFileList([...nextFileList]);
        const fileIds = nextFileList.map(item => item.response as string);
        if (fileIds.some(i => !i)) return;
        const files = maxCount
          ? (maxCount === 1 ? fileIds[0] : fileIds.slice(0, maxCount + 1)) : fileIds;
        onChange?.(files)
      }}
      className={cx(S.antUpload, className)}
    >
      <Button
        icon={<UploadOutlined style={{ opacity: 0.25 }} />}
        className={'text-[#42576C]'}
      >{props.buttonText}</Button>
    </Upload>
    {props.children}
  </div>
}