"use client";

import { useEffect } from "react";
import { ErrorContent } from "@/common/components/organisms/error-content";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <ErrorContent error={error} reset={reset} />;
}
