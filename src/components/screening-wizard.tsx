"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/toast-provider";
import { validateEmail, validatePhone, validateName } from "@/lib/validation";

type Step =
  | "contact"
  | "preapproval"
  | "income"
  | "credit"
  | "savings"
  | "timeline"
  | "additional"
  | "success";

interface ScreeningData {
  // Contact (pre-filled from session if available)
  email: string;
  phone: string;
  fullName: string;
  // Pre-approval & Immigration
  hasPreapproval: string;
  immigrationStatus: string;
  // Income & Employment
  monthlyIncome: string;
  monthlyDebt: string;
  paymentType: string;
  employmentType: string;
  // Credit & Debts
  creditScore: string;
  hasAutoLoan: string;
  hasCreditCards: string;
  taxYears: string;
  // Savings & Down Payment
  downPayment: string;
  savingsLocation: string;
  // Timeline & Property
  leaseEndDate: string;
  moveDate: string;
  propertyType: string;
  isHomeowner: string;
  willSellHome: string;
  buyingWith: string;
  militaryService: string;
  // Additional
  additionalInfo: string;
}

interface ScreeningWizardProps {
  sessionId: string | null;
  locale: string;
  prefillData?: {
    email?: string;
    phone?: string;
    name?: string;
  };
}

const STEPS: Step[] = [
  "contact",
  "preapproval",
  "income",
  "credit",
  "savings",
  "timeline",
  "additional",
];

export function ScreeningWizard({
  sessionId,
  locale,
  prefillData,
}: ScreeningWizardProps) {
  const t = useTranslations("screening");
  const tValidation = useTranslations("validation");
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState<Step>("contact");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<ScreeningData>({
    email: prefillData?.email || "",
    phone: prefillData?.phone || "",
    fullName: prefillData?.name || "",
    hasPreapproval: "",
    immigrationStatus: "",
    monthlyIncome: "",
    monthlyDebt: "",
    paymentType: "",
    employmentType: "",
    creditScore: "",
    hasAutoLoan: "",
    hasCreditCards: "",
    taxYears: "",
    downPayment: "",
    savingsLocation: "",
    leaseEndDate: "",
    moveDate: "",
    propertyType: "",
    isHomeowner: "",
    willSellHome: "",
    buyingWith: "",
    militaryService: "",
    additionalInfo: "",
  });

  // Update form data when prefill data changes
  useEffect(() => {
    if (prefillData) {
      setFormData((prev) => ({
        ...prev,
        email: prefillData.email || prev.email,
        phone: prefillData.phone || prev.phone,
        fullName: prefillData.name || prev.fullName,
      }));
    }
  }, [prefillData]);

  const currentStepIndex = STEPS.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100;

  const updateField = (field: keyof ScreeningData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user updates field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep = (step: Step): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === "contact") {
      const nameResult = validateName(formData.fullName);
      if (!nameResult.valid) {
        newErrors.fullName = tValidation("name.required");
      }
      const emailResult = validateEmail(formData.email);
      if (!emailResult.valid) {
        newErrors.email = tValidation("email.invalid");
      }
      if (formData.phone) {
        const phoneResult = validatePhone(formData.phone);
        if (!phoneResult.valid) {
          newErrors.phone = tValidation("phone.invalid");
        }
      }
    } else if (step === "preapproval") {
      if (!formData.hasPreapproval) {
        newErrors.hasPreapproval = t("errors.required");
      }
      if (!formData.immigrationStatus) {
        newErrors.immigrationStatus = t("errors.required");
      }
    } else if (step === "income") {
      if (!formData.monthlyIncome) {
        newErrors.monthlyIncome = t("errors.required");
      }
      if (!formData.paymentType) {
        newErrors.paymentType = t("errors.required");
      }
      if (!formData.employmentType) {
        newErrors.employmentType = t("errors.required");
      }
    } else if (step === "credit") {
      if (!formData.creditScore) {
        newErrors.creditScore = t("errors.required");
      }
      if (!formData.hasAutoLoan) {
        newErrors.hasAutoLoan = t("errors.required");
      }
      if (!formData.hasCreditCards) {
        newErrors.hasCreditCards = t("errors.required");
      }
      if (!formData.taxYears) {
        newErrors.taxYears = t("errors.required");
      }
    } else if (step === "savings") {
      if (!formData.downPayment) {
        newErrors.downPayment = t("errors.required");
      }
      if (!formData.savingsLocation) {
        newErrors.savingsLocation = t("errors.required");
      }
    } else if (step === "timeline") {
      if (!formData.moveDate) {
        newErrors.moveDate = t("errors.required");
      }
      if (!formData.propertyType) {
        newErrors.propertyType = t("errors.required");
      }
      if (!formData.isHomeowner) {
        newErrors.isHomeowner = t("errors.required");
      }
      if (!formData.buyingWith) {
        newErrors.buyingWith = t("errors.required");
      }
      if (!formData.militaryService) {
        newErrors.militaryService = t("errors.required");
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goNext = () => {
    if (!validateStep(currentStep)) return;

    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEPS.length) {
      setCurrentStep(STEPS[nextIndex]);
    } else {
      handleSubmit();
    }
  };

  const goBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(STEPS[prevIndex]);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/screening", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          locale,
          screening: formData,
        }),
      });

      if (response.ok) {
        setCurrentStep("success");
      } else {
        const data = await response.json();
        toast({
          title: data.error || tValidation("submitError"),
          variant: "error",
        });
      }
    } catch {
      toast({
        title: tValidation("networkError"),
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Option buttons component
  const OptionButton = ({
    value,
    label,
    field,
    selected,
  }: {
    value: string;
    label: string;
    field: keyof ScreeningData;
    selected: boolean;
  }) => (
    <button
      type="button"
      onClick={() => updateField(field, value)}
      className={`w-full text-left p-4 border transition-all ${
        selected
          ? "border-[#BEB09E] bg-[#BEB09E]/10"
          : "border-[#BEB09E]/30 hover:border-[#BEB09E]"
      }`}
    >
      <span className="font-serif text-base">{label}</span>
    </button>
  );

  // Field error display
  const FieldError = ({ field }: { field: string }) =>
    errors[field] ? (
      <p className="text-sm text-red-500 mt-1">{errors[field]}</p>
    ) : null;

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case "contact":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="heading-md text-xl mb-2">{t("steps.contact.title")}</h2>
              <p className="body-md text-muted-foreground">
                {t("steps.contact.description")}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-sans uppercase tracking-wider mb-2">
                  {t("fields.fullName")} *
                </label>
                <Input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  placeholder={t("placeholders.fullName")}
                  className="rounded-none border-[#BEB09E]/30 focus:border-[#BEB09E] h-12 font-serif"
                />
                <FieldError field="fullName" />
              </div>

              <div>
                <label className="block text-sm font-sans uppercase tracking-wider mb-2">
                  {t("fields.email")} *
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder={t("placeholders.email")}
                  className="rounded-none border-[#BEB09E]/30 focus:border-[#BEB09E] h-12 font-serif"
                />
                <FieldError field="email" />
              </div>

              <div>
                <label className="block text-sm font-sans uppercase tracking-wider mb-2">
                  {t("fields.phone")}
                </label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder={t("placeholders.phone")}
                  className="rounded-none border-[#BEB09E]/30 focus:border-[#BEB09E] h-12 font-serif"
                />
                <FieldError field="phone" />
              </div>
            </div>
          </div>
        );

      case "preapproval":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="heading-md text-xl mb-2">
                {t("steps.preapproval.title")}
              </h2>
              <p className="body-md text-muted-foreground">
                {t("steps.preapproval.description")}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-sans uppercase tracking-wider mb-3">
                  {t("fields.hasPreapproval")} *
                </label>
                <div className="space-y-2">
                  <OptionButton
                    value="yes"
                    label={t("options.yes")}
                    field="hasPreapproval"
                    selected={formData.hasPreapproval === "yes"}
                  />
                  <OptionButton
                    value="no"
                    label={t("options.no")}
                    field="hasPreapproval"
                    selected={formData.hasPreapproval === "no"}
                  />
                </div>
                <FieldError field="hasPreapproval" />
              </div>

              <div>
                <label className="block text-sm font-sans uppercase tracking-wider mb-3">
                  {t("fields.immigrationStatus")} *
                </label>
                <div className="space-y-2">
                  {["citizen", "resident", "workVisa", "itin"].map((option) => (
                    <OptionButton
                      key={option}
                      value={option}
                      label={t(`options.immigrationStatus.${option}`)}
                      field="immigrationStatus"
                      selected={formData.immigrationStatus === option}
                    />
                  ))}
                </div>
                <FieldError field="immigrationStatus" />
              </div>
            </div>
          </div>
        );

      case "income":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="heading-md text-xl mb-2">{t("steps.income.title")}</h2>
              <p className="body-md text-muted-foreground">
                {t("steps.income.description")}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-sans uppercase tracking-wider mb-2">
                  {t("fields.monthlyIncome")} *
                </label>
                <Input
                  type="number"
                  value={formData.monthlyIncome}
                  onChange={(e) => updateField("monthlyIncome", e.target.value)}
                  placeholder={t("placeholders.monthlyIncome")}
                  className="rounded-none border-[#BEB09E]/30 focus:border-[#BEB09E] h-12 font-serif"
                />
                <FieldError field="monthlyIncome" />
              </div>

              <div>
                <label className="block text-sm font-sans uppercase tracking-wider mb-2">
                  {t("fields.monthlyDebt")}
                </label>
                <textarea
                  value={formData.monthlyDebt}
                  onChange={(e) => updateField("monthlyDebt", e.target.value)}
                  placeholder={t("placeholders.monthlyDebt")}
                  className="w-full rounded-none border border-[#BEB09E]/30 focus:border-[#BEB09E] p-3 font-serif resize-none h-24"
                />
              </div>

              <div>
                <label className="block text-sm font-sans uppercase tracking-wider mb-3">
                  {t("fields.paymentType")} *
                </label>
                <div className="space-y-2">
                  {["hourly", "salary", "commission", "contractor", "other"].map(
                    (option) => (
                      <OptionButton
                        key={option}
                        value={option}
                        label={t(`options.paymentType.${option}`)}
                        field="paymentType"
                        selected={formData.paymentType === option}
                      />
                    )
                  )}
                </div>
                <FieldError field="paymentType" />
              </div>

              <div>
                <label className="block text-sm font-sans uppercase tracking-wider mb-3">
                  {t("fields.employmentType")} *
                </label>
                <div className="space-y-2">
                  {["w2", "1099", "none"].map((option) => (
                    <OptionButton
                      key={option}
                      value={option}
                      label={t(`options.employmentType.${option}`)}
                      field="employmentType"
                      selected={formData.employmentType === option}
                    />
                  ))}
                </div>
                <FieldError field="employmentType" />
              </div>
            </div>
          </div>
        );

      case "credit":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="heading-md text-xl mb-2">{t("steps.credit.title")}</h2>
              <p className="body-md text-muted-foreground">
                {t("steps.credit.description")}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-sans uppercase tracking-wider mb-3">
                  {t("fields.creditScore")} *
                </label>
                <div className="space-y-2">
                  {["700plus", "640to699", "600to639", "below600", "unknown"].map(
                    (option) => (
                      <OptionButton
                        key={option}
                        value={option}
                        label={t(`options.creditScore.${option}`)}
                        field="creditScore"
                        selected={formData.creditScore === option}
                      />
                    )
                  )}
                </div>
                <FieldError field="creditScore" />
              </div>

              <div>
                <label className="block text-sm font-sans uppercase tracking-wider mb-3">
                  {t("fields.hasAutoLoan")} *
                </label>
                <div className="space-y-2">
                  <OptionButton
                    value="yes"
                    label={t("options.yes")}
                    field="hasAutoLoan"
                    selected={formData.hasAutoLoan === "yes"}
                  />
                  <OptionButton
                    value="no"
                    label={t("options.no")}
                    field="hasAutoLoan"
                    selected={formData.hasAutoLoan === "no"}
                  />
                </div>
                <FieldError field="hasAutoLoan" />
              </div>

              <div>
                <label className="block text-sm font-sans uppercase tracking-wider mb-3">
                  {t("fields.hasCreditCards")} *
                </label>
                <div className="space-y-2">
                  <OptionButton
                    value="yes"
                    label={t("options.yes")}
                    field="hasCreditCards"
                    selected={formData.hasCreditCards === "yes"}
                  />
                  <OptionButton
                    value="no"
                    label={t("options.no")}
                    field="hasCreditCards"
                    selected={formData.hasCreditCards === "no"}
                  />
                </div>
                <FieldError field="hasCreditCards" />
              </div>

              <div>
                <label className="block text-sm font-sans uppercase tracking-wider mb-3">
                  {t("fields.taxYears")} *
                </label>
                <div className="space-y-2">
                  {["twoPlus", "one", "never"].map((option) => (
                    <OptionButton
                      key={option}
                      value={option}
                      label={t(`options.taxYears.${option}`)}
                      field="taxYears"
                      selected={formData.taxYears === option}
                    />
                  ))}
                </div>
                <FieldError field="taxYears" />
              </div>
            </div>
          </div>
        );

      case "savings":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="heading-md text-xl mb-2">{t("steps.savings.title")}</h2>
              <p className="body-md text-muted-foreground">
                {t("steps.savings.description")}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-sans uppercase tracking-wider mb-2">
                  {t("fields.downPayment")} *
                </label>
                <Input
                  type="number"
                  value={formData.downPayment}
                  onChange={(e) => updateField("downPayment", e.target.value)}
                  placeholder={t("placeholders.downPayment")}
                  className="rounded-none border-[#BEB09E]/30 focus:border-[#BEB09E] h-12 font-serif"
                />
                <FieldError field="downPayment" />
              </div>

              <div>
                <label className="block text-sm font-sans uppercase tracking-wider mb-3">
                  {t("fields.savingsLocation")} *
                </label>
                <div className="space-y-2">
                  {["bank", "cash", "both"].map((option) => (
                    <OptionButton
                      key={option}
                      value={option}
                      label={t(`options.savingsLocation.${option}`)}
                      field="savingsLocation"
                      selected={formData.savingsLocation === option}
                    />
                  ))}
                </div>
                <FieldError field="savingsLocation" />
              </div>
            </div>
          </div>
        );

      case "timeline":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="heading-md text-xl mb-2">{t("steps.timeline.title")}</h2>
              <p className="body-md text-muted-foreground">
                {t("steps.timeline.description")}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-sans uppercase tracking-wider mb-2">
                  {t("fields.leaseEndDate")}
                </label>
                <Input
                  type="text"
                  value={formData.leaseEndDate}
                  onChange={(e) => updateField("leaseEndDate", e.target.value)}
                  placeholder={t("placeholders.leaseEndDate")}
                  className="rounded-none border-[#BEB09E]/30 focus:border-[#BEB09E] h-12 font-serif"
                />
              </div>

              <div>
                <label className="block text-sm font-sans uppercase tracking-wider mb-3">
                  {t("fields.moveDate")} *
                </label>
                <div className="space-y-2">
                  {["under1month", "1to3months", "3to6months", "6plusMonths"].map(
                    (option) => (
                      <OptionButton
                        key={option}
                        value={option}
                        label={t(`options.moveDate.${option}`)}
                        field="moveDate"
                        selected={formData.moveDate === option}
                      />
                    )
                  )}
                </div>
                <FieldError field="moveDate" />
              </div>

              <div>
                <label className="block text-sm font-sans uppercase tracking-wider mb-3">
                  {t("fields.propertyType")} *
                </label>
                <div className="space-y-2">
                  {[
                    "newHome",
                    "resale",
                    "mobile",
                    "traditional",
                    "land",
                    "apartment",
                    "condo",
                  ].map((option) => (
                    <OptionButton
                      key={option}
                      value={option}
                      label={t(`options.propertyType.${option}`)}
                      field="propertyType"
                      selected={formData.propertyType === option}
                    />
                  ))}
                </div>
                <FieldError field="propertyType" />
              </div>

              <div>
                <label className="block text-sm font-sans uppercase tracking-wider mb-3">
                  {t("fields.isHomeowner")} *
                </label>
                <div className="space-y-2">
                  <OptionButton
                    value="yes"
                    label={t("options.yes")}
                    field="isHomeowner"
                    selected={formData.isHomeowner === "yes"}
                  />
                  <OptionButton
                    value="no"
                    label={t("options.no")}
                    field="isHomeowner"
                    selected={formData.isHomeowner === "no"}
                  />
                </div>
                <FieldError field="isHomeowner" />
              </div>

              {formData.isHomeowner === "yes" && (
                <div>
                  <label className="block text-sm font-sans uppercase tracking-wider mb-3">
                    {t("fields.willSellHome")}
                  </label>
                  <div className="space-y-2">
                    {["yes", "no", "notApplicable"].map((option) => (
                      <OptionButton
                        key={option}
                        value={option}
                        label={t(`options.willSellHome.${option}`)}
                        field="willSellHome"
                        selected={formData.willSellHome === option}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-sans uppercase tracking-wider mb-3">
                  {t("fields.buyingWith")} *
                </label>
                <div className="space-y-2">
                  {["alone", "withSomeone"].map((option) => (
                    <OptionButton
                      key={option}
                      value={option}
                      label={t(`options.buyingWith.${option}`)}
                      field="buyingWith"
                      selected={formData.buyingWith === option}
                    />
                  ))}
                </div>
                <FieldError field="buyingWith" />
              </div>

              <div>
                <label className="block text-sm font-sans uppercase tracking-wider mb-3">
                  {t("fields.militaryService")} *
                </label>
                <div className="space-y-2">
                  {["yes", "no", "notEnoughTime"].map((option) => (
                    <OptionButton
                      key={option}
                      value={option}
                      label={t(`options.militaryService.${option}`)}
                      field="militaryService"
                      selected={formData.militaryService === option}
                    />
                  ))}
                </div>
                <FieldError field="militaryService" />
              </div>
            </div>
          </div>
        );

      case "additional":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="heading-md text-xl mb-2">
                {t("steps.additional.title")}
              </h2>
              <p className="body-md text-muted-foreground">
                {t("steps.additional.description")}
              </p>
            </div>

            <div>
              <label className="block text-sm font-sans uppercase tracking-wider mb-2">
                {t("fields.additionalInfo")}
              </label>
              <textarea
                value={formData.additionalInfo}
                onChange={(e) => updateField("additionalInfo", e.target.value)}
                placeholder={t("placeholders.additionalInfo")}
                className="w-full rounded-none border border-[#BEB09E]/30 focus:border-[#BEB09E] p-4 font-serif resize-none h-32"
              />
            </div>
          </div>
        );

      case "success":
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 bg-[#BEB09E]/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <Check className="w-10 h-10 text-[#BEB09E]" />
            </div>
            <h2 className="heading-md text-2xl mb-4">{t("success.title")}</h2>
            <p className="body-md text-muted-foreground mb-8 max-w-md mx-auto">
              {t("success.message")}
            </p>
          </motion.div>
        );

      default:
        return null;
    }
  };

  const isLastStep = currentStep === "additional";

  return (
    <div className="min-h-screen bg-[#f4f1ec]">
      {/* Header */}
      <div className="bg-black py-10 px-6 text-center">
        <h1 className="text-white font-sans text-2xl tracking-[0.2em] uppercase font-normal">
          SULLY RUIZ
        </h1>
        <p className="text-[#BEB09E] text-xs tracking-[0.15em] uppercase mt-2">
          {t("header.subtitle")}
        </p>
      </div>

      {/* Progress bar */}
      {currentStep !== "success" && (
        <div className="w-full h-1 bg-[#BEB09E]/20">
          <motion.div
            className="h-full bg-[#BEB09E]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}

      {/* Form content */}
      <div className="max-w-xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        {currentStep !== "success" && (
          <div className="flex justify-between mt-10 pt-6 border-t border-[#BEB09E]/20">
            <Button
              type="button"
              variant="outline"
              onClick={goBack}
              disabled={currentStepIndex === 0}
              className="rounded-none border-[#BEB09E]/30 hover:border-[#BEB09E] px-6 py-5"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              {t("navigation.back")}
            </Button>

            <Button
              type="button"
              onClick={goNext}
              disabled={isSubmitting}
              className="bg-black text-white hover:bg-[#BEB09E] rounded-none px-8 py-5 font-sans text-sm uppercase tracking-widest"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isLastStep ? (
                t("navigation.submit")
              ) : (
                <>
                  {t("navigation.next")}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        )}

        {/* Step indicator */}
        {currentStep !== "success" && (
          <div className="flex justify-center gap-2 mt-8">
            {STEPS.map((step, index) => (
              <div
                key={step}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index <= currentStepIndex ? "bg-[#BEB09E]" : "bg-[#BEB09E]/30"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
