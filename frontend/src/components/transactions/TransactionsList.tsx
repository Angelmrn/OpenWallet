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
    return (
      <p className="text-muted-foreground text-sm">
        No hay transacciones todavía
      </p>
    );
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
                  {isReward ? "Recompensa" : "Transferencia"}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {isReward
                    ? `de ${tx.fromMember?.user?.name ?? "Owner"}`
                    : isIncoming
                      ? `de ${tx.fromMember?.user?.name}`
                      : `a ${tx.toMember?.user?.name}`}
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
