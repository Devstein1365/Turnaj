import React, { useRef, useState, useEffect } from "react";
import { OTP_LENGTH } from "../../utils/constants";

const OtpInput = ({
  value = "",
  onChange,
  onComplete,
  error,
  disabled = false,
}) => {
  const [otp, setOtp] = useState(value.split(""));
  const inputRefs = useRef([]);

  useEffect(() => {
    setOtp(value.split("").slice(0, OTP_LENGTH));
  }, [value]);

  useEffect(() => {
    // Focus first empty input on mount
    const firstEmptyIndex = otp.findIndex((digit) => !digit);
    if (firstEmptyIndex !== -1 && inputRefs.current[firstEmptyIndex]) {
      inputRefs.current[firstEmptyIndex].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    if (disabled) return;

    // Allow only digits
    const digit = value.replace(/[^\d]/g, "");

    if (digit.length > 1) {
      // Handle paste
      handlePaste(digit, index);
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    const otpString = newOtp.join("");
    onChange(otpString);

    // Auto-advance to next input
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Trigger onComplete when all digits filled
    if (newOtp.every((d) => d) && onComplete) {
      onComplete(otpString);
    }
  };

  const handleKeyDown = (index, e) => {
    if (disabled) return;

    // Handle backspace
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // Move to previous input if current is empty
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
        onChange(newOtp.join(""));
      }
    }

    // Handle arrow keys
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (pastedData, startIndex) => {
    const digits = pastedData.replace(/[^\d]/g, "").slice(0, OTP_LENGTH);
    const newOtp = [...otp];

    digits.split("").forEach((digit, i) => {
      if (startIndex + i < OTP_LENGTH) {
        newOtp[startIndex + i] = digit;
      }
    });

    setOtp(newOtp);
    onChange(newOtp.join(""));

    // Focus last filled input or next empty
    const lastFilledIndex = Math.min(
      startIndex + digits.length - 1,
      OTP_LENGTH - 1
    );
    inputRefs.current[lastFilledIndex]?.focus();

    // Trigger onComplete if all filled
    if (newOtp.every((d) => d) && onComplete) {
      onComplete(newOtp.join(""));
    }
  };

  const handleFocus = (index) => {
    // Select text on focus for easier replacement
    inputRefs.current[index]?.select();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center gap-2 md:gap-3">
        {Array.from({ length: OTP_LENGTH }).map((_, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={1}
            value={otp[index] || ""}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onFocus={() => handleFocus(index)}
            disabled={disabled}
            className={`
              w-12 h-14 md:w-14 md:h-16
              text-center text-2xl font-bold
              bg-[var(--t2-surface)]
              border-2
              ${
                error ? "border-[var(--t2-error)]" : "border-[var(--t2-border)]"
              }
              rounded-[var(--t2-radius-md)]
              text-[var(--t2-text-primary)]
              focus:outline-none
              focus:border-[var(--t2-primary)]
              disabled:opacity-50
              disabled:cursor-not-allowed
              transition-colors
            `}
          />
        ))}
      </div>

      {error && (
        <p className="text-sm text-[var(--t2-error)] text-center flex items-center justify-center gap-1">
          <span>⚠️</span>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

export default OtpInput;
