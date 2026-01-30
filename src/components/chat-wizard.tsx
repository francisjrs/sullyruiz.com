"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { getSessionData, clearSession } from "@/lib/session";
import { validateName, validatePhone, validateEmail } from "@/lib/validation";
import { useToast } from "@/components/toast-provider";
import { trackWizardStep, trackWizardClose, trackLeadGeneration, trackFormError } from "@/lib/analytics";
import { getUTMParams } from "@/lib/utm";

type FlowType = "buy" | "sell" | null;
type Step =
  | "welcome"
  | "propertyType"
  | "area"
  | "budget"
  | "timeline"
  | "reason"
  | "address"
  | "contactName"
  | "contactPhone"
  | "contactEmail"
  | "success";

interface Message {
  id: string;
  type: "bot" | "user";
  content: string;
  options?: { value: string; label: string }[];
  inputType?: "text" | "tel" | "email";
  inputPlaceholder?: string;
}

interface ChatWizardProps {
  isOpen: boolean;
  onClose: () => void;
  initialFlow?: FlowType;
}

export function ChatWizard({ isOpen, onClose, initialFlow }: ChatWizardProps) {
  const t = useTranslations("chat");
  const tValidation = useTranslations("validation");
  const locale = useLocale();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const [flow, setFlow] = useState<FlowType>(initialFlow ?? null);
  const [step, setStep] = useState<Step>("welcome");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);

  const getErrorMessage = (errorKey: string): string => {
    const parts = errorKey.split(".");
    if (parts[0] === "validation" && parts.length >= 3) {
      return tValidation(`${parts[1]}.${parts[2]}`);
    }
    return tValidation("submitError");
  };

  // Form data
  const [formData, setFormData] = useState({
    flow: "",
    propertyType: "",
    area: "",
    budget: "",
    timeline: "",
    reason: "",
    address: "",
    name: "",
    phone: "",
    email: "",
  });

  // Reset when opening
  useEffect(() => {
    if (isOpen) {
      setFlow(initialFlow ?? null);
      setStep("welcome");
      setMessages([]);
      setFieldError(null);
      setFormData({
        flow: "",
        propertyType: "",
        area: "",
        budget: "",
        timeline: "",
        reason: "",
        address: "",
        name: "",
        phone: "",
        email: "",
      });
      // Start with welcome message
      setTimeout(() => addBotMessage("welcome"), 500);
    }
  }, [isOpen, initialFlow]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addBotMessage = (messageStep: Step, currentFlow?: FlowType) => {
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const newMessage = createBotMessage(messageStep, currentFlow);
      if (newMessage) {
        setMessages((prev) => [...prev, newMessage]);
      }
    }, 800);
  };

  const createBotMessage = (messageStep: Step, currentFlow?: FlowType): Message | null => {
    const id = Date.now().toString();
    // Use passed flow or fall back to state (for steps that don't need it)
    const activeFlow = currentFlow ?? flow;

    switch (messageStep) {
      case "welcome":
        return {
          id,
          type: "bot",
          content: t("welcome"),
          options: [
            { value: "buy", label: t("buyOrSell.buy") },
            { value: "sell", label: t("buyOrSell.sell") },
          ],
        };

      case "propertyType":
        return {
          id,
          type: "bot",
          content:
            activeFlow === "buy"
              ? t("buy.propertyType.question")
              : t("sell.propertyType.question"),
          options: [
            {
              value: "singleFamily",
              label:
                activeFlow === "buy"
                  ? t("buy.propertyType.options.singleFamily")
                  : t("sell.propertyType.options.singleFamily"),
            },
            {
              value: "condo",
              label:
                activeFlow === "buy"
                  ? t("buy.propertyType.options.condo")
                  : t("sell.propertyType.options.condo"),
            },
            {
              value: "multiFamily",
              label:
                activeFlow === "buy"
                  ? t("buy.propertyType.options.multiFamily")
                  : t("sell.propertyType.options.multiFamily"),
            },
            {
              value: "land",
              label:
                activeFlow === "buy"
                  ? t("buy.propertyType.options.land")
                  : t("sell.propertyType.options.land"),
            },
          ],
        };

      case "area":
        return {
          id,
          type: "bot",
          content: t("buy.area.question"),
          options: [
            { value: "austin", label: t("buy.area.options.austin") },
            { value: "houston", label: t("buy.area.options.houston") },
            { value: "sanAntonio", label: t("buy.area.options.sanAntonio") },
            { value: "dallas", label: t("buy.area.options.dallas") },
          ],
        };

      case "address":
        return {
          id,
          type: "bot",
          content: t("sell.address.question"),
          inputType: "text",
          inputPlaceholder: t("sell.address.placeholder"),
        };

      case "budget":
        return {
          id,
          type: "bot",
          content: t("buy.budget.question"),
          options: [
            { value: "under300", label: t("buy.budget.options.under300") },
            { value: "300to500", label: t("buy.budget.options.300to500") },
            { value: "500to750", label: t("buy.budget.options.500to750") },
            { value: "750to1m", label: t("buy.budget.options.750to1m") },
            { value: "over1m", label: t("buy.budget.options.over1m") },
          ],
        };

      case "timeline":
        return {
          id,
          type: "bot",
          content:
            activeFlow === "buy"
              ? t("buy.timeline.question")
              : t("sell.timeline.question"),
          options:
            activeFlow === "buy"
              ? [
                  { value: "asap", label: t("buy.timeline.options.asap") },
                  {
                    value: "1to3months",
                    label: t("buy.timeline.options.1to3months"),
                  },
                  {
                    value: "3to6months",
                    label: t("buy.timeline.options.3to6months"),
                  },
                  { value: "6plus", label: t("buy.timeline.options.6plus") },
                  {
                    value: "justLooking",
                    label: t("buy.timeline.options.justLooking"),
                  },
                ]
              : [
                  { value: "asap", label: t("sell.timeline.options.asap") },
                  {
                    value: "1to3months",
                    label: t("sell.timeline.options.1to3months"),
                  },
                  {
                    value: "3to6months",
                    label: t("sell.timeline.options.3to6months"),
                  },
                  {
                    value: "flexible",
                    label: t("sell.timeline.options.flexible"),
                  },
                ],
        };

      case "reason":
        return {
          id,
          type: "bot",
          content: t("sell.reason.question"),
          options: [
            { value: "relocating", label: t("sell.reason.options.relocating") },
            { value: "upgrading", label: t("sell.reason.options.upgrading") },
            { value: "downsizing", label: t("sell.reason.options.downsizing") },
            { value: "investment", label: t("sell.reason.options.investment") },
            { value: "other", label: t("sell.reason.options.other") },
          ],
        };

      case "contactName":
        return {
          id,
          type: "bot",
          content: t("contact.intro") + " " + t("contact.name.question"),
          inputType: "text",
          inputPlaceholder: t("contact.name.placeholder"),
        };

      case "contactPhone":
        return {
          id,
          type: "bot",
          content: t("contact.phone.question"),
          inputType: "tel",
          inputPlaceholder: t("contact.phone.placeholder"),
        };

      case "contactEmail":
        return {
          id,
          type: "bot",
          content: t("contact.email.question"),
          inputType: "email",
          inputPlaceholder: t("contact.email.placeholder"),
        };

      default:
        return null;
    }
  };

  const addUserMessage = (content: string) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), type: "user", content },
    ]);
  };

  const handleOptionSelect = (value: string, label: string) => {
    addUserMessage(label);

    // Track step progression
    trackWizardStep({ step, flow, value });

    if (step === "welcome") {
      const selectedFlow = value as FlowType;
      setFlow(selectedFlow);
      setFormData((prev) => ({ ...prev, flow: value }));
      setStep("propertyType");
      setTimeout(() => addBotMessage("propertyType", selectedFlow), 300);
    } else if (step === "propertyType") {
      setFormData((prev) => ({ ...prev, propertyType: value }));
      if (flow === "buy") {
        setStep("area");
        setTimeout(() => addBotMessage("area"), 300);
      } else {
        setStep("address");
        setTimeout(() => addBotMessage("address"), 300);
      }
    } else if (step === "area") {
      setFormData((prev) => ({ ...prev, area: value }));
      setStep("budget");
      setTimeout(() => addBotMessage("budget"), 300);
    } else if (step === "budget") {
      setFormData((prev) => ({ ...prev, budget: value }));
      setStep("timeline");
      setTimeout(() => addBotMessage("timeline"), 300);
    } else if (step === "timeline") {
      setFormData((prev) => ({ ...prev, timeline: value }));
      setStep("contactName");
      setTimeout(() => addBotMessage("contactName"), 300);
    } else if (step === "reason") {
      setFormData((prev) => ({ ...prev, reason: value }));
      setStep("timeline");
      setTimeout(() => addBotMessage("timeline"), 300);
    }
  };

  const handleInputSubmit = async () => {
    if (!inputValue.trim()) return;

    const value = inputValue.trim();

    // Validate based on current step
    if (step === "contactName") {
      const result = validateName(value);
      if (!result.valid && result.error) {
        setFieldError(getErrorMessage(result.error));
        trackFormError({
          form_name: "chat_wizard",
          error_field: "name",
          error_type: result.error.includes("required") ? "required" : "invalid",
        });
        return;
      }
    } else if (step === "contactPhone") {
      // Phone is optional but must be valid format if provided
      if (value) {
        const result = validatePhone(value);
        if (!result.valid && result.error) {
          setFieldError(getErrorMessage(result.error));
          trackFormError({
            form_name: "chat_wizard",
            error_field: "phone",
            error_type: "invalid",
          });
          return;
        }
      }
    } else if (step === "contactEmail") {
      const result = validateEmail(value);
      if (!result.valid && result.error) {
        setFieldError(getErrorMessage(result.error));
        trackFormError({
          form_name: "chat_wizard",
          error_field: "email",
          error_type: result.error.includes("required") ? "required" : "invalid",
        });
        return;
      }
    }

    // Clear any previous error
    setFieldError(null);
    addUserMessage(value);
    setInputValue("");

    // Track step progression for input steps
    trackWizardStep({ step, flow });

    if (step === "address") {
      setFormData((prev) => ({ ...prev, address: value }));
      setStep("reason");
      setTimeout(() => addBotMessage("reason"), 300);
    } else if (step === "contactName") {
      setFormData((prev) => ({ ...prev, name: value }));
      setStep("contactPhone");
      setTimeout(() => addBotMessage("contactPhone"), 300);
    } else if (step === "contactPhone") {
      setFormData((prev) => ({ ...prev, phone: value }));
      setStep("contactEmail");
      setTimeout(() => addBotMessage("contactEmail"), 300);
    } else if (step === "contactEmail") {
      setFormData((prev) => ({ ...prev, email: value }));
      // Submit the form
      await submitLead({ ...formData, email: value });
    }
  };

  const submitLead = async (data: typeof formData) => {
    setIsSubmitting(true);

    try {
      const sessionData = getSessionData();
      const utmParams = getUTMParams();

      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "chat_wizard",
          flow: data.flow,
          session_id: sessionData.session_id,
          cta_source: sessionData.cta_source,
          answers: {
            propertyType: data.propertyType,
            area: data.area,
            budget: data.budget,
            timeline: data.timeline,
            reason: data.reason,
            address: data.address,
          },
          contact: {
            name: data.name,
            phone: data.phone,
            email: data.email,
          },
          locale,
          utm: utmParams,
        }),
      });

      if (response.ok) {
        clearSession();
        setStep("success");
        trackLeadGeneration({ lead_source: "chat_wizard", flow: data.flow as "buy" | "sell" | null });
      } else {
        const responseData = await response.json();
        // Handle server-side validation errors
        if (responseData.details) {
          const errorKeys = Object.keys(responseData.details);
          if (errorKeys.length > 0) {
            setFieldError(getErrorMessage(responseData.details[errorKeys[0]]));
          }
        }
        toast({
          title: tValidation("submitError"),
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error submitting lead:", error);
      toast({
        title: tValidation("networkError"),
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrentInput = () => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.inputType) {
      return {
        type: lastMessage.inputType,
        placeholder: lastMessage.inputPlaceholder || "",
      };
    }
    return null;
  };

  const currentInput = getCurrentInput();

  const handleClose = () => {
    if (step !== "success") {
      trackWizardClose({ step, flow });
    }
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg p-0 bg-white flex flex-col"
      >
        {/* Header */}
        <SheetHeader className="p-4 border-b border-[#BEB09E]/20">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-sans text-sm uppercase tracking-widest">
              Sully Ruiz
            </SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence mode="popLayout">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] ${
                    message.type === "user"
                      ? "bg-black text-white"
                      : "bg-[#f4f1ec]"
                  } p-4`}
                >
                  <p className="body-md">{message.content}</p>

                  {/* Options */}
                  {message.options && step !== "success" && (
                    <div className="mt-4 space-y-2">
                      {message.options.map((option) => (
                        <Button
                          key={option.value}
                          variant="outline"
                          onClick={() =>
                            handleOptionSelect(option.value, option.label)
                          }
                          className="w-full justify-start font-serif text-base rounded-none border-[#BEB09E]/30 hover:border-[#BEB09E] hover:bg-[#BEB09E]/10 transition-all"
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-[#f4f1ec] p-4">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-[#BEB09E] rounded-full animate-bounce" />
                    <span
                      className="w-2 h-2 bg-[#BEB09E] rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <span
                      className="w-2 h-2 bg-[#BEB09E] rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Success state */}
            {step === "success" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 bg-[#BEB09E]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-8 h-8 text-[#BEB09E]" />
                </div>
                <h3 className="heading-md text-xl mb-2">{t("success.title")}</h3>
                <p className="body-md text-muted-foreground mb-6">
                  {t("success.message")}
                </p>
                <Button
                  onClick={onClose}
                  className="bg-black text-white hover:bg-[#BEB09E] font-sans text-sm uppercase tracking-widest px-8 py-5 rounded-none"
                >
                  {t("success.close")}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        {currentInput && step !== "success" && (
          <div className="p-4 border-t border-[#BEB09E]/20">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleInputSubmit();
              }}
              className="space-y-2"
            >
              <div className="flex gap-2">
                <Input
                  type={currentInput.type}
                  placeholder={currentInput.placeholder}
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    // Clear error when user starts typing
                    if (fieldError) {
                      setFieldError(null);
                    }
                  }}
                  aria-invalid={!!fieldError}
                  className={`flex-1 rounded-none border-[#BEB09E]/30 focus:border-[#BEB09E] h-12 font-serif text-base ${
                    fieldError ? "border-red-500 focus:border-red-500" : ""
                  }`}
                  disabled={isSubmitting}
                />
                <Button
                  type="submit"
                  disabled={isSubmitting || !inputValue.trim()}
                  className="bg-black text-white hover:bg-[#BEB09E] rounded-none h-12 px-4"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </Button>
              </div>
              {fieldError && (
                <p className="text-sm text-red-500 font-serif">{fieldError}</p>
              )}
            </form>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
