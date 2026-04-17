import { fetcher } from "@/lib/fetcher";
import { Member } from "@/types";

export const getMembersApi = (orgId: string) =>
  fetcher<{ members: Member[] }>(`/members/${orgId}`);

export const updateMemberApi = (
  orgId: string,
  memberId: string,
  role: "owner" | "member",
) =>
  fetcher<{ member: Member }>(`/members/${orgId}/${memberId}`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });

export const deleteMemberApi = (orgId: string, memberId: string) =>
  fetcher<{ message: string }>(`/members/${orgId}/${memberId}`, {
    method: "DELETE",
  });

export const getMemberBalanceApi = (orgId: string, memberId: string) =>
  fetcher<{ balance: number; name: string }>(
    `/members/${orgId}/${memberId}/balance`,
  );
