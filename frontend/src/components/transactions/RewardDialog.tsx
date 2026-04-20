"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { rewardMemberApi } from "@/lib/api/transactions.api";
import { Member } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const schema = z.object({
  amount: z.coerce.number().min(1, "Minimum 1 point"),
  message: z.string().optional(),
});

type Form = z.infer<typeof schema>;

interface RewardDialogProps {
  orgId: string;
  member: Member;
  onRewarded: () => void;
}

export default function RewardDialog({
  orgId,
  member,
  onRewarded,
}: RewardDialogProps) {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Form>({
    resolver: zodResolver(schema) as any,
  });

  const onSubmit = async (data: Form) => {
    try {
      setServerError(null);
      await rewardMemberApi(orgId, member.id, data.amount, data.message);
      onRewarded();
      toast.success("Points sent successfully");
      reset();
      setOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error when rewarding",
      );
      setServerError(error instanceof Error ? error.message : "Error");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          Reward
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reward {member.user?.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label>Points</Label>
            <Input type="number" {...register("amount")} placeholder="100" />
            {errors.amount && (
              <p className="text-sm text-red-500">{errors.amount.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label>Message (optional)</Label>
            <Input {...register("message")} placeholder="Thank you!" />
          </div>
          {serverError && <p className="text-sm text-red-500">{serverError}</p>}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Rewarding..." : "Reward"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
