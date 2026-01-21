"use client";

import { useState, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, useInView } from "framer-motion";
import { Check, BookOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSessionId, setCTASource, clearSession } from "@/lib/session";
import { validateEmail, validateName } from "@/lib/validation";
import { useToast } from "@/components/toast-provider";

export function LeadMagnet() {
  const t = useTranslations("leadMagnet");
  const tValidation = useTranslations("validation");
  const locale = useLocale();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { toast } = useToast();

  const [guideType, setGuideType] = useState<"buyer" | "seller">("buyer");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errors, setErrors] = useState<{ firstName?: string; email?: string }>(
    {}
  );

  const getErrorMessage = (errorKey: string): string => {
    // errorKey is like "validation.email.invalid", we need to extract "email.invalid"
    const parts = errorKey.split(".");
    if (parts[0] === "validation" && parts.length >= 3) {
      return tValidation(`${parts[1]}.${parts[2]}`);
    }
    return tValidation("submitError");
  };

  const validateField = (field: "firstName" | "email", value: string) => {
    if (field === "firstName") {
      const result = validateName(value);
      if (!result.valid && result.error) {
        setErrors((prev) => ({ ...prev, firstName: getErrorMessage(result.error!) }));
      } else {
        setErrors((prev) => ({ ...prev, firstName: undefined }));
      }
    } else if (field === "email") {
      const result = validateEmail(value);
      if (!result.valid && result.error) {
        setErrors((prev) => ({ ...prev, email: getErrorMessage(result.error!) }));
      } else {
        setErrors((prev) => ({ ...prev, email: undefined }));
      }
    }
  };

  const validateAllFields = (): boolean => {
    const nameResult = validateName(firstName);
    const emailResult = validateEmail(email);
    const newErrors: { firstName?: string; email?: string } = {};

    if (!nameResult.valid && nameResult.error) {
      newErrors.firstName = getErrorMessage(nameResult.error);
    }
    if (!emailResult.valid && emailResult.error) {
      newErrors.email = getErrorMessage(emailResult.error);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const features = [
    t(`${guideType}.features.feature1`),
    t(`${guideType}.features.feature2`),
    t(`${guideType}.features.feature3`),
    t(`${guideType}.features.feature4`),
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!validateAllFields()) {
      return;
    }

    setIsSubmitting(true);
    setHasError(false);

    try {
      // Set CTA source for lead magnet
      setCTASource("lead_magnet");
      const sessionId = getSessionId();

      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "lead_magnet",
          guideType,
          session_id: sessionId,
          cta_source: "lead_magnet",
          contact: { firstName, email },
          locale,
        }),
      });

      if (response.ok) {
        clearSession();
        setIsSuccess(true);
        setFirstName("");
        setEmail("");
        setErrors({});
      } else {
        const data = await response.json();
        // Handle server-side validation errors
        if (data.details) {
          const serverErrors: { firstName?: string; email?: string } = {};
          if (data.details.firstName) {
            serverErrors.firstName = getErrorMessage(data.details.firstName);
          }
          if (data.details.email) {
            serverErrors.email = getErrorMessage(data.details.email);
          }
          setErrors(serverErrors);
        }
        setHasError(true);
        toast({
          title: tValidation("submitError"),
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error submitting lead:", error);
      setHasError(true);
      toast({
        title: tValidation("networkError"),
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section ref={ref} className="section-padding bg-[#f4f1ec]">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#BEB09E]/20 rounded-full flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-[#BEB09E]" />
                </div>
                <span className="font-sans text-xs uppercase tracking-widest text-[#BEB09E]">
                  {t("freeDownload")}
                </span>
              </div>

              {/* Guide Type Toggle */}
              <div className="flex border border-[#BEB09E]/30 mb-6 max-w-xs">
                <button
                  type="button"
                  onClick={() => setGuideType("buyer")}
                  className={`flex-1 py-3 px-4 font-sans text-xs uppercase tracking-wider transition-all duration-300 ${
                    guideType === "buyer"
                      ? "bg-[#BEB09E] text-white"
                      : "bg-transparent text-[#BEB09E] hover:bg-[#BEB09E]/10"
                  }`}
                >
                  {t("toggle.buyer")}
                </button>
                <button
                  type="button"
                  onClick={() => setGuideType("seller")}
                  className={`flex-1 py-3 px-4 font-sans text-xs uppercase tracking-wider transition-all duration-300 ${
                    guideType === "seller"
                      ? "bg-[#BEB09E] text-white"
                      : "bg-transparent text-[#BEB09E] hover:bg-[#BEB09E]/10"
                  }`}
                >
                  {t("toggle.seller")}
                </button>
              </div>

              <div className="relative mb-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={guideType === "buyer" ? "/images/buyers-guide-mockup.webp" : "/images/sellers-guide-mockup.webp"}
                  alt={guideType === "buyer" ? "Texas Home Buyer's Guide" : "Texas Home Seller's Guide"}
                  className="w-48 h-auto mx-auto lg:mx-0 drop-shadow-xl"
                />
              </div>

              <h2 className="heading-lg text-2xl md:text-3xl mb-4">
                {t(`${guideType}.title`)}
              </h2>
              <p className="body-lg text-muted-foreground mb-8">
                {t(`${guideType}.subtitle`)}
              </p>

              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <motion.li
                    key={`${guideType}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#BEB09E] flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="body-md">{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white p-8 lg:p-10 shadow-lg"
            >
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-[#BEB09E]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-8 h-8 text-[#BEB09E]" />
                  </div>
                  <p className="body-lg">{t("success")}</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="firstName"
                      className="font-sans text-sm uppercase tracking-wider"
                    >
                      {t("form.firstName")}
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        if (errors.firstName) {
                          validateField("firstName", e.target.value);
                        }
                      }}
                      onBlur={() => validateField("firstName", firstName)}
                      aria-invalid={!!errors.firstName}
                      className={`rounded-none border-[#BEB09E]/30 focus:border-[#BEB09E] h-12 font-serif text-lg ${
                        errors.firstName ? "border-red-500 focus:border-red-500" : ""
                      }`}
                    />
                    {errors.firstName && (
                      <p className="text-sm text-red-500 font-serif">
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="font-sans text-sm uppercase tracking-wider"
                    >
                      {t("form.email")}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) {
                          validateField("email", e.target.value);
                        }
                      }}
                      onBlur={() => validateField("email", email)}
                      aria-invalid={!!errors.email}
                      className={`rounded-none border-[#BEB09E]/30 focus:border-[#BEB09E] h-12 font-serif text-lg ${
                        errors.email ? "border-red-500 focus:border-red-500" : ""
                      }`}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500 font-serif">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-black text-white hover:bg-[#BEB09E] font-sans text-sm uppercase tracking-widest py-6 rounded-none transition-all duration-300"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : hasError ? (
                      tValidation("retry")
                    ) : (
                      t("form.submit")
                    )}
                  </Button>

                  <p className="text-center text-sm text-muted-foreground font-serif">
                    {t("form.privacy")}
                  </p>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
