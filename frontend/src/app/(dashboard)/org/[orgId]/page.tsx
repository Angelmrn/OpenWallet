"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { useOrgStore } from "@/stores/org.store";
import { getMembersApi } from "@/lib/api/members.api";
import {
  getOrgTransactionsApi,
  getMyTransactionsApi,
} from "@/lib/api/transactions.api";
import { getOrgApi, getPendingInviteApi } from "@/lib/api/org.api";
import { Member, Transactions, Organization, Invitation } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import MembersTable from "@/components/members/MembersTable";
import TransactionsList from "@/components/transactions/TransactionsList";
import InviteMemberDialog from "@/components/org/InviteMemberDialog";
import InviteStatusDialog from "@/components/org/InviteStatusDialog";
import { Users, ArrowLeftRight } from "lucide-react";
import RemoveOrgDialog from "@/components/org/DeleteOrgDialog";
import { toast } from "sonner";
type ActiveTab = "members" | "transactions";

export default function OrgPage() {
  const { orgId } = useParams<{ orgId: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const { activeOrg } = useOrgStore();
  const isOwner = activeOrg?.role === "owner";

  const [org, setOrg] = useState<Organization | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [transactions, setTransactions] = useState<Transactions[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>("members");
  const [invitations, setInvitations] = useState<Invitation[]>([]);

  const fetchInvitations = async () => {
    try {
      const data = await getPendingInviteApi(orgId);
      setInvitations(data.invitations);
    } catch (error) {
      console.error("Error al cargar Invitaciones", error);
    }
  };
  useEffect(() => {
    if (!orgId || !user) return;
    if (isOwner) fetchInvitations();
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

  const handleOrgRemoved = () => {
    toast.success("Organizacion eliminada Correctamente.");
    router.push("/dashboard");
  };

  const handleTransactionCreated = async () => {
    const txApi = isOwner ? getOrgTransactionsApi : getMyTransactionsApi;
    const [txRes, membersRes] = await Promise.all([
      txApi(orgId),
      getMembersApi(orgId),
    ]);
    setTransactions(txRes.transactions);
    setMembers(membersRes.members);
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
          <div className="flex items-center gap-2">
            <InviteMemberDialog
              orgId={orgId}
              onInvited={() => {
                handleMemberInvited();
                fetchInvitations();
              }}
            />
            <InviteStatusDialog invitations={invitations} />
            <RemoveOrgDialog
              orgId={orgId}
              orgName={org?.name}
              onRemoved={handleOrgRemoved}
            />
          </div>
        )}
      </div>

      <div className="flex gap-2 border-b pb-2">
        <Button
          variant={activeTab === "members" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("members")}
        >
          <div className="flex items-center gap-2">
            <Users /> <span>Miembros ({members.length})</span>
          </div>
        </Button>
        <Button
          variant={activeTab === "transactions" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("transactions")}
        >
          <div className="flex items-center gap-2">
            <ArrowLeftRight />
            <span>Transacciones ({transactions.length})</span>
          </div>
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
