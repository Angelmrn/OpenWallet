import { fetcher } from "@/lib/fetcher";
import { Transactions } from "@/types";

export const getOrgTransactionsApi = (orgId: string) =>
  fetcher<{ transactions: Transactions[] }>(`/transactions/${orgId}`);

export const getMyTransactionsApi = (orgId: string) =>
  fetcher<{ transactions: Transactions[] }>(`/transactions/${orgId}/me`);

export const rewardMemberApi = (
  orgId: string,
  memberId: string,
  amount: number,
  message?: string,
) =>
  fetcher<{ transactions: Transactions }>(
    `/transactions/${orgId}/reward/${memberId}`,
    {
      method: "POST",
      body: JSON.stringify({ amount, message }),
    },
  );

export const transferPointsApi = (
  orgId: string,
  memberId: string,
  amount: number,
  message: string,
) =>
  fetcher<{ transactions: Transactions }>(
    `/transactions/${orgId}/transfer/${memberId}`,
    {
      method: "POST",
      body: JSON.stringify({ amount, message }),
    },
  );
