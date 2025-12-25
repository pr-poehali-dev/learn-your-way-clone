import { useState, useEffect } from 'react';

const API_URL = 'https://functions.poehali.dev/c2e6dce3-52e5-4905-84d1-d87e1d6d88c9';

interface Subscription {
  id: number;
  student_id: number;
  status: string;
  trial_ends_at: string;
  subscription_ends_at: string | null;
  promocode_used: string | null;
  created_at: string;
  updated_at: string;
}

interface SubscriptionStatus {
  subscription: Subscription | null;
  has_access: boolean;
  trial_days_left: number;
  loading: boolean;
  error: string | null;
}

export const useSubscription = (studentId: number | null): SubscriptionStatus & { refresh: () => void } => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [trialDaysLeft, setTrialDaysLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = async () => {
    if (!studentId) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/subscription/status?student_id=${studentId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        setSubscription(data.subscription);
        setHasAccess(data.has_access);
        setTrialDaysLeft(data.trial_days_left);
        setError(null);
      } else {
        setError('Failed to fetch subscription');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, [studentId]);

  return {
    subscription,
    has_access: hasAccess,
    trial_days_left: trialDaysLeft,
    loading,
    error,
    refresh: fetchSubscription
  };
};
