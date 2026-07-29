import { GetProp, Image, message, Upload, UploadProps } from 'antd';
import { PlusOutlined } from "@ant-design/icons";
import S from './index.module.less';
import { ProFormItem } from "@ant-design/pro-components";
import { FieldProps } from "rc-field-form/lib/Field";
import cx from "classnames";
import server, { RiceError } from "@/server/rice";
import { useEffect, useState } from "react";
import { UploadFile } from "antd/lib";
import { useTranslation } from "react-i18next";

type ProFormUploadProps = {
  label?: string;
  name?: FieldProps['name'];
  formItemProps?: FieldProps
} & StyledUploadFormProps

const ProFormUpload = (props: ProFormUploadProps) => {
  const {
    formItemProps,
    label,
    name,
    ...rest } = props;

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

export default ProFormUpload;

type StyledUploadProps = {
  maxSize?: number | string;
  accept?: string;
  maxCount?: number;
  descClassName?: string;
  descriptions?: string[];
  descPosition?: 'right' | 'bottom';
  disabled?: boolean
  value?: string,
  onChange?: (value: string) => void;
  circleClassName?: string;
} & UploadProps;

type StyledUploadFormProps = {
  className?: string;
} & StyledUploadProps

const StyledUpload = (props: StyledUploadFormProps) => {
  const {
    className = '',
    value,
    onChange,
    maxCount = 1,
    accept = '.png,.jpg,.jpeg',
    maxSize,
    descClassName = '',
    descriptions,
    descPosition = 'bottom',
    disabled,
    circleClassName= '',
    ...rest } = props;

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const { t } = useTranslation('translation');

  useEffect(() => {
    const fileIdList = ([] as string[]).concat(value || []);

    setFileList(prevList => {
      const hash = prevList.reduce((h, item) => {
        h[item.response as string] = item
        return h
      }, {} as Record<string, UploadFile>);

      // rice 的附件 id 就是 id —— core 那边 id 里还编着文件类型和文件名,
      // 取用之前得先拆一遍
      return fileIdList.map(fileId => {
        const url = server.attachments.url(fileId);

        if (hash[fileId]) {
          return ({ ...hash[fileId], url })
        }

        return ({
          uid: fileId,
          name: '',
          response: fileId,
          url,
          status: 'done' as const
        })
      })
    });
  }, [value])

  const beforeUpload = (file: any) => {
    // const limitSize = maxSize ?? 5;
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

  return <div className={cx(descPosition === 'right' ? S.tipPosRight : '')}>
    <Upload
      disabled={disabled}
      beforeUpload={beforeUpload}
      customRequest={async function customRequest(options) {
        const { file } = options;

        try {
          // 上传要登录 —— core 的上传接口是 AllowAnonymous,谁都能往服务器写文件
          const attachment = await server.attachments.upload(file as File, 'image');
          options.onSuccess?.(attachment.id);
        } catch (e) {
          message.error((e as RiceError).message);
          options.onError?.(e as Error);
          return;
        }
      }}
      accept={accept}
      listType="picture-card"
      maxCount={maxCount}
      itemRender={(node) => {
        return node;
      }}
      onPreview={v => {
        setPreviewImage(v.url || v.thumbUrl);
        setPreviewOpen(true);
      }}
      fileList={fileList}
      onChange={({ fileList: nextFileList }) => {
        setFileList([...nextFileList]);
        // console.log('nextFileList', nextFileList);
        const fileIds = nextFileList.map(item => item.response as string);
        if (fileIds.some(i => !i)) return;
        console.log('fileIds[0]>>>>', fileIds[0])
        onChange?.(fileIds[0])
      }}
      {...rest}
      className={cx(S.antUpload, className)}
    >
      {fileList.length < maxCount && <div className={cx(S.upload, className, circleClassName)}>
        <PlusOutlined />
        添加
      </div>}
    </Upload>

    <div className={cx(S.tips, descClassName)}>
      {descriptions?.map((description, index) => <p key={index}>{description}</p>)}
    </div>
    {previewImage && (
      <Image
        wrapperStyle={{ display: 'none' }}
        preview={{
          visible: previewOpen,
          onVisibleChange: (visible) => setPreviewOpen(visible),
          afterOpenChange: (visible) => !visible && setPreviewImage(''),
        }}
        src={previewImage}
      />
    )}
    </div>
}