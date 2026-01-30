"use client";

import { useState, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, useInView } from "framer-motion";
import { Loader2, Check, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getSessionId, setCTASource, clearSession } from "@/lib/session";
import { validateEmail, validateName, validatePhoneRequired } from "@/lib/validation";
import { useToast } from "@/components/toast-provider";
import { getUTMParams } from "@/lib/utm";

interface FormData {
  name: string;
  phone: string;
  email: string;
  languagePreference: string;
  timeline: string;
  incomeType: string;
  bankStatus: string;
  downPayment: string;
  area: string;
  source: string;
  notes: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  languagePreference?: string;
  timeline?: string;
  incomeType?: string;
  bankStatus?: string;
  downPayment?: string;
  area?: string;
  source?: string;
}

export function ConsultForm() {
  const t = useTranslations("consult.form");
  const tSuccess = useTranslations("consult.success");
  const tValidation = useTranslations("validation");
  const locale = useLocale();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    languagePreference: locale === "es" ? "es" : "en",
    timeline: "",
    incomeType: "",
    bankStatus: "",
    downPayment: "",
    area: "",
    source: "",
    notes: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const getErrorMessage = (errorKey: string): string => {
    const parts = errorKey.split(".");
    if (parts[0] === "validation" && parts.length >= 3) {
      return tValidation(`${parts[1]}.${parts[2]}`);
    }
    return tValidation("submitError");
  };

  const validateField = (field: keyof FormErrors, value: string) => {
    let result;
    switch (field) {
      case "name":
        result = validateName(value);
        break;
      case "phone":
        result = validatePhoneRequired(value);
        break;
      case "email":
        result = validateEmail(value);
        break;
      default:
        if (!value) {
          setErrors((prev) => ({ ...prev, [field]: tValidation("submitError") }));
          return;
        }
        setErrors((prev) => ({ ...prev, [field]: undefined }));
        return;
    }

    if (!result.valid && result.error) {
      setErrors((prev) => ({ ...prev, [field]: getErrorMessage(result.error!) }));
    } else {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateAllFields = (): boolean => {
    const newErrors: FormErrors = {};

    const nameResult = validateName(formData.name);
    if (!nameResult.valid && nameResult.error) {
      newErrors.name = getErrorMessage(nameResult.error);
    }

    const phoneResult = validatePhoneRequired(formData.phone);
    if (!phoneResult.valid && phoneResult.error) {
      newErrors.phone = getErrorMessage(phoneResult.error);
    }

    const emailResult = validateEmail(formData.email);
    if (!emailResult.valid && emailResult.error) {
      newErrors.email = getErrorMessage(emailResult.error);
    }

    // Required select fields
    const requiredFields: (keyof FormErrors)[] = [
      "languagePreference",
      "timeline",
      "incomeType",
      "bankStatus",
      "downPayment",
      "area",
      "source",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = tValidation("submitError");
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAllFields()) {
      return;
    }

    setIsSubmitting(true);

    try {
      setCTASource("consult_form");
      const sessionId = getSessionId();
      const utmParams = getUTMParams();

      const payload = {
        type: "consult",
        session_id: sessionId,
        cta_source: "consult_form",
        contact: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          languagePreference: formData.languagePreference,
        },
        qualification: {
          timeline: formData.timeline,
          incomeType: formData.incomeType,
          bankStatus: formData.bankStatus,
          downPayment: formData.downPayment,
          area: formData.area,
        },
        tracking: {
          source: formData.source,
          notes: formData.notes || undefined,
        },
        locale,
        utm: utmParams,
      };

      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        clearSession();
        setIsSuccess(true);
        toast({
          title: tSuccess("title"),
          description: tSuccess("message"),
          variant: "success",
        });
      } else {
        const data = await response.json();
        if (data.details) {
          const serverErrors: FormErrors = {};
          Object.entries(data.details).forEach(([key, value]) => {
            if (key in formData) {
              serverErrors[key as keyof FormErrors] = getErrorMessage(
                value as string
              );
            }
          });
          setErrors(serverErrors);
        }
        toast({
          title: tValidation("submitError"),
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error submitting consult lead:", error);
      toast({
        title: tValidation("networkError"),
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (isSuccess) {
    return (
      <section ref={ref} id="form" className="section-padding bg-white">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto text-center py-16"
          >
            <div className="w-20 h-20 bg-[#BEB09E]/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <Check className="w-10 h-10 text-[#BEB09E]" />
            </div>
            <h2 className="heading-lg text-2xl md:text-3xl mb-4">
              {tSuccess("title")}
            </h2>
            <p className="body-lg text-muted-foreground mb-8">
              {tSuccess("message")}
            </p>
            <a
              href="https://wa.me/15124122352"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#BEB09E] hover:text-[#BEB09E]/80 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="font-sans text-sm uppercase tracking-wider">
                {tSuccess("whatsapp")}
              </span>
            </a>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} id="form" className="section-padding bg-white">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="heading-lg text-2xl md:text-3xl lg:text-4xl mb-4">
            {t("title")}
          </h2>
          <p className="body-lg text-muted-foreground max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto space-y-10"
        >
          {/* Contact Section */}
          <div className="space-y-6">
            <h3 className="font-sans text-xs uppercase tracking-[0.3em] text-[#BEB09E] border-b border-[#BEB09E]/20 pb-2">
              {t("sections.contact")}
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="font-sans text-sm uppercase tracking-wider"
                >
                  {t("fields.name")} *
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  onBlur={() => validateField("name", formData.name)}
                  placeholder={t("placeholders.name")}
                  aria-invalid={!!errors.name}
                  className={`rounded-none border-[#BEB09E]/30 focus:border-[#BEB09E] h-12 ${
                    errors.name ? "border-red-500 focus:border-red-500" : ""
                  }`}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="font-sans text-sm uppercase tracking-wider"
                >
                  {t("fields.phone")} *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  onBlur={() => validateField("phone", formData.phone)}
                  placeholder={t("placeholders.phone")}
                  aria-invalid={!!errors.phone}
                  className={`rounded-none border-[#BEB09E]/30 focus:border-[#BEB09E] h-12 ${
                    errors.phone ? "border-red-500 focus:border-red-500" : ""
                  }`}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="font-sans text-sm uppercase tracking-wider"
                >
                  {t("fields.email")} *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  onBlur={() => validateField("email", formData.email)}
                  placeholder={t("placeholders.email")}
                  aria-invalid={!!errors.email}
                  className={`rounded-none border-[#BEB09E]/30 focus:border-[#BEB09E] h-12 ${
                    errors.email ? "border-red-500 focus:border-red-500" : ""
                  }`}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="languagePreference"
                  className="font-sans text-sm uppercase tracking-wider"
                >
                  {t("fields.languagePreference")} *
                </Label>
                <Select
                  value={formData.languagePreference}
                  onValueChange={(value) => updateField("languagePreference", value)}
                >
                  <SelectTrigger
                    className={`rounded-none border-[#BEB09E]/30 focus:border-[#BEB09E] h-12 ${
                      errors.languagePreference
                        ? "border-red-500 focus:border-red-500"
                        : ""
                    }`}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">{t("options.language.es")}</SelectItem>
                    <SelectItem value="en">{t("options.language.en")}</SelectItem>
                  </SelectContent>
                </Select>
                {errors.languagePreference && (
                  <p className="text-sm text-red-500">{errors.languagePreference}</p>
                )}
              </div>
            </div>
          </div>

          {/* Qualification Section */}
          <div className="space-y-6">
            <h3 className="font-sans text-xs uppercase tracking-[0.3em] text-[#BEB09E] border-b border-[#BEB09E]/20 pb-2">
              {t("sections.qualification")}
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="timeline"
                  className="font-sans text-sm uppercase tracking-wider"
                >
                  {t("fields.timeline")} *
                </Label>
                <Select
                  value={formData.timeline}
                  onValueChange={(value) => updateField("timeline", value)}
                >
                  <SelectTrigger
                    className={`rounded-none border-[#BEB09E]/30 focus:border-[#BEB09E] h-12 ${
                      errors.timeline ? "border-red-500 focus:border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-3months">
                      {t("options.timeline.0-3months")}
                    </SelectItem>
                    <SelectItem value="3-6months">
                      {t("options.timeline.3-6months")}
                    </SelectItem>
                    <SelectItem value="6-12months">
                      {t("options.timeline.6-12months")}
                    </SelectItem>
                    <SelectItem value="12plus">
                      {t("options.timeline.12plus")}
                    </SelectItem>
                    <SelectItem value="exploring">
                      {t("options.timeline.exploring")}
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.timeline && (
                  <p className="text-sm text-red-500">{errors.timeline}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="incomeType"
                  className="font-sans text-sm uppercase tracking-wider"
                >
                  {t("fields.incomeType")} *
                </Label>
                <Select
                  value={formData.incomeType}
                  onValueChange={(value) => updateField("incomeType", value)}
                >
                  <SelectTrigger
                    className={`rounded-none border-[#BEB09E]/30 focus:border-[#BEB09E] h-12 ${
                      errors.incomeType ? "border-red-500 focus:border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="w2">{t("options.incomeType.w2")}</SelectItem>
                    <SelectItem value="1099">
                      {t("options.incomeType.1099")}
                    </SelectItem>
                    <SelectItem value="itin">
                      {t("options.incomeType.itin")}
                    </SelectItem>
                    <SelectItem value="mixed">
                      {t("options.incomeType.mixed")}
                    </SelectItem>
                    <SelectItem value="other">
                      {t("options.incomeType.other")}
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.incomeType && (
                  <p className="text-sm text-red-500">{errors.incomeType}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="bankStatus"
                  className="font-sans text-sm uppercase tracking-wider"
                >
                  {t("fields.bankStatus")} *
                </Label>
                <Select
                  value={formData.bankStatus}
                  onValueChange={(value) => updateField("bankStatus", value)}
                >
                  <SelectTrigger
                    className={`rounded-none border-[#BEB09E]/30 focus:border-[#BEB09E] h-12 ${
                      errors.bankStatus ? "border-red-500 focus:border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approved">
                      {t("options.bankStatus.approved")}
                    </SelectItem>
                    <SelectItem value="denied">
                      {t("options.bankStatus.denied")}
                    </SelectItem>
                    <SelectItem value="wait">
                      {t("options.bankStatus.wait")}
                    </SelectItem>
                    <SelectItem value="notYet">
                      {t("options.bankStatus.notYet")}
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.bankStatus && (
                  <p className="text-sm text-red-500">{errors.bankStatus}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="downPayment"
                  className="font-sans text-sm uppercase tracking-wider"
                >
                  {t("fields.downPayment")} *
                </Label>
                <Select
                  value={formData.downPayment}
                  onValueChange={(value) => updateField("downPayment", value)}
                >
                  <SelectTrigger
                    className={`rounded-none border-[#BEB09E]/30 focus:border-[#BEB09E] h-12 ${
                      errors.downPayment ? "border-red-500 focus:border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3percent">
                      {t("options.downPayment.3percent")}
                    </SelectItem>
                    <SelectItem value="some">
                      {t("options.downPayment.some")}
                    </SelectItem>
                    <SelectItem value="needDpa">
                      {t("options.downPayment.needDpa")}
                    </SelectItem>
                    <SelectItem value="none">
                      {t("options.downPayment.none")}
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.downPayment && (
                  <p className="text-sm text-red-500">{errors.downPayment}</p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label
                  htmlFor="area"
                  className="font-sans text-sm uppercase tracking-wider"
                >
                  {t("fields.area")} *
                </Label>
                <Select
                  value={formData.area}
                  onValueChange={(value) => updateField("area", value)}
                >
                  <SelectTrigger
                    className={`rounded-none border-[#BEB09E]/30 focus:border-[#BEB09E] h-12 ${
                      errors.area ? "border-red-500 focus:border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="austin">{t("options.area.austin")}</SelectItem>
                    <SelectItem value="roundRock">
                      {t("options.area.roundRock")}
                    </SelectItem>
                    <SelectItem value="pflugerville">
                      {t("options.area.pflugerville")}
                    </SelectItem>
                    <SelectItem value="georgetown">
                      {t("options.area.georgetown")}
                    </SelectItem>
                    <SelectItem value="hays">{t("options.area.hays")}</SelectItem>
                    <SelectItem value="bastrop">
                      {t("options.area.bastrop")}
                    </SelectItem>
                    <SelectItem value="other">{t("options.area.other")}</SelectItem>
                    <SelectItem value="flexible">
                      {t("options.area.flexible")}
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.area && (
                  <p className="text-sm text-red-500">{errors.area}</p>
                )}
              </div>
            </div>
          </div>

          {/* Tracking Section */}
          <div className="space-y-6">
            <h3 className="font-sans text-xs uppercase tracking-[0.3em] text-[#BEB09E] border-b border-[#BEB09E]/20 pb-2">
              {t("sections.tracking")}
            </h3>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="source"
                  className="font-sans text-sm uppercase tracking-wider"
                >
                  {t("fields.source")} *
                </Label>
                <Select
                  value={formData.source}
                  onValueChange={(value) => updateField("source", value)}
                >
                  <SelectTrigger
                    className={`rounded-none border-[#BEB09E]/30 focus:border-[#BEB09E] h-12 ${
                      errors.source ? "border-red-500 focus:border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">
                      {t("options.source.instagram")}
                    </SelectItem>
                    <SelectItem value="facebook">
                      {t("options.source.facebook")}
                    </SelectItem>
                    <SelectItem value="referral">
                      {t("options.source.referral")}
                    </SelectItem>
                    <SelectItem value="google">
                      {t("options.source.google")}
                    </SelectItem>
                    <SelectItem value="other">{t("options.source.other")}</SelectItem>
                  </SelectContent>
                </Select>
                {errors.source && (
                  <p className="text-sm text-red-500">{errors.source}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="notes"
                  className="font-sans text-sm uppercase tracking-wider"
                >
                  {t("fields.notes")}
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                  placeholder={t("placeholders.notes")}
                  rows={4}
                  className="rounded-none border-[#BEB09E]/30 focus:border-[#BEB09E] resize-none"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="space-y-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black text-white hover:bg-[#BEB09E] font-sans text-sm uppercase tracking-widest py-6 rounded-none transition-all duration-300"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  {t("submitting")}
                </>
              ) : (
                t("submit")
              )}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              {t("privacy")}
            </p>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
