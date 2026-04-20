"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createOrgApi } from "@/lib/api/org.api";
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
import { Organization } from "@/types";
import { Plus, Building2 } from "lucide-react";

const createOrgSchema = z.object({
  name: z.string().min(2, "Minimum 2 characters"),
});

type CreateOrgForm = z.infer<typeof createOrgSchema>;

interface CreateOrgDialogProps {
  onCreated: (org: Organization) => void;
}

export default function CreateOrgDialog({ onCreated }: CreateOrgDialogProps) {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateOrgForm>({
    resolver: zodResolver(createOrgSchema),
  });

  const onSubmit = async (data: CreateOrgForm) => {
    try {
      setServerError(null);
      const res = await createOrgApi(data.name);
      onCreated(res.organization);
      reset();
      setOpen(false);
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : "Error creating organization",
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Organization
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-2">
              <Building2 />
              Create organization
            </div>
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} placeholder="My Org" />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          {serverError && <p className="text-sm text-red-500">{serverError}</p>}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
