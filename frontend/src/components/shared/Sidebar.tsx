"use client";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { clearSession } from "@/lib/fetcher";
import { logoutApi } from "@/lib/api/auth.api";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LayoutDashboard, LogOut } from "lucide-react";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, cleanUser } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logoutApi();
    } finally {
      cleanUser();
      clearSession();
      router.push("/login");
    }
  };

  const navItems = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard size={18} />,
      href: "/dashboard",
    },
  ];

  return (
    <aside className="w-64 h-screen border-r bg-background flex flex-col fixed left-0 top-0">
      <div className="h-14 flex items-center px-6 border-b">
        <span
          className="font-bold text-lg cursor-pointer"
          onClick={() => router.push("/dashboard")}
        >
          OpenWallet
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <Button
            key={item.href}
            variant={pathname === item.href ? "secondary" : "ghost"}
            className="w-full justify-start gap-2"
            onClick={() => router.push(item.href)}
          >
            {item.icon}
            {item.label}
          </Button>
        ))}
      </nav>

      <div className="p-4 border-t space-y-2">
        <Separator />
        <div className="px-2 py-1">
          <p className="text-sm font-medium">{user?.name}</p>
          <p className="text-xs text-muted-foreground truncate">
            {user?.email}
          </p>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-red-500 hover:text-red-500"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          Logout
        </Button>
      </div>
    </aside>
  );
}
