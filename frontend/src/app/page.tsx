import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, CircleArrowRight } from "lucide-react";
import {
  InviteFlowCard,
  ActivityFeedCard,
  StatsCard,
} from "@/components/landing/index";

export default function Home() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col justify-center px-10 py-16 gap-8 bg-background">
        <div className="space-y-4">
          <h1 className="text-6xl sm:text-7xl font-bold tracking-tight text-foreground leading-tight">
            Welcome to{" "}
            <span className="text-blue-600 dark:text-blue-400">
              Open Wallet
            </span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
            Create organizations, invite collaborators, and distribute reward
            points simply and transparently.
          </p>
        </div>

        <ul className="space-y-3">
          {[
            "Invite your team via email",
            "Give and transfer points in seconds.",
            "Real-time transaction history",
          ].map((item) => (
            <li
              key={item}
              className="flex items-center gap-3 text-sm text-muted-foreground"
            >
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 shrink-0">
                <Check className="h-3 w-3 text-blue-600 dark:text-blue-400" />
              </div>
              {item}
            </li>
          ))}
        </ul>

        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <Link href="/register" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full bg-black hover:bg-gray-900 text-white text-base font-semibold h-12 px-8 transition-all hover:-translate-y-0.5"
            >
              <span>Start Now</span>
              <CircleArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/login" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="w-full h-12 px-8 border-2 border-slate-200 hover:bg-slate-50 text-slate-700 text-base font-medium transition-all hover:-translate-y-0.5"
            >
              Login
            </Button>
          </Link>
        </div>
      </div>

      <div className="hidden lg:flex flex-col justify-center items-center gap-6 p-10 bg-slate-50/50 dark:bg-slate-900/50 border-l border-border overflow-hidden relative">
        <div className="absolute inset-0 bg-linear-to-tr from-blue-100/30 via-transparent to-blue-50/30 dark:from-blue-900/20 dark:to-transparent" />

        <div className="w-full max-w-lg relative z-10 flex flex-col gap-6">
          <div className="self-start w-full max-w-sm transition-transform hover:-translate-y-1 duration-300">
            <InviteFlowCard />
          </div>

          <div className="self-end w-full max-w-md transition-transform hover:-translate-y-1 duration-300 shadow-xl shadow-blue-900/5 rounded-xl">
            <ActivityFeedCard />
          </div>

          <div className="self-center w-full max-w-md transition-transform hover:-translate-y-1 duration-300">
            <StatsCard />
          </div>
        </div>
      </div>
    </div>
  );
}
