const express = require("express");
const router = express.Router();
const auth = require("../../utills/auth");
const {
  addAdmin,
  getAdmin,
  editAdmin
} = require("../../controllers/admin/adminController");

// admin
/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Operations related to admin management
 */

/**
 * @swagger
 * /api/v1/addadmin:
 *   post:
 *     summary: Add a new admin
 *     description: Adds a new admin user to the system
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: Admin's first name
 *                 example: John
 *               lastName:
 *                 type: string
 *                 description: Admin's last name
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Admin's email address
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 description: Admin's password
 *                 example: password123
 *               profileImg:
 *                 type: string
 *                 description: URL to the admin's profile image
 *                 example: https://example.com/profile.jpg
 *     responses:
 *       '201':
 *         description: Admin added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: User added successfully
 *       '400':
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: Email and password are required
 *       '409':
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: User already exists
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
 *                   example: Error occurred while adding user
 */
router.post("/addadmin", addAdmin);
/**
 * @swagger
 * /api/v1/getadmin:
 *   get:
 *     summary: Get admin details
 *     description: Retrieves details of the currently logged-in admin user
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful retrieval of admin details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: Success
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: Admin's ID
 *                       example: 1
 *                     firstName:
 *                       type: string
 *                       description: Admin's first name
 *                       example: John
 *                     lastName:
 *                       type: string
 *                       description: Admin's last name
 *                       example: Doe
 *                     email:
 *                       type: string
 *                       format: email
 *                       description: Admin's email address
 *                       example: john.doe@example.com
 *       '401':
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: Not Authorized
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
router.get("/getadmin", auth.authorization, getAdmin);
/**
 * @swagger
 * /api/v1/editadmin:
 *   post:
 *     summary: Edit admin details
 *     description: Edit details of the currently authenticated admin user
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: Admin's first name
 *               lastName:
 *                 type: string
 *                 description: Admin's last name
 *               profileImg:
 *                 type: string
 *                 description: URL to the admin's profile image
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Admin's email address
 *     responses:
 *       '200':
 *         description: Admin details updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: Data updated successfully
 *       '401':
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: Not authorized
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
router.post("/editadmin", auth.authorization, editAdmin);

module.exports = router;
