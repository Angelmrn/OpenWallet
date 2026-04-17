"use client";
import { useState } from "react";
import { deleteOrgApi } from "@/lib/api/org.api";
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
import { Trash2 } from "lucide-react";

interface RemoveOrgProps {
  orgId: string;
  orgName?: string;
  onRemoved: (orgId: string) => void;
}

export default function RemoveOrgDialog({
  orgId,
  orgName,
  onRemoved,
}: RemoveOrgProps) {
  const [open, setOpen] = useState(false);
  const [removing, setRemoving] = useState(false);

  const handleRemove = async () => {
    setRemoving(true);
    try {
      await deleteOrgApi(orgId);
      onRemoved(orgId);
      setOpen(false);
    } catch (error) {
      console.error("Error al eliminar Organizacion ", error);
    } finally {
      setRemoving(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Eliminar Organizacion?</DialogTitle>
          <DialogDescription>
            Estás a punto de eliminar la organización{" "}
            <span className="font-medium text-foreground">
              {orgName || "seleccionada"}
            </span>
            . Esta acción no se puede deshacer y todos los datos se perderán.
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
