"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { useOrgStore } from "@/stores/org.store";
import { getMembersApi } from "@/lib/api/members.api";
import {
  getOrgTransactionsApi,
  getMyTransactionsApi,
} from "@/lib/api/transactions.api";
import { getOrgApi } from "@/lib/api/org.api";
import { Member, Transactions, Organization } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import MembersTable from "@/components/members/MembersTable";
import TransactionsList from "@/components/transactions/TransactionsList";
import InviteMemberDialog from "@/components/org/InviteMemberDialog";

type ActiveTab = "members" | "transactions";

export default function OrgPage() {
  const { orgId } = useParams<{ orgId: string }>();
  const { user } = useAuthStore();
  const { activeOrg } = useOrgStore();
  const isOwner = activeOrg?.role === "owner";

  const [org, setOrg] = useState<Organization | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [transactions, setTransactions] = useState<Transactions[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>("members");

  useEffect(() => {
    if (!orgId || !user) return;

    const txApi = isOwner ? getOrgTransactionsApi : getMyTransactionsApi;

    Promise.all([getOrgApi(orgId), getMembersApi(orgId), txApi(orgId)])
      .then(([orgRes, membersRes, txRes]) => {
        setOrg(orgRes.organization);
        setMembers(membersRes.members);
        setTransactions(txRes.transactions);
      })
      .finally(() => setLoading(false));
  }, [orgId, user, isOwner]);

  const handleMemberInvited = () => {
    getMembersApi(orgId).then((res) => setMembers(res.members));
  };

  const handleMemberRemoved = (memberId: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
  };

  const handleTransactionCreated = (tx: Transactions) => {
    setTransactions((prev) => [tx, ...prev]);
    getMembersApi(orgId).then((res) => setMembers(res.members));
  };

  if (loading) return <p className="text-muted-foreground">Cargando...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{org?.name}</h1>
            <Badge variant={isOwner ? "default" : "secondary"}>
              {isOwner ? "Owner" : "Miembro"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {org?.totalPointsIssued} puntos emitidos en total
          </p>
        </div>
        {isOwner && (
          <InviteMemberDialog orgId={orgId} onInvited={handleMemberInvited} />
        )}
      </div>

      <div className="flex gap-2 border-b pb-2">
        <Button
          variant={activeTab === "members" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("members")}
        >
          Miembros ({members.length})
        </Button>
        <Button
          variant={activeTab === "transactions" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("transactions")}
        >
          Transacciones ({transactions.length})
        </Button>
      </div>

      {activeTab === "members" && (
        <MembersTable
          members={members}
          orgId={orgId}
          isOwner={isOwner}
          currentUserId={user?.id || ""}
          onRemoved={handleMemberRemoved}
          onTransactionCreated={handleTransactionCreated}
        />
      )}

      {activeTab === "transactions" && (
        <TransactionsList
          transactions={transactions}
          currentUserId={user?.id || ""}
          members={members}
        />
      )}
    </div>
  );
}
