"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const toastVariants = cva(
  "pointer-events-auto relative flex w-full items-center justify-between gap-4 overflow-hidden p-4 shadow-lg transition-all",
  {
    variants: {
      variant: {
        default: "bg-white border border-[#BEB09E]/20",
        success: "bg-white border-l-4 border-l-green-500 border border-[#BEB09E]/20",
        error: "bg-white border-l-4 border-l-red-500 border border-[#BEB09E]/20",
        info: "bg-white border-l-4 border-l-[#BEB09E] border border-[#BEB09E]/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface ToastProps extends VariantProps<typeof toastVariants> {
  id: string;
  title?: string;
  description?: string;
  onClose?: (id: string) => void;
}

const iconMap = {
  default: null,
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const iconColorMap = {
  default: "",
  success: "text-green-500",
  error: "text-red-500",
  info: "text-[#BEB09E]",
};

export function Toast({
  id,
  title,
  description,
  variant = "default",
  onClose,
}: ToastProps) {
  const Icon = iconMap[variant || "default"];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={cn(toastVariants({ variant }))}
    >
      <div className="flex items-start gap-3">
        {Icon && (
          <Icon className={cn("h-5 w-5 flex-shrink-0", iconColorMap[variant || "default"])} />
        )}
        <div className="flex flex-col gap-1">
          {title && (
            <p className="font-sans text-sm font-medium text-black">{title}</p>
          )}
          {description && (
            <p className="font-serif text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {onClose && (
        <button
          onClick={() => onClose(id)}
          className="flex-shrink-0 p-1 hover:bg-[#BEB09E]/10 rounded transition-colors"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      )}
    </motion.div>
  );
}

export interface ToastContainerProps {
  toasts: ToastProps[];
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={onClose} />
        ))}
      </AnimatePresence>
    </div>
  );
}
