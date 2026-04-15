"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetcher } from "@/lib/fetcher";
import { useAuthStore } from "@/stores/auth.store";
import { getMeApi } from "@/lib/api/auth.api";

type Status = "loading" | "success" | "error";

export default function AceptInvitationPage() {
  const router = useRouter();
  const { token } = useParams<{ token: string }>();
  const { user, setUser } = useAuthStore();
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("");
  const [authCheck, setAuthCheck] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Token not found");
      return;
    }
    const checkAndAccept = async () => {
      let currentUser = user;
      if (!currentUser) {
        try {
          const response = await getMeApi();
          setUser(response.user);
          currentUser = response.user;
        } catch {
          router.push(`/login?redirect=/invite/${token}`);
          return;
        }
      }
      try {
        const response = fetcher<{ message: string }>(
          `/organizations/invite/${token}/accept`,
          {
            method: "POST",
          },
        );
        setStatus("success");
        setMessage((await response).message);
      } catch (error) {
        setStatus("error");
        setMessage(
          error instanceof Error ? error.message : "Invalid token or expired",
        );
      }
    };
    checkAndAccept();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 text-center space-y-4">
          {status === "loading" && (
            <>
              <p className="text-lg font-medium">Accepting invitation ...</p>
              <p className="text-sm text-muted-foreground">One moment please</p>
            </>
          )}
          {status === "success" && (
            <>
              <p className="text-lg font-medium"></p>
              <p className="text-lg font-medium">¡Invitation Accepted!</p>
              <p className="text-sm text-muted-foreground">{message}</p>
              <Button
                className="w-full"
                onClick={() => router.push("/dashboard")}
              >
                Go to dashboard
              </Button>
            </>
          )}
          {status === "error" && (
            <>
              <p className="text-lg font-medium">Failed to Acept</p>
              <p className="text-sm text-muted-foreground">{message}</p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/dashboard")}
              >
                Go to dashboard
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
