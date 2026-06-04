import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enCommon from "@/locales/en-US/common.json";
import zhCommon from "@/locales/zh-CN/common.json";

const resources = {
  "en-US": { common: enCommon },
  "zh-CN": { common: zhCommon },
} as const;

const LANG_KEY = "app.lang";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    // lng: "en-US", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option
    // 语言检测 & 持久化配置
    detection: {
      // 优先级顺序：本地存储 > 浏览器
      order: ["localStorage", "navigator"],
      // localStorage key
      lookupLocalStorage: LANG_KEY,
      // 切换语言后写入 localStorage
      caches: ["localStorage"],
      // 防止 detector 乱猜不存在的语言
      // checkWhitelist: true
    },
    fallbackLng: "en-US",
    supportedLngs: ["zh-CN", "en-US"],
    ns: ["common"], // 先最小化，后续按需扩
    defaultNS: "common",
    interpolation: { escapeValue: false },
    returnNull: false,
    returnEmptyString: false,
    // react: { useSuspense: true },
    // saveMissing: process.env.NODE_ENV === 'development',
    // debug: process.env.NODE_ENV === 'development',
  });

export default i18n;
