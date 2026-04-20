const feedItems = [
  {
    initials: "LB",
    color: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
    name: "Leonardo Borrayo",
    action: "received a reward",
    detail: "To complete the design sprint",
    amount: "+200 pts",
    amountColor: "text-blue-600 dark:text-blue-400",
    time: "5 min ago",
    line: true,
  },
  {
    initials: "LT",
    color: "bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200",
    name: "Lucas Tovar",
    action: "transfer points",
    detail: 'To Angel Moran · "Thanks for the support"',
    amount: "150 pts",
    amountColor: "text-green-600 dark:text-green-400",
    time: "1h ago",
    line: true,
  },
  {
    initials: "AM",
    color: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
    name: "Angel Moran",
    action: "joined the team",
    detail: "He accepted the invitation from Startup Crew",
    amount: null,
    amountColor: "",
    time: "ayer",
    line: false,
  },
];
const stats = [
  {
    label: "Organizations",
    value: "24",
    delta: "+3 this month",
    accent: false,
  },
  {
    label: "Active members",
    value: "186",
    delta: "+12 this month",
    accent: false,
  },
  {
    label: "Points issued",
    value: "48k",
    delta: "+8k this month",
    accent: true,
  },
  {
    label: "Transactions",
    value: "1.2k",
    delta: "+89 This week",
    accent: false,
  },
];
export function InviteFlowCard() {
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl border border-border bg-background p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#185FA5"
              strokeWidth="2"
            >
              <path d="M20 12V22H4V12" />
              <path d="M22 7H2v5h20V7z" />
              <path d="M12 22V7" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-medium text-foreground leading-none">
              Open Wallet
            </p>
            <p className="text-xs text-muted-foreground">
              no-reply@openwallet.app
            </p>
          </div>
        </div>
        <p className="text-sm font-medium text-foreground mb-1">
          You have an Invitation
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed mb-3">
          You were invited to join{" "}
          <span className="font-medium text-foreground">Startup Crew</span> in
          Open Wallet.
        </p>
        <div className="bg-blue-600 text-white text-center py-2 rounded-lg text-xs font-medium cursor-pointer">
          Accept Invitation
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          This link expires in 48 hours
        </p>
      </div>
    </div>
  );
}

export function ActivityFeedCard() {
  return (
    <div className="rounded-xl border border-border bg-background p-4 w-full max-w-md ">
      <p className="text-xs text-muted-foreground mb-4">Actividad reciente</p>
      <div className="flex flex-col">
        {feedItems.map((item, i) => (
          <div key={i} className="flex gap-3">
            <div className="flex flex-col items-center shrink-0">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${item.color}`}
              >
                {item.initials}
              </div>
              {item.line && <div className="w-px flex-1 bg-border mt-1 mb-1" />}
            </div>
            <div className={item.line ? "pb-4" : ""}>
              <p className="text-sm text-foreground leading-none mb-0.5">
                <span className="font-medium">{item.name}</span> {item.action}
              </p>
              <p className="text-xs text-muted-foreground mb-1">
                {item.detail}
              </p>
              <div className="flex items-center gap-2">
                {item.amount && (
                  <span className={`text-xs font-medium ${item.amountColor}`}>
                    {item.amount}
                  </span>
                )}
                <span className="text-xs text-muted-foreground">
                  {item.time}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StatsCard() {
  return (
    <div className="flex flex-col gap-3 w-full max-w-md">
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`rounded-xl border p-4 ${
              s.accent
                ? "bg-blue-600 border-blue-600"
                : "bg-background border-border"
            }`}
          >
            <p
              className={`text-xs mb-1 ${s.accent ? "text-blue-200" : "text-muted-foreground"}`}
            >
              {s.label}
            </p>
            <p
              className={`text-2xl font-semibold ${s.accent ? "text-white" : "text-foreground"}`}
            >
              {s.value}
            </p>
            <p
              className={`text-xs mt-1 ${s.accent ? "text-blue-200" : "text-green-600 dark:text-green-400"}`}
            >
              {s.delta}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
