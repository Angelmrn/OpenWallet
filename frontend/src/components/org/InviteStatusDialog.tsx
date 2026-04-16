"use client";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getInviteOrgInfoApi } from "@/lib/api/org.api";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { Invitation } from "@/types";

const schema = z.object({
  token: z.string().min(1, "Debes seleccionar una invitación"),
});

type Form = z.infer<typeof schema>;

interface InviteStatusDialogProps {
  invitations: Invitation[];
  onMemberSelect?: () => void;
}

export default function InviteStatusDialog({
  invitations,
  onMemberSelect,
}: InviteStatusDialogProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [inviteData, setInviteData] = useState<any>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: {
      token: "",
    },
  });

  const onSubmit = async (data: Form) => {
    try {
      setError(null);
      const response = await getInviteOrgInfoApi(data.token);
      setInviteData(response);
      setSuccess(true);
      if (onMemberSelect) onMemberSelect();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al ver estado de invitacion.",
      );
      setError(error instanceof Error ? error.message : "Error al ver estado");
    }
  };
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    setTimeout(() => {
      setSuccess(false);
      setInviteData(null);
      reset();
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2" disabled={invitations.length === 0}>
          <Search className="h-4 w-4" />
          Ver estado de invitacion
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ver Estado de Invitacion</DialogTitle>
        </DialogHeader>
        {success && inviteData ? (
          <div className="space-y-4 py-4">
            <h3 className="text-sm font-medium">Datos de la Invitación:</h3>
            <div className="rounded-md bg-zinc-50 p-4 dark:bg-zinc-900 border text-sm space-y-2">
              <p>
                <span className="font-semibold">Email:</span>{" "}
                {inviteData.invite.email || "ola"}
              </p>
              <p>
                <span className="font-semibold">Estado:</span>{" "}
                {inviteData.invite.role}
              </p>
              <p>
                <span className="font-semibold">Estado:</span>{" "}
                {inviteData.invite.status}
              </p>
            </div>
            <Button
              className="w-full"
              onClick={() => setSuccess(false)}
              variant="outline"
            >
              Buscar otra
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Label>Selecciona la invitacion</Label>
              <Controller
                name="token"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un correo..." />
                    </SelectTrigger>
                    <SelectContent>
                      {invitations.map((invite) => (
                        <SelectItem key={invite.token} value={invite.token}>
                          {invite.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.token && (
                <p className="text-sm text-red-500">{errors.token.message}</p>
              )}
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Buscando..." : "Ver Estado"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
