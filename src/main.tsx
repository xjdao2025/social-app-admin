import 'virtual:uno.css'
import { Routes } from '@generouted/react-router'
import React from 'react'
import { createRoot } from 'react-dom/client'
import i18n from "@/i18n";
import { I18nextProvider, useTranslation } from 'react-i18next';
import { ConfigProvider } from 'antd';
import Empty from './components/empty';
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';
import utc from "dayjs/plugin/utc"
import duration from 'dayjs/plugin/duration';
import dayjs from "dayjs";

dayjs.extend(duration);
dayjs.extend(utc);


createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n} >
      <Inner />
    </I18nextProvider>
  </React.StrictMode>,
)


function Inner() {
  const { i18n } = useTranslation();
  // 这个值原本算出来就没人用，locale 硬编码成 zhCN —— 接上去不改变任何行为:
  // i18n 的 lng 被显式设成 store 的 language(i18n/index.ts:19)，压过
  // LanguageDetector；而 language 恒为 FALLBACK_LNG = zh_CN，因为唯一的写入口
  // components/lan-picker 是关着的。真要做多语言时这里已经是对的。
  const antdLan = i18n.language.indexOf('zh') !== -1 ? zhCN : enUS;
  return (
    <ConfigProvider
      renderEmpty={(componentName) => <Empty componentName={componentName} />}
      locale={antdLan}
      theme={{
        // cssVar: true,
        token: {
          colorPrimary: '#1083FE',
          borderRadius: 2
        },
        components: {
          Input: {
            colorBorder: '#C6D5E3',
            borderRadius: 2,
            colorTextPlaceholder: '#ccc',
          },
          Select: {
            colorBorder: '#C6D5E3',
            borderRadius: 2,
            optionActiveBg: 'rgba(0, 106, 255, 0.05)',
            optionSelectedBg: 'rgba(0, 106, 255, 0.05)',
            colorTextPlaceholder: '#ccc',
          },
          Button: {
            borderColorDisabled: '#d6d6d6',
            colorBgContainerDisabled: 'rgba(51, 51, 51, 0.2)',
            colorTextDisabled: '#fff',
            primaryColor: '#fff',
            primaryShadow: ''
          },
          Tooltip: {
            borderRadius: 4,
            fontSize: 12,
            sizePopupArrow: 12
          },
          Pagination: {
            itemActiveBg: '#1083FE',
          },
          Form: {
            itemMarginBottom: 16
          },
          Table: {
            headerSplitColor: 'transparent',
            borderColor: '#D4DBE2'
          }
        },
        hashed: false,
      }}
    >
      <Routes />
    </ConfigProvider>
  )
}