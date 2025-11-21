// OTP Verification Page
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { verifyOTP, sendOTP } from "../services/mockApi";
import { useAuth } from "../context/AuthContext";
import {
  OTP_RESEND_COOLDOWN,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from "../utils/constants";
import { maskPhoneNumber } from "../utils/validators";
import Button from "../components/ui/Button";
import OtpInput from "../components/ui/OtpInput";

const OtpVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const msisdn = location.state?.msisdn;

  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(OTP_RESEND_COOLDOWN);
  const [canResend, setCanResend] = useState(false);

  // Redirect if no phone number
  useEffect(() => {
    if (!msisdn) {
      navigate("/", { replace: true });
    }
  }, [msisdn, navigate]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendCooldown]);

  const handleOtpChange = (value) => {
    setOtp(value);
    setError(""); // Clear error when user types
  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await verifyOTP(msisdn, otp);

      // Save auth token and user data
      login(response.token, response.user);

      // Navigate to leagues page
      navigate("/leagues", { replace: true });
    } catch (err) {
      console.error("OTP verification failed:", err);
      setError(err.message || ERROR_MESSAGES.INVALID_OTP);
      setOtp(""); // Clear OTP on error
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    try {
      await sendOTP(msisdn);
      setResendCooldown(OTP_RESEND_COOLDOWN);
      setCanResend(false);
      setError("");
      setOtp("");
      // Could show a success toast here
    } catch (err) {
      console.error("Failed to resend OTP:", err);
      setError(err.message || ERROR_MESSAGES.SERVER_ERROR);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!msisdn) return null;

  return (
    <div className="mobile-container min-h-screen flex flex-col p-6">
      {/* Content */}
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--t2-text-primary)] mb-3">
            Enter the code
          </h1>
          <p className="text-[var(--t2-text-secondary)]">
            Sent to {maskPhoneNumber(msisdn)}
          </p>
        </div>

        {/* OTP Input */}
        <div className="mb-8">
          <OtpInput
            value={otp}
            onChange={handleOtpChange}
            onComplete={handleVerify}
            error={error}
            disabled={isSubmitting}
          />
        </div>

        {/* Verify Button */}
        <Button
          onClick={handleVerify}
          variant="primary"
          size="lg"
          fullWidth
          disabled={otp.length !== 6 || isSubmitting}
          loading={isSubmitting}
          className="mb-4"
        >
          Verify
        </Button>

        {/* Resend OTP Button */}
        <Button
          onClick={handleResend}
          variant="secondary"
          size="lg"
          fullWidth
          disabled={!canResend}
          className="mb-6"
        >
          {canResend
            ? "Resend OTP"
            : `Resend OTP in ${formatTime(resendCooldown)}`}
        </Button>

        {/* Change Number Link */}
        <div className="text-center">
          <Link
            to="/"
            className="text-sm text-[var(--t2-primary)] hover:underline"
          >
            Change number?
          </Link>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center text-xs text-[var(--t2-text-tertiary)] mt-8">
        Check your SMS for the 6-digit verification code
      </div>
    </div>
  );
};

export default OtpVerification;
