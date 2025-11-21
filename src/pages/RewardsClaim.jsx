// Rewards Claim Page (Cash & Airtime/Data)
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiChevronLeft, FiCheck } from "react-icons/fi";
import { getUserRewards, claimReward } from "../services/mockApi";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { bankDetailsSchema, airtimeClaimSchema } from "../utils/validators";
import {
  NIGERIAN_BANKS,
  BUNDLE_OPTIONS,
  REWARD_TYPES,
} from "../utils/constants";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const RewardsClaim = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useApp();

  const [activeTab, setActiveTab] = useState("cash");
  const [userRewards, setUserRewards] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");

  useEffect(() => {
    fetchUserRewards();
  }, []);

  const fetchUserRewards = async () => {
    try {
      setLoading(true);
      const response = await getUserRewards(user.id);
      setUserRewards(response);

      if (!response.eligible) {
        showToast("You are not eligible for rewards", "error");
        navigate("/leaderboard/rewards");
      }
    } catch (error) {
      console.error("Failed to fetch rewards:", error);
      showToast(error.message || "Failed to load rewards", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mobile-container min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[var(--t2-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--t2-text-secondary)]">Loading...</p>
        </div>
      </div>
    );
  }

  if (claimSuccess) {
    return (
      <ClaimSuccessScreen
        reference={referenceNumber}
        type={activeTab}
        onClose={() => navigate("/leaderboard")}
      />
    );
  }

  return (
    <div className="mobile-container min-h-screen pb-6">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[var(--t2-bg)] border-b border-[var(--t2-border)] px-6 py-4">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate("/leaderboard/rewards")}
            className="p-2 hover:bg-[var(--t2-surface)] rounded-lg transition-colors"
          >
            <FiChevronLeft className="text-2xl text-[var(--t2-text-primary)]" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[var(--t2-text-primary)]">
              Claim Reward
            </h1>
            <p className="text-sm text-[var(--t2-text-secondary)]">
              Choose how you want to get paid
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("cash")}
            className={`flex-1 py-3 font-semibold rounded-[var(--t2-radius-md)] transition-all ${
              activeTab === "cash"
                ? "bg-[var(--t2-primary)] text-[var(--t2-on-primary)]"
                : "bg-[var(--t2-surface)] text-[var(--t2-text-secondary)]"
            }`}
          >
            Cash
          </button>
          <button
            onClick={() => setActiveTab("airtime")}
            className={`flex-1 py-3 font-semibold rounded-[var(--t2-radius-md)] transition-all ${
              activeTab === "airtime"
                ? "bg-[var(--t2-primary)] text-[var(--t2-on-primary)]"
                : "bg-[var(--t2-surface)] text-[var(--t2-text-secondary)]"
            }`}
          >
            Airtime/Data
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {activeTab === "cash" ? (
          <CashClaimForm
            userRewards={userRewards}
            user={user}
            claiming={claiming}
            setClaiming={setClaiming}
            setClaimSuccess={setClaimSuccess}
            setReferenceNumber={setReferenceNumber}
          />
        ) : (
          <AirtimeClaimForm
            userRewards={userRewards}
            user={user}
            claiming={claiming}
            setClaiming={setClaiming}
            setClaimSuccess={setClaimSuccess}
            setReferenceNumber={setReferenceNumber}
          />
        )}
      </div>
    </div>
  );
};

// Cash Claim Form Component
const CashClaimForm = ({
  userRewards,
  user,
  claiming,
  setClaiming,
  setClaimSuccess,
  setReferenceNumber,
}) => {
  const { showToast } = useApp();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(bankDetailsSchema),
    defaultValues: {
      accountName: user.username || "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setClaiming(true);
      const response = await claimReward({
        userId: user.id,
        type: "cash",
        payload: data,
      });
      setReferenceNumber(response.reference);
      setClaimSuccess(true);
    } catch (error) {
      console.error("Failed to claim reward:", error);
      showToast(error.message || "Failed to claim reward", "error");
    } finally {
      setClaiming(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Reward Amount */}
      <div className="bg-[var(--t2-surface)] border-2 border-[var(--t2-primary)] rounded-[var(--t2-radius-md)] p-6 text-center">
        <p className="text-sm text-[var(--t2-text-secondary)] mb-2">
          Your Reward
        </p>
        <p className="text-4xl font-bold text-[var(--t2-primary)]">
          {userRewards?.reward?.display || "₦0"}
        </p>
      </div>

      {/* Account Name */}
      <Input
        label="Account Name"
        placeholder="John Doe"
        error={errors.accountName?.message}
        {...register("accountName")}
      />

      {/* Bank Selection */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-[var(--t2-text-primary)]">
          Bank
        </label>
        <select
          {...register("bankCode")}
          className="w-full px-4 py-3 bg-[var(--t2-surface)] border-2 border-[var(--t2-border)] rounded-[var(--t2-radius-md)] text-[var(--t2-text-primary)] focus:outline-none focus:border-[var(--t2-primary)] transition-colors"
        >
          <option value="">Select your bank</option>
          {NIGERIAN_BANKS.map((bank) => (
            <option key={bank.code} value={bank.code}>
              {bank.name}
            </option>
          ))}
        </select>
        {errors.bankCode && (
          <p className="text-sm text-[var(--t2-error)] flex items-center gap-1">
            <span>⚠️</span>
            <span>{errors.bankCode.message}</span>
          </p>
        )}
      </div>

      {/* Account Number */}
      <Input
        label="Account Number"
        placeholder="0123456789"
        type="tel"
        inputMode="numeric"
        maxLength={10}
        error={errors.accountNumber?.message}
        {...register("accountNumber")}
      />

      {/* Info Notice */}
      <div className="bg-[var(--t2-surface)] border border-[var(--t2-border)] rounded-[var(--t2-radius-md)] p-4">
        <p className="text-sm text-[var(--t2-text-secondary)]">
          ℹ️ Cash will be processed within <strong>24-72 hours</strong>
        </p>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        disabled={!isValid || claiming}
        loading={claiming}
      >
        Claim Cash
      </Button>
    </form>
  );
};

// Airtime/Data Claim Form Component
const AirtimeClaimForm = ({
  userRewards,
  user,
  claiming,
  setClaiming,
  setClaimSuccess,
  setReferenceNumber,
}) => {
  const { showToast } = useApp();
  const [selectedBundle, setSelectedBundle] = useState("");

  const {
    handleSubmit,
    formState: { isValid },
  } = useForm({
    resolver: zodResolver(airtimeClaimSchema),
  });

  const onSubmit = async () => {
    if (!selectedBundle) {
      showToast("Please select a bundle option", "error");
      return;
    }

    try {
      setClaiming(true);
      const response = await claimReward({
        userId: user.id,
        type: "airtime",
        payload: {
          msisdn: user.msisdn,
          bundleId: selectedBundle,
        },
      });
      setReferenceNumber(response.reference);
      setClaimSuccess(true);
    } catch (error) {
      console.error("Failed to claim reward:", error);
      showToast(error.message || "Failed to claim reward", "error");
    } finally {
      setClaiming(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Phone Number (Read-only) */}
      <Input
        label="Phone Number"
        value={user.msisdn || user.username}
        disabled
        prefix={<span className="font-semibold">+234</span>}
      />

      {/* Bundle Options */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-[var(--t2-text-primary)]">
          Select Bundle
        </label>
        <div className="space-y-2">
          {BUNDLE_OPTIONS.map((bundle) => (
            <button
              key={bundle.id}
              type="button"
              onClick={() => setSelectedBundle(bundle.id)}
              className={`w-full p-4 rounded-[var(--t2-radius-md)] border-2 transition-all text-left flex items-center justify-between ${
                selectedBundle === bundle.id
                  ? "border-[var(--t2-primary)] bg-[var(--t2-primary)]/10"
                  : "border-[var(--t2-border)] bg-[var(--t2-surface)] hover:border-[var(--t2-primary)]"
              }`}
            >
              <span className="font-semibold text-[var(--t2-text-primary)]">
                {bundle.label}
              </span>
              {selectedBundle === bundle.id && (
                <FiCheck className="text-xl text-[var(--t2-primary)]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Info Notice */}
      <div className="bg-[var(--t2-surface)] border border-[var(--t2-border)] rounded-[var(--t2-radius-md)] p-4">
        <p className="text-sm text-[var(--t2-text-secondary)]">
          ℹ️ Top-up will be delivered <strong>within minutes</strong>
        </p>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        disabled={!selectedBundle || claiming}
        loading={claiming}
      >
        Claim Airtime/Data
      </Button>
    </form>
  );
};

// Claim Success Screen
const ClaimSuccessScreen = ({ reference, type, onClose }) => {
  return (
    <div className="mobile-container min-h-screen flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-[var(--t2-success)]/20 flex items-center justify-center mx-auto mb-6">
          <FiCheck className="text-5xl text-[var(--t2-success)]" />
        </div>

        <h1 className="text-2xl font-bold text-[var(--t2-text-primary)] mb-3">
          Reward Claimed Successfully!
        </h1>

        <p className="text-[var(--t2-text-secondary)] mb-6">
          {type === "cash"
            ? "Your cash reward will be processed within 24-72 hours."
            : "Your airtime/data will be delivered within minutes."}
        </p>

        <div className="bg-[var(--t2-surface)] border border-[var(--t2-border)] rounded-[var(--t2-radius-md)] p-4 mb-8">
          <p className="text-sm text-[var(--t2-text-secondary)] mb-1">
            Reference Number
          </p>
          <p className="text-lg font-mono font-bold text-[var(--t2-primary)]">
            {reference}
          </p>
        </div>

        <Button onClick={onClose} variant="primary" size="lg" fullWidth>
          Back to Leaderboard
        </Button>
      </div>
    </div>
  );
};

export default RewardsClaim;
