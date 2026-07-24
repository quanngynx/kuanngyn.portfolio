"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function Loading() {
  const router = useRouter();
  const params = useParams<{ locale: string }>();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const locale = params?.locale ?? "";
      router.replace(`/${locale}`);
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, [router, params?.locale]);

  return (
    <div className="flex h-dvh flex-col items-center justify-center">
      <span className="loader"></span>
    </div>
  );
}
