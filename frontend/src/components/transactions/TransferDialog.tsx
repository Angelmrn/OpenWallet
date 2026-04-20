"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { transferPointsApi } from "@/lib/api/transactions.api";
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

interface TransferDialogProps {
  orgId: string;
  member: Member;
  currentMember: Member;
  onTransferred: () => void;
}

export default function TransferDialog({
  orgId,
  member,
  currentMember,
  onTransferred,
}: TransferDialogProps) {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const schema = z.object({
    amount: z.coerce
      .number()
      .min(1, "Mínimo 1 punto")
      .max(
        currentMember.pointsBalance,
        `Máximo ${currentMember.pointsBalance} puntos`,
      ),
    message: z.string().optional(),
  });

  type Form = z.infer<typeof schema>;

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
      const response = await transferPointsApi(
        orgId,
        member.id,
        data.amount,
        data.message ?? "",
      );
      onTransferred();
      toast.success("Points sent successfully");
      reset();
      setOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error when Transfer",
      );
      setServerError(error instanceof Error ? error.message : "Error");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="cursor-pointer">
          Transfer
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfer {member.user?.name}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          You´re balance:{" "}
          <span className="font-medium">{currentMember.pointsBalance} pts</span>
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label>Points</Label>
            <Input type="number" {...register("amount")} placeholder="50" />
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
            {isSubmitting ? "Transferring..." : "Transfer"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
