"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { inviteMemberOrgApi } from "@/lib/api/org.api";
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
import { UserRoundPlus, MessageSquareCheck } from "lucide-react";

const schema = z.object({
  email: z.email("Email inválido"),
});

type Form = z.infer<typeof schema>;

interface InviteMemberDialogProps {
  orgId: string;
  onInvited: () => void;
}

export default function InviteMemberDialog({
  orgId,
  onInvited,
}: InviteMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Form>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: Form) => {
    try {
      setServerError(null);
      await inviteMemberOrgApi(orgId, data.email);
      setSuccess(true);
      onInvited();
      toast.success("Usuario invitado Correctamente");
      reset();
      setTimeout(() => {
        setSuccess(false);
        setOpen(false);
      }, 1500);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error al Invitar al Miembro",
      );
      setServerError(
        error instanceof Error ? error.message : "Error al invitar",
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <UserRoundPlus className="h-4 w-4" />
          Invitar miembro
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invitar miembro</DialogTitle>
        </DialogHeader>
        {success ? (
          <div className="flex items-center justify-center gap-2 py-4 text-sm text-green-600 font-medium">
            <MessageSquareCheck className="h-5 w-5" />
            <span>Invitación enviada</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Label>Email</Label>
              <Input
                type="email"
                {...register("email")}
                placeholder="trabajador@empresa.com"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            {serverError && (
              <p className="text-sm text-red-500">{serverError}</p>
            )}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar invitación"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
