import { PluginApi } from 'bigbluebutton-html-plugin-sdk';
import { useMemo } from 'react';
import { createIntl, createIntlCache } from 'react-intl';

const LOCALE_REQUEST_OBJECT = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development')
  ? {
    headers: {
      'ngrok-skip-browser-warning': 'any',
    },
  } : undefined;

export const useGetInternationalization = (pluginApi: PluginApi) => {
  const {
    messages: localeMessages,
    currentLocale,
    loading: localeMessagesLoading,
  } = pluginApi.useLocaleMessages!(LOCALE_REQUEST_OBJECT);

  // Memoized on purpose: `intl` is a dependency of the effects that register this
  // plugin's extensible-area items with the client. Building a new intl object on every
  // render makes those effects re-run on every render, and re-registering an item makes
  // the client re-render, which renders this component again — an infinite loop that
  // surfaces as "Maximum update depth exceeded" in the client's layout engine.
  const intl = useMemo(() => {
    if (localeMessagesLoading || !localeMessages) return null;
    return createIntl({
      locale: currentLocale,
      messages: localeMessages,
      fallbackOnEmptyString: true,
    }, createIntlCache());
  }, [currentLocale, localeMessages, localeMessagesLoading]);

  return {
    intl,
    localeMessagesLoading,
  };
};
