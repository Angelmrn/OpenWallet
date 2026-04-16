export interface User {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  createdAt: string;
}

export interface Organization {
  id: string;
  name: string;
  ownerId: string;
  totalPointsIssued: number;
  createdAt: string;
}

export interface Member {
  id: string;
  userId: string;
  organizationId: string;
  role: "owner" | "member";
  pointsBalance: number;
  inviteEmail: string;
  inviteStatus: "pending" | "accepted" | "expired";
  joinedAt: string;
  user?: Pick<User, "id" | "name" | "email">;
}

export interface Transactions {
  id: string;
  oroganizationId: string;
  fromMemberId: string | null;
  toMemberId: string;
  amount: number;
  type: "reward" | "transfer";
  message: string | null;
  createdAt: string;
  fromMember?: Pick<Member, "id"> & { user: Pick<User, "id" | "name"> };
  toMember?: Pick<Member, "id"> & { user: Pick<User, "id" | "name"> };
}

export interface Invitation {
  token: string;
  email: string;
}
