const express = require("express");
const router = express.Router();
const auth = require("../../utills/auth");
const { changePassword } = require("../../controllers/password/changePasswordController");

/**
 * @swagger
 * tags:
 *   name: Change Password
 *   description: Operations related to Change Password management
 */
/**
 * @swagger
 * /api/v1/changepassword:
 *   post:
 *     summary: Change user password
 *     description: Change the password of the currently authenticated user
 *     tags: [Change Password]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldpassword:
 *                 type: string
 *                 description: Current password of the user
 *               newpassword:
 *                 type: string
 *                 description: New password for the user
 *     responses:
 *       '200':
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: Password changed successfully
 *       '401':
 *         description: Wrong old password or not authorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: Wrong old password
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: Internal Server error
 */
router.post("/changepassword", auth.authorization, changePassword);
module.exports = router;
