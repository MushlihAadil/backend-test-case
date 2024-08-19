const express = require('express');
const MemberController = require('../Controllers/memberControllers');
const router = express.Router();

// Show all existing member
router.get("/", MemberController.getAllMembers);

module.exports = router;