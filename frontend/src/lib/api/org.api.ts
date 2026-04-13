import { fetcher } from "@/lib/fetcher";
import { Organization } from "@/types";

export const createOrgApi = (name: string) =>
  fetcher<{ organization: Organization }>("/organizations/create", {
    method: "POST",
    body: JSON.stringify({ name }),
  });

export const getMyOrgApi = () =>
  fetcher<{ organizations: Organization[] }>("/organizations/my");

export const getInviteOrgInfoApi = (token: string) =>
  fetcher<{ organization: Organization; email: string }>(
    `/organizations/invite/${token}`,
  );

export const acceptInviteOrgApi = (token: string) =>
  fetcher<{ message: string }>(`/organizations/invite/${token}/accept`, {
    method: "POST",
  });

export const getOrgApi = (orgId: string) =>
  fetcher<{ organizations: Organization }>(`/organizations/${orgId}`);

export const deleteOrgApi = (orgId: string) =>
  fetcher<{ message: string }>(`/organizations/${orgId}`, {
    method: "DELETE",
  });

export const inviteMemberOrgApi = (orgId: string, email: string) =>
  fetcher<{ message: string }>(`/organizations/${orgId}/invite`, {
    method: "POST",
    body: JSON.stringify({ email }),
  });
