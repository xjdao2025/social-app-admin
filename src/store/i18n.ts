import { LANGUAGE, FALLBACK_LNG } from '@/i18n/settings.ts'
import createSelectors from "@/store/helper/createSelectors";
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer';

export type I18nStore = {
  language: LANGUAGE
}

export type I18nStoreAction = {
  setLanguage: (language: LANGUAGE) => void
}

/**
 * 语言状态。
 *
 * 这里原本套了一层 `persist`，但它的配置对象整块被注释掉了，`persist(config)`
 * 少了第二个参数 —— tsc 报的 TS2554 就是这个。运行时不会崩：zustand 的
 * `persistImpl` 对 `...undefined` 是容忍的，storage 默认落到 localStorage，
 * 于是状态被存进了字面量为 `undefined` 的那个 key。
 *
 * 去掉 persist 不改变任何可观察行为：`language` 与 `setLanguage` 全仓库只有
 * `components/lan-picker` 读写，而那个组件在真正 render 之前就 `return null`
 * —— 语言选择器是关掉的，语言恒为 FALLBACK_LNG，存下来也没人会读到不同的值。
 * 哪天要把选择器打开，persist 得连同一个真正的 `{ name: 'i18n-store' }`
 * 一起加回来，别再依赖那个 `undefined` key。
 */
export const useI18nStore = createSelectors(
  create(
    subscribeWithSelector(
      immer<I18nStore & I18nStoreAction>(
        (set) => ({
          language: FALLBACK_LNG,

          setLanguage: (language) => {
            set((state) => {
              state.language = language
            })
          },
        })
      )
    )
  )
)
