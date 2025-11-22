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
      await sendOTP(normalizedPhone);

      // Navigate to OTP screen with phone number
      navigate("/otp", { state: { msisdn: normalizedPhone } });
    } catch (error) {
      console.error("Failed to send OTP:", error);
      setServerError(error.message || ERROR_MESSAGES.SERVER_ERROR);
    } finally {
      setIsSubmitting(false);
    }
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
    </div>
  );
};

export default MsisdnEntry;
