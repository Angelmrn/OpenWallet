"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { getMeApi } from "@/lib/api/auth.api";
import Sidebar from "@/components/shared/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, setUser } = useAuthStore();

  useEffect(() => {
    if (!user) {
      getMeApi()
        .then((res) => setUser(res.user))
        .catch(() => router.push("/login"));
    }
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">{children}</main>
    </div>
  );
}
