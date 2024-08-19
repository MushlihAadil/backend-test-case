const express = require('express');
const MemberController = require('../Controllers/memberControllers');
const router = express.Router();

// Show all existing member
router.get("/", MemberController.getAllMembers);

// Show all existing member including the number of books being borrowed by each member
router.get("/:id", MemberController.getMemberDetails);

// Members borrowing books with conditions
router.get("/:id/borrow", MemberController.memberBorrowBook);

// Members returning books with conditions
router.get("/:id/return", MemberController.memberReturnBook);

module.exports = router;