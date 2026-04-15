"use client";
import { Member } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import RewardDialog from "@/components/transactions/RewardDialog";
import TransferDialog from "@/components/transactions/TransferDialog";
import RemoveMemberDialog from "./DeleteMemberDialog";

interface MembersTableProps {
  members: Member[];
  orgId: string;
  isOwner: boolean;
  currentUserId: string;
  onRemoved: (memberId: string) => void;
  onTransactionCreated: () => void;
}

export default function MembersTable({
  members,
  orgId,
  isOwner,
  currentUserId,
  onRemoved,
  onTransactionCreated,
}: MembersTableProps) {
  const currentMember = members.find((m) => m.userId === currentUserId);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Email</TableHead>
          <TableHead> Rol</TableHead>
          <TableHead>Balance</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => {
          const isCurrentUser = member.userId === currentUserId;
          const isTarget = !isCurrentUser && member.inviteStatus === "accepted";

          return (
            <TableRow key={member.id}>
              <TableCell>{member.user?.name ?? "—"}</TableCell>
              <TableCell className="text-muted-foreground">
                {member.inviteEmail}
              </TableCell>
              <TableCell>
                <Badge
                  variant={member.role === "owner" ? "default" : "secondary"}
                >
                  {member.role}
                </Badge>
              </TableCell>
              <TableCell>{member.pointsBalance} pts</TableCell>

              <TableCell className="text-right space-x-2">
                {isOwner && isTarget && (
                  <RewardDialog
                    orgId={orgId}
                    member={member}
                    onRewarded={onTransactionCreated}
                  />
                )}
                {!isOwner && isTarget && currentMember && (
                  <TransferDialog
                    orgId={orgId}
                    member={member}
                    currentMember={currentMember}
                    onTransferred={onTransactionCreated}
                  />
                )}
                {isOwner && !isCurrentUser && (
                  <RemoveMemberDialog
                    member={member}
                    orgId={orgId}
                    onRemoved={onRemoved}
                  />
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
