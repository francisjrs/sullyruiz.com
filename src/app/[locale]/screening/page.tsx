"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { ScreeningWizard } from "@/components/screening-wizard";

interface PrefillData {
  email?: string;
  phone?: string;
  name?: string;
}

function ScreeningContent() {
  const searchParams = useSearchParams();
  const locale = useLocale();
  const sessionId = searchParams.get("session_id");

  const [prefillData, setPrefillData] = useState<PrefillData>({});
  const [isLoading, setIsLoading] = useState(!!sessionId);

  // Fetch prefill data if session_id is provided
  useEffect(() => {
    if (sessionId) {
      fetch(`/api/screening/prefill?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setPrefillData({
              email: data.email || "",
              phone: data.phone || "",
              name: data.name || "",
            });
          }
        })
        .catch(() => {
          // Silently fail - user can still fill out the form
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [sessionId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f4f1ec] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#BEB09E] border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <ScreeningWizard
      sessionId={sessionId}
      locale={locale}
      prefillData={prefillData}
    />
  );
}

function ScreeningFallback() {
  return (
    <div className="min-h-screen bg-[#f4f1ec] flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-[#BEB09E] border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    </div>
  );
}

export default function ScreeningPage() {
  return (
    <Suspense fallback={<ScreeningFallback />}>
      <ScreeningContent />
    </Suspense>
  );
}
