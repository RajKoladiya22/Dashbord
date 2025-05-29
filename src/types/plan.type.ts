export interface Plan {
  id: string;
  name: string;
  duration: string;
  price: number;
  offers?: {
    offerType: "percentage" | "fixed" | "free_trial";
    value?: number;
    startsAt?: string;
    endsAt?: string;
  }[];
  specs?: {
    specName: string;
    specValue: string;
  }[];
  descriptions?: { content: string }[];
  subscriptions?: any[];
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PlanResponse {
  status?: number;
  success?: boolean;
  message?: string;
  data: {
    plan: Plan | Plan[];
  };
}
export interface PlanResponse2 {
  status?: number;
  success?: boolean;
  message?: string;
  data: {
    plans: Plan | Plan[];
  };
}

export interface PlanState {
  plans: Plan[];
  loading: boolean;
  error: string | null;
}
