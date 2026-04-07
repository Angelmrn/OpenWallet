import { Response } from "express";
import { z } from "zod";
import prisma from "../lib/prisma";
import { AuthRequest } from "../middleware/authenticate";

const rewardMemberSchema = z.object({
  amount: z.number().positive(),
  message: z.string().optional(),
});
export const rewardMember = async (req: AuthRequest, res: Response) => {
  console.log("rewardMember called", {
    orgId: req.params.orgId,
    memberId: req.params.memberId,
    userId: req.userId,
  });
  try {
    const orgId = req.params.orgId as string;
    const memberId = req.params.memberId as string;
    const { amount, message } = rewardMemberSchema.parse(req.body);

    const ownerMember = await prisma.member.findFirst({
      where: { userId: req.userId!, organizationId: orgId },
    });
    if (!ownerMember) {
      res.status(404).json({ message: " Owner member not found" });
      return;
    }
    const targetMember = await prisma.member.findFirst({
      where: { id: memberId, organizationId: orgId },
    });
    if (!targetMember) {
      res.status(404).json({ message: " Target member not found" });
      return;
    }
    const [transaction] = await prisma.$transaction([
      prisma.transaction.create({
        data: {
          organizationId: orgId,
          fromMemberId: req.userId!,
          toMemberId: memberId,
          amount: amount,
          type: "reward",
          message: message,
        },
      }),
      prisma.member.update({
        where: { id: memberId },
        data: { pointsBalance: { increment: amount } },
      }),
      prisma.organization.update({
        where: { id: orgId },
        data: { totalPointsIssued: { increment: amount } },
      }),
    ]);
    res.status(201).json({ transaction });
  } catch (error) {
    console.error("Error in rewardMember:", error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "Invalid input", errors: error.issues });
      return;
    }
    res.status(500).json({ message: "Server error" });
  }
};

export const transferPoints = async (req: AuthRequest, res: Response) => {
  try {
    const orgId = req.params.orgId as string;
    const memberId = req.params.memeberId as string;
    const { amount, message } = rewardMemberSchema.parse(req.body);

    const fromMember = await prisma.member.findFirst({
      where: { userId: req.userId!, organizationId: orgId },
    });
    if (!fromMember) {
      res.status(404).json({ message: "From member not found" });
      return;
    }
    if (fromMember.pointsBalance < amount) {
      res.status(400).json({ message: "Insufficient points balance" });
      return;
    }
    if (fromMember.id === memberId) {
      res.status(400).json({ message: "Cannot transfer points to yourself" });
      return;
    }
    const toMember = await prisma.member.findFirst({
      where: { id: memberId, organizationId: orgId },
    });
    if (!toMember) {
      res.status(404).json({ message: "To member not found" });
      return;
    }
    const [transaction] = await prisma.$transaction([
      prisma.transaction.create({
        data: {
          organizationId: orgId,
          fromMemberId: fromMember.id,
          toMemberId: toMember.id,
          amount,
          type: "transfer",
          message,
        },
      }),
      prisma.member.update({
        where: { id: fromMember.id },
        data: { pointsBalance: { decrement: amount } },
      }),
      prisma.member.update({
        where: { id: toMember.id },
        data: { pointsBalance: { increment: amount } },
      }),
    ]);
    res.status(201).json({ transaction });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "Invalid input", errors: error.issues });
      return;
    }
    res.status(500).json({ message: "Server error" });
  }
};

export const getOrgTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const orgId = req.params.orgId as string;
    const transactions = await prisma.transaction.findMany({
      where: { organizationId: orgId },
      include: {
        fromMember: {
          select: { id: true, user: { select: { id: true, name: true } } },
        },
        toMember: {
          select: { id: true, user: { select: { id: true, name: true } } },
        },
      },
    });
    if (!transactions) {
      res.status(404).json({ message: "No transactions found" });
      return;
    }
    res.json({ transactions });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const orgId = req.params.orgId as string;
    const member = await prisma.member.findFirst({
      where: { userId: req.userId!, organizationId: orgId },
    });
    if (!member) {
      res.status(404).json({ message: "Member not found" });
      return;
    }
    const transactions = await prisma.transaction.findMany({
      where: {
        organizationId: orgId,
        OR: [{ fromMemberId: member.id }, { toMemberId: member.id }],
      },
      include: {
        fromMember: {
          select: { id: true, user: { select: { id: true, name: true } } },
        },
        toMember: {
          select: { id: true, user: { select: { id: true, name: true } } },
        },
        orderBy: { createdAt: "desc" },
      },
    });
    res.json({ transactions });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
