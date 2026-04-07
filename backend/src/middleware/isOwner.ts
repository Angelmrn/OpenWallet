import { Response, NextFunction } from "express";
import { AuthRequest } from "./authenticate";
import prisma from "../lib/prisma";

export const isOwner = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const orgId = req.params.orgId as string;

    const org = await prisma.organization.findUnique({
      where: { id: orgId },
    });
    if (!org) {
      res.status(404).json({ message: "Organization not found." });
      return;
    }
    if (org.ownerId !== req.userId) {
      res
        .status(403)
        .json({ message: "Only the owner can perform this action" });
      return;
    }
    next();
  } catch {
    res.status(500).json({ message: "server error" });
  }
};
