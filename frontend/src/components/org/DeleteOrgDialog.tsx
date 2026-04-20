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
      console.error("Error deleting Organization ", error);
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
          <DialogTitle>¿Delete Organization?</DialogTitle>
          <DialogDescription>
            You are about to delete the organization{" "}
            <span className="font-medium text-foreground">
              {orgName || "selected"}
            </span>
            . This action cannot be undone and all data will be lost.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={removing}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={removing}
            onClick={handleRemove}
          >
            {removing ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
