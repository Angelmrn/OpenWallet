"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetcher } from "@/lib/fetcher";

type status = "loading" | "success" | "error";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<status>("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setMessage("Token not found");
      return;
    }
    fetcher<{ message: string }>(`/verify-email?token=${token}`)
      .then((response) => {
        setStatus("success");
        setMessage(response.message);
      })
      .catch((error) => {
        setStatus("error");
        setMessage(error.message || "Invalid Token or Expired");
      });
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 text-center space-y-4">
          {status === "loading" && (
            <>
              <p className="text-lg font-medium">Verifying your email...</p>
              <p className="text-sm text-muted-foreground">One moment please</p>
            </>
          )}
          {status === "success" && (
            <>
              <p className="text-lg font-medium"></p>
              <p className="text-lg font-medium">¡Verified Email!</p>
              <p className="text-sm text-muted-foreground">{message}</p>
              <Button className="w-full" onClick={() => router.push("/login")}>
                Go to login
              </Button>
            </>
          )}
          {status === "error" && (
            <>
              <p className="text-lg font-medium">Failed to Verify</p>
              <p className="text-sm text-muted-foreground">{message}</p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/register")}
              >
                Go to Register
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
