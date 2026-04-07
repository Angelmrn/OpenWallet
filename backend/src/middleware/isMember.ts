import { Response, NextFunction } from "express";
import { AuthRequest } from "./authenticate";
import prisma from "../lib/prisma";

export const isMember = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const orgId = req.params.orgId as string;

    const member = await prisma.member.findFirst({
      where: {
        organizationId: orgId,
        user: { id: req.userId },
        inviteStatus: "accepted",
      },
    });
    if (!member) {
      res
        .status(404)
        .json({ message: "You are not a member of this organization." });
      return;
    }

    next();
  } catch {
    res.status(500).json({ message: "server error" });
  }
};
