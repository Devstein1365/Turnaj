// Validators using Zod for Turnaj × T2

import { z } from "zod";
import {
  NIGERIA_PHONE_REGEX,
  NIGERIA_COUNTRY_CODE,
  OTP_LENGTH,
  ERROR_MESSAGES,
} from "./constants";

// ============================================================================
// PHONE NUMBER VALIDATION
// ============================================================================

/**
 * Normalizes Nigerian phone number to international format
 * @param {string} phone - Phone number in any format
 * @returns {string} - Normalized phone number (+234XXXXXXXXXX)
 */
export const normalizeNigerianPhone = (phone) => {
  if (!phone) return "";

  // Remove all spaces, dashes, and parentheses
  let cleaned = phone.replace(/[\s\-()]/g, "");

  // If starts with +234, already normalized
  if (cleaned.startsWith("+234")) {
    return cleaned;
  }

  // If starts with 234, add +
  if (cleaned.startsWith("234")) {
    return `+${cleaned}`;
  }

  // If starts with 0, replace with +234
  if (cleaned.startsWith("0")) {
    return `${NIGERIA_COUNTRY_CODE}${cleaned.substring(1)}`;
  }

  // Otherwise, assume it's missing country code
  return `${NIGERIA_COUNTRY_CODE}${cleaned}`;
};

/**
 * Validates Nigerian phone number format
 */
export const msisdnSchema = z
  .string()
  .min(1, ERROR_MESSAGES.INVALID_PHONE)
  .refine(
    (phone) => {
      const cleaned = phone.replace(/[\s\-()]/g, "");
      return NIGERIA_PHONE_REGEX.test(cleaned);
    },
    {
      message: ERROR_MESSAGES.INVALID_PHONE,
    }
  )
  .transform(normalizeNigerianPhone);

// ============================================================================
// OTP VALIDATION
// ============================================================================

export const otpSchema = z
  .string()
  .length(OTP_LENGTH, `Code must be ${OTP_LENGTH} digits`)
  .regex(/^\d+$/, "Code must contain only numbers");

// ============================================================================
// BANK DETAILS VALIDATION
// ============================================================================

export const bankDetailsSchema = z.object({
  accountName: z.string().min(3, "Account name is required"),
  bankCode: z.string().min(1, "Please select a bank"),
  accountNumber: z
    .string()
    .length(10, "Account number must be 10 digits")
    .regex(/^\d+$/, "Account number must contain only numbers"),
});

// ============================================================================
// AIRTIME/DATA CLAIM VALIDATION
// ============================================================================

export const airtimeClaimSchema = z.object({
  msisdn: msisdnSchema,
  bundleId: z.string().min(1, "Please select a bundle option"),
});

// ============================================================================
// TEAM VALIDATION
// ============================================================================

export const teamSchema = z.object({
  leagueId: z.string().min(1, "League ID is required"),
  players: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        position: z.enum(["GK", "DEF", "MID", "FWD"]),
        price: z.number(),
        club: z.string(),
      })
    )
    .length(11, ERROR_MESSAGES.TEAM_SIZE_ERROR),
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Formats phone number for display
 * @param {string} phone - Phone number
 * @returns {string} - Formatted phone number (+234 XXX XXX XXXX)
 */
export const formatPhoneForDisplay = (phone) => {
  const normalized = normalizeNigerianPhone(phone);

  // Remove +234 prefix
  const digits = normalized.replace("+234", "");

  // Format as XXX XXX XXXX
  if (digits.length === 10) {
    return `+234 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(
      6
    )}`;
  }

  return normalized;
};

/**
 * Masks phone number for display
 * @param {string} phone - Phone number
 * @returns {string} - Masked phone number (+234 XXX XXX XXXX)
 */
export const maskPhoneNumber = (phone) => {
  const formatted = formatPhoneForDisplay(phone);
  const parts = formatted.split(" ");

  if (parts.length === 4) {
    return `${parts[0]} ${parts[1]} XXX ${parts[3]}`;
  }

  return formatted;
};

/**
 * Validates Nigerian account number checksum (basic validation)
 * Note: Full validation requires API call to verify with bank
 */
export const validateAccountNumber = (accountNumber) => {
  return /^\d{10}$/.test(accountNumber);
};

/**
 * Format currency in Naira
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format price for fantasy display (in millions)
 */
export const formatPrice = (price) => {
  return `£${(price / 1_000_000).toFixed(1)}M`;
};

// Export all schemas and helpers
export default {
  msisdnSchema,
  otpSchema,
  bankDetailsSchema,
  airtimeClaimSchema,
  teamSchema,
  normalizeNigerianPhone,
  formatPhoneForDisplay,
  maskPhoneNumber,
  validateAccountNumber,
  formatCurrency,
  formatPrice,
};
