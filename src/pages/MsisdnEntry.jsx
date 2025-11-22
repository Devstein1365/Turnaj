// MSISDN Entry Page - Phone Number Authentication
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { msisdnSchema, normalizeNigerianPhone } from "../utils/validators";
import { sendOTP } from "../services/mockApi";
import {
  ERROR_MESSAGES,
  NIGERIA_COUNTRY_CODE,
  PLACEHOLDERS,
} from "../utils/constants";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Logo from "../components/ui/Logo";

const MsisdnEntry = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(msisdnSchema),
    mode: "onChange",
  });

  // Quick Test Function - Remove in production
  const handleQuickTest = () => {
    setValue("msisdn", "8012345678", { shouldValidate: true });
  };

  // Skip to Leagues - Remove in production
  const skipToLeagues = () => {
    // Mock login with test user
    localStorage.setItem("turnaj_auth_token", "test_token_123");
    localStorage.setItem(
      "turnaj_user_data",
      JSON.stringify({
        id: "test_user_1",
        msisdn: "+2348012345678",
        username: "TestUser",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=test",
      })
    );
    navigate("/leagues");
  };

  const phoneValue = watch("msisdn");

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setServerError("");

    try {
      const normalizedPhone = normalizeNigerianPhone(data.msisdn);
      const response = await sendOTP(normalizedPhone);

      // FOR TESTING: Show OTP in modal for mobile users
      if (response.otpCode) {
        setOtpCode(response.otpCode);
        setPhoneNumber(normalizedPhone);
        setShowOtpModal(true);
      } else {
        // Navigate to OTP screen with phone number
        navigate("/otp", { state: { msisdn: normalizedPhone } });
      }
    } catch (error) {
      console.error("Failed to send OTP:", error);
      setServerError(error.message || ERROR_MESSAGES.SERVER_ERROR);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinueToOtp = () => {
    setShowOtpModal(false);
    navigate("/otp", { state: { msisdn: phoneNumber } });
  };

  return (
    <div className="mobile-container min-h-screen flex flex-col p-6">
      {/* Logo */}
      <div className="flex justify-center pt-12 pb-8">
        <Logo size="lg" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--t2-text-primary)] mb-3">
            Enter your phone number
          </h1>
          <p className="text-[var(--t2-text-secondary)]">
            We need to verify your account.
          </p>
        </div>

        {/* TEST MODE - Remove in production */}
        <div className="mb-6 p-4 bg-[var(--t2-warning)]/10 border border-[var(--t2-warning)] rounded-[var(--t2-radius-md)]">
          <p className="text-xs font-semibold text-[var(--t2-warning)] mb-3 text-center">
            🧪 TEST MODE - Quick Access
          </p>
          <div className="flex gap-2">
            <Button
              onClick={handleQuickTest}
              variant="secondary"
              size="sm"
              fullWidth
              type="button"
            >
              Fill Test Number
            </Button>
            <Button
              onClick={skipToLeagues}
              variant="primary"
              size="sm"
              fullWidth
              type="button"
            >
              Skip to App →
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Phone Number Input */}
          <Input
            label="Phone number"
            prefix={
              <span className="font-semibold">{NIGERIA_COUNTRY_CODE}</span>
            }
            placeholder={PLACEHOLDERS.PHONE}
            type="tel"
            inputMode="numeric"
            maxLength={10}
            error={errors.msisdn?.message}
            {...register("msisdn")}
          />

          {/* Server Error */}
          {serverError && (
            <div className="p-4 rounded-[var(--t2-radius-md)] bg-[var(--t2-error)]/10 border border-[var(--t2-error)]">
              <p className="text-sm text-[var(--t2-error)] flex items-center gap-2">
                <span>⚠️</span>
                <span>{serverError}</span>
              </p>
            </div>
          )}

          {/* Continue Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={!isValid || isSubmitting}
            loading={isSubmitting}
          >
            Continue
          </Button>

          {/* Support Link */}
          <div className="text-center">
            <a
              href="#support"
              className="text-sm text-[var(--t2-primary)] hover:underline"
            >
              Having trouble? Contact support.
            </a>
          </div>
        </form>
      </div>

      {/* Terms and Privacy */}
      <div className="text-center text-xs text-[var(--t2-text-tertiary)] mt-8">
        By continuing, you agree to our{" "}
        <a href="#terms" className="text-[var(--t2-primary)] hover:underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#privacy" className="text-[var(--t2-primary)] hover:underline">
          Privacy Policy
        </a>
        .
      </div>

      {/* OTP Code Modal - FOR TESTING ONLY */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50">
          <div className="bg-[var(--t2-surface)] rounded-[var(--t2-radius-lg)] p-6 max-w-sm w-full border-2 border-[var(--t2-primary)] animate-fade-in">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[var(--t2-primary)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📱</span>
              </div>
              <h2 className="text-xl font-bold text-[var(--t2-text-primary)] mb-2">
                Your OTP Code
              </h2>
              <p className="text-sm text-[var(--t2-text-secondary)]">
                Copy this code to verify your number
              </p>
            </div>

            <div className="bg-[var(--t2-bg)] rounded-[var(--t2-radius-md)] p-4 mb-6">
              <p className="text-3xl font-mono font-bold text-[var(--t2-primary)] text-center tracking-widest">
                {otpCode}
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleContinueToOtp}
                variant="primary"
                size="lg"
                fullWidth
              >
                Continue to Verification
              </Button>
              <p className="text-xs text-center text-[var(--t2-text-tertiary)]">
                ⚠️ TEST MODE: In production, this code will be sent via SMS
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MsisdnEntry;
