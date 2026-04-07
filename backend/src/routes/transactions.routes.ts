import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { isMember } from "../middleware/isMember";
import { isOwner } from "../middleware/isOwner";
import {
  rewardMember,
  transferPoints,
  getOrgTransactions,
  getMyTransactions,
} from "../controllers/transaction.controllers";

const router = Router();

router.post("/:orgId/reward/:memberId", authenticate, isOwner, rewardMember);
router.post(
  "/:orgId/transfer/:memberId",
  authenticate,
  isMember,
  transferPoints,
);
router.get("/:orgId", authenticate, isOwner, getOrgTransactions);
router.get("/:orgId/me", authenticate, isMember, getMyTransactions);

export default router;
