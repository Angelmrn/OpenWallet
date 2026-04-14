"use client";
import { useState } from "react";
import { Member } from "@/types";
import { deleteMemberApi } from "@/lib/api/members.api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

interface RemoveMemberDialogProps {
  member: Member;
  orgId: string;
  onRemoved: (memberId: string) => void;
}

export default function RemoveMemberDialog({
  member,
  orgId,
  onRemoved,
}: RemoveMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const [removing, setRemoving] = useState(false);

  const handleRemove = async () => {
    setRemoving(true);
    try {
      await deleteMemberApi(orgId, member.id);
      onRemoved(member.id);
      setOpen(false);
    } catch (error) {
      console.error("Error al eliminar miembro", error);
    } finally {
      setRemoving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Eliminar
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Eliminar Miembro?</DialogTitle>
          <DialogDescription>
            Estás a punto de eliminar a{" "}
            <span className="font-medium">
              {member?.user?.name ?? member?.inviteEmail}.
            </span>{" "}
            Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={removing}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            disabled={removing}
            onClick={handleRemove}
          >
            {removing ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
