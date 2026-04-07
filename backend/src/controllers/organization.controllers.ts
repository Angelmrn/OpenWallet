import { Response } from "express";
import { z } from "zod";
import prisma from "../lib/prisma";
import { AuthRequest } from "../middleware/authenticate";
import { sendInviteEmail } from "../services/email.service";
import { generateRandomToken } from "../services/token.service";

const createOrgSchema = z.object({
  name: z.string().min(1).max(100),
});

const inviteMemberSchema = z.object({
  email: z.string().email(),
  role: z.enum(["member", "owner"]).default("member"),
});

export const createOrganization = async (req: AuthRequest, res: Response) => {
  try {
    const { name } = createOrgSchema.parse(req.body);

    const org = await prisma.organization.create({
      data: {
        name,
        ownerId: req.userId!,
        members: {
          create: {
            userId: req.userId!,
            role: "owner",
            inviteStatus: "accepted",
            inviteEmail: "",
            joinedAt: new Date(),
          },
        },
      },
      include: { members: true },
    });

    res.status(201).json({ organization: org });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "Invalid input", errors: error.issues });
      return;
    }
    res.status(500).json({ message: "Server error" });
  }
};

export const getOrganization = async (req: AuthRequest, res: Response) => {
  try {
    const orgId = req.params.orgId as string;

    const org = await prisma.organization.findUnique({
      where: { id: orgId },
      include: {
        members: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
      },
    });

    if (!org) {
      res.status(404).json({ message: "Organization not found" });
      return;
    }

    res.json({ organization: org });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyOrganizations = async (req: AuthRequest, res: Response) => {
  try {
    const orgs = await prisma.organization.findMany({
      where: { ownerId: req.userId },
    });

    res.json({ organizations: orgs });
  } catch (error) {
    console.error("Error in getMyOrganizations:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteOrganization = async (req: AuthRequest, res: Response) => {
  try {
    const orgId = req.params.orgId as string;

    await prisma.organization.delete({
      where: { id: orgId, ownerId: req.userId! },
    });

    res.json({ message: "Organization deleted" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

export const inviteMember = async (req: AuthRequest, res: Response) => {
  try {
    const orgId = req.params.orgId as string;
    const { email, role } = inviteMemberSchema.parse(req.body);

    const org = await prisma.organization.findUnique({ where: { id: orgId } });
    if (!org) {
      res.status(404).json({ message: "Organization not found" });
      return;
    }

    // Verificar si ya fue invitado
    const existing = await prisma.member.findFirst({
      where: { organizationId: orgId, inviteEmail: email },
    });
    if (existing) {
      res.status(400).json({ message: "This email has already been invited" });
      return;
    }

    const inviteToken = generateRandomToken();
    const inviteTokenExpires = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48h

    await prisma.member.create({
      data: {
        organizationId: orgId,
        inviteEmail: email,
        role,
        inviteToken,
        inviteTokenExpires,
        inviteStatus: "pending",
      },
    });

    await sendInviteEmail(email, inviteToken, org.name);

    res.status(201).json({ message: "Invitation sent" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "Invalid input", errors: error.issues });
      return;
    }
    res.status(500).json({ message: "Server error" });
  }
};

export const acceptInvite = async (req: AuthRequest, res: Response) => {
  try {
    const token = req.params.token as string;
    const member = await prisma.member.findFirst({
      where: {
        inviteToken: token,
        inviteTokenExpires: { gt: new Date() },
        inviteStatus: "pending",
      },
    });

    if (!member) {
      res.status(400).json({ message: "Invalid or expired invite" });
      return;
    }

    await prisma.member.update({
      where: { id: member.id },
      data: {
        userId: req.userId!,
        inviteStatus: "accepted",
        inviteToken: null,
        inviteTokenExpires: null,
        joinedAt: new Date(),
      },
    });

    res.json({ message: "Invite accepted successfully" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

export const getInviteInfo = async (req: AuthRequest, res: Response) => {
  try {
    const token = req.params.token as string;
    const member = await prisma.member.findFirst({
      where: {
        inviteToken: token,
        inviteTokenExpires: { gt: new Date() },
        inviteStatus: "pending",
      },
      include: {
        organization: { select: { name: true } },
      },
    });

    if (!member) {
      res.status(400).json({ message: "Invalid or expired invite" });
      return;
    }

    res.json({
      invite: {
        email: member.inviteEmail,
        organization: member.organization.name,
        role: member.role,
      },
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
