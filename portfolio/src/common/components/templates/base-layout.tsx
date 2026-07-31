import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import { StyledComponentsRegistry } from "@/common/configs";

import "@radix-ui/themes/styles.css";

type Props = {
  children: ReactNode;
};

export async function BaseLayout({ children }: Props) {
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <StyledComponentsRegistry>
        {children}
        <Toaster richColors />
      </StyledComponentsRegistry>
    </NextIntlClientProvider>
  );
}
