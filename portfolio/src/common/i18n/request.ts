import { getRequestConfig } from "next-intl/server";
import { Locale, routing } from "./routes";
import sharedMessages from "./shared.json";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale;
  }

  const localeMessages = (
    await (locale === "en" ? import("./en.json") : import("./vi.json"))
  ).default;

  return {
    locale,
    messages: {
      ...sharedMessages,
      ...localeMessages,
    },
  };
});
