import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { isOwner } from "../middleware/isOwner";
import { isMember } from "../middleware/isMember";
import {
  getMembers,
  updateMemberRole,
  removeMember,
  getMemberBalance,
} from "../controllers/members.controllers";

const router = Router();

router.get("/:orgId", authenticate, isMember, getMembers);
router.patch("/:orgId/:memberId", authenticate, isOwner, updateMemberRole);
router.delete("/:orgId/:memberId", authenticate, isOwner, removeMember);
router.get(
  "/:orgId/:memberId/balance",
  authenticate,
  isMember,
  getMemberBalance,
);

export default router;
