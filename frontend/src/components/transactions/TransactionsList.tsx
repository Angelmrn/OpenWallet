import { Transactions, Member } from "@/types";
import { Badge } from "@/components/ui/badge";

interface TransactionsListProps {
  transactions: Transactions[];
  currentUserId: string;
  members: Member[];
}

export default function TransactionsList({
  transactions,
  currentUserId,
}: TransactionsListProps) {
  if (transactions.length === 0) {
    return <p className="text-muted-foreground text-sm">No transactions yet</p>;
  }

  return (
    <div className="space-y-3">
      {transactions.map((tx) => {
        const isIncoming = tx.toMember?.user?.id === currentUserId;
        const isReward = tx.type === "reward";

        return (
          <div
            key={tx.id}
            className="flex items-center justify-between border rounded-lg p-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant={isReward ? "default" : "secondary"}>
                  {isReward ? "Reward" : "Transfer"}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {isReward
                    ? `${tx.toMember?.user?.name} Received a Reward `
                    : isIncoming
                      ? `${tx.fromMember?.user?.name} transferred to ${tx.toMember?.user?.name}`
                      : `${tx.fromMember?.user?.name} transferred to ${tx.toMember?.user?.name ? tx.toMember.user.name : "Owner"}`}
                </span>
              </div>
              {tx.message && (
                <p className="text-sm text-muted-foreground ">"{tx.message}"</p>
              )}
              <p className="text-xs text-muted-foreground">
                {new Date(tx.createdAt).toLocaleDateString("es-MX", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <span
              className={`text-lg font-bold ${isIncoming ? "text-green-500" : "text-red-500"}`}
            >
              {isIncoming ? "+" : "-"}
              {tx.amount} pts
            </span>
          </div>
        );
      })}
    </div>
  );
}
