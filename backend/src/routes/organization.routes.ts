import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { isOwner } from "../middleware/isOwner";
import { isMember } from "../middleware/isMember";
import {
  createOrganization,
  getOrganization,
  getMyOrganizations,
  deleteOrganization,
  inviteMember,
  acceptInvite,
  getInviteInfo,
  getPendingInvite,
} from "../controllers/organization.controllers";

const router = Router();

router.post("/create", authenticate, createOrganization);
router.get("/my", authenticate, getMyOrganizations);
router.get("/invite/:token", getInviteInfo);
router.post("/invite/:token/accept", authenticate, acceptInvite);
router.get("/:orgId", authenticate, isMember, getOrganization);
router.delete("/:orgId", authenticate, isOwner, deleteOrganization);
router.post("/:orgId/invite", authenticate, isOwner, inviteMember);
router.get("/:orgId/pending", authenticate, isOwner, getPendingInvite);

export default router;
