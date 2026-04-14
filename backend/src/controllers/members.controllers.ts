import { Response } from "express";
import { z } from "zod";
import prisma from "../lib/prisma";
import { AuthRequest } from "../middleware/authenticate";

const updateMemberRoleSchema = z.object({
  role: z.enum(["member", "owner"]),
});

export const getMembers = async (req: AuthRequest, res: Response) => {
  try {
    const orgId = req.params.orgId as string;
    const members = await prisma.member.findMany({
      where: {
        organizationId: orgId,
        inviteStatus: "accepted",
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });
    if (members.length === 0) {
      res.status(404).json({ message: "Organization not found or no members" });
      return;
    }
    res.json({ members: members });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateMemberRole = async (req: AuthRequest, res: Response) => {
  try {
    const orgId = req.params.orgId as string;
    const memberId = req.params.memberId as string;
    const { role } = updateMemberRoleSchema.parse(req.body);

    const member = await prisma.member.findFirst({
      where: { id: memberId, organizationId: orgId },
    });

    if (!member) {
      res.status(404).json({ message: "Member not found" });
      return;
    }

    await prisma.member.update({
      where: { id: memberId },
      data: { role },
    });

    res.json({ message: "Member role updated" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "Invalid input", errors: error.issues });
      return;
    }
    res.status(500).json({ message: "Server error" });
  }
};

export const removeMember = async (req: AuthRequest, res: Response) => {
  try {
    const orgId = req.params.orgId as string;
    const memberId = req.params.memberId as string;
    const member = await prisma.member.findFirst({
      where: { id: memberId, organizationId: orgId },
    });
    if (!member) {
      res.status(404).json({ message: "Member not found" });
      return;
    }
    if (member.userId === req.userId) {
      res.status(400).json({ message: "Owner cannot remove themselves" });
      return;
    }
    await prisma.$transaction([
      prisma.transaction.deleteMany({
        where: {
          organizationId: orgId,
          OR: [{ toMember: member }, { fromMember: member }],
        },
      }),
      prisma.member.delete({
        where: { id: memberId },
      }),
    ]);

    res.json({ message: "Member removed" });
  } catch (error) {
    console.error("Error in removeMember:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMemberBalance = async (req: AuthRequest, res: Response) => {
  try {
    const orgId = req.params.orgId as string;
    const userId = req.params.userId as string;
    const member = await prisma.member.findFirst({
      where: {
        organizationId: orgId,
        userId: userId,
        inviteStatus: "accepted",
      },
      select: { pointsBalance: true },
    });
    if (!member) {
      res.status(404).json({ message: "Organization or member not found" });
    }

    res.json({ balance: member?.pointsBalance });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
