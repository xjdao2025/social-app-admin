import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";






export default function useI18nChange(f: () => void) {
  const { i18n } = useTranslation();
  // const [memoLan, setMemoLan] = useState();
  const lanRef = useRef<string>(i18n.language);
  const callbackRef = useRef<() => void>(f);
  callbackRef.current = f;

  useEffect(() => {
    if(lanRef.current !== i18n.language) {
      callbackRef.current?.();
      lanRef.current = i18n.language;
    }
  }, [i18n.language])

}