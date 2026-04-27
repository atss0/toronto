import api from './api';

export interface PremiumFeatures {
  ai_daily_limit: number | null;
  offline_download: boolean;
  advanced_filters: boolean;
}

export interface PremiumStatus {
  is_premium: boolean;
  premium_expires_at: string | null;
  features: PremiumFeatures;
}

export interface SubscribePayload {
  plan: 'monthly' | 'annual';
  provider: 'apple' | 'google' | 'stripe';
  receipt?: string;
  provider_sub_id?: string;
}

export interface SubscribeResult {
  is_premium: boolean;
  premium_expires_at: string | null;
  plan: string;
}

const premiumService = {
  getStatus: () =>
    api.get<{ success: boolean; data: PremiumStatus }>('/premium/status'),

  subscribe: (payload: SubscribePayload) =>
    api.post<{ success: boolean; data: SubscribeResult }>('/premium/subscribe', payload),
};

export default premiumService;
