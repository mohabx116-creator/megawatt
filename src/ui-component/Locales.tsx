import React, { useState, useEffect, useMemo, Activity } from 'react';

// third party
import { IntlProvider, MessageFormatElement } from 'react-intl';
import useConfig from 'hooks/useConfig';

// types
import { I18n } from 'types/config';

// load locales files
function loadLocaleData(i18n: I18n) {
  switch (i18n) {
    case 'ar':
      return import('utils/locales/ar.json');
    default:
      return import('utils/locales/en.json');
  }
}

// ==============================|| LOCALIZATION ||============================== //

interface LocalsProps {
  children: React.ReactNode;
}

export default function Locales({ children }: LocalsProps) {
  const {
    state: { i18n }
  } = useConfig();
  const [messages, setMessages] = useState<Record<string, string> | Record<string, MessageFormatElement[]> | undefined>();
  const activeLocale: I18n = i18n === 'ar' ? 'ar' : 'en';

  const localeDataPromise = useMemo(() => loadLocaleData(activeLocale), [activeLocale]);
  useEffect(() => {
    localeDataPromise.then((d: { default: Record<string, string> | Record<string, MessageFormatElement[]> | undefined }) => {
      setMessages(d.default);
    });
  }, [localeDataPromise]);

  return (
    <>
      <Activity mode={messages ? 'visible' : 'hidden'}>
        <IntlProvider locale={activeLocale} defaultLocale="en" messages={messages}>
          {children}
        </IntlProvider>
      </Activity>
    </>
  );
}
