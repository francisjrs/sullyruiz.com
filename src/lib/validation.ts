// Email validation: RFC 5322 simplified
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// US Phone: (512) 555-1234, 512-555-1234, 5125551234, +1 formats
const US_PHONE_REGEX =
  /^(?:\+1\s?)?(?:\([0-9]{3}\)|[0-9]{3})[\s.\-]?[0-9]{3}[\s.\-]?[0-9]{4}$/;

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateEmail(email: string): ValidationResult {
  if (!email || !email.trim()) {
    return { valid: false, error: "validation.email.required" };
  }
  if (!EMAIL_REGEX.test(email.trim())) {
    return { valid: false, error: "validation.email.invalid" };
  }
  return { valid: true };
}

export function validatePhone(phone: string): ValidationResult {
  // Phone is optional - empty is valid
  if (!phone || !phone.trim()) {
    return { valid: true };
  }
  if (!US_PHONE_REGEX.test(phone.trim())) {
    return { valid: false, error: "validation.phone.invalid" };
  }
  return { valid: true };
}

export function validateName(name: string): ValidationResult {
  if (!name || !name.trim()) {
    return { valid: false, error: "validation.name.required" };
  }
  if (name.trim().length < 2) {
    return { valid: false, error: "validation.name.tooShort" };
  }
  return { valid: true };
}

export function normalizePhone(phone: string): string {
  // Extract digits only
  return phone.replace(/\D/g, "");
}

export interface LeadContact {
  name?: string;
  firstName?: string;
  email: string;
  phone?: string;
}

export interface LeadValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export function validateLeadPayload(
  contact: LeadContact,
  type: "lead_magnet" | "chat_wizard"
): LeadValidationResult {
  const errors: Record<string, string> = {};

  // Validate email (required for both types)
  const emailResult = validateEmail(contact.email);
  if (!emailResult.valid && emailResult.error) {
    errors.email = emailResult.error;
  }

  if (type === "lead_magnet") {
    // Validate firstName (required for lead_magnet)
    const nameResult = validateName(contact.firstName || "");
    if (!nameResult.valid && nameResult.error) {
      errors.firstName = nameResult.error;
    }
  } else if (type === "chat_wizard") {
    // Validate name (required for chat_wizard)
    const nameResult = validateName(contact.name || "");
    if (!nameResult.valid && nameResult.error) {
      errors.name = nameResult.error;
    }

    // Validate phone (optional but must be valid format if provided)
    const phoneResult = validatePhone(contact.phone || "");
    if (!phoneResult.valid && phoneResult.error) {
      errors.phone = phoneResult.error;
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
