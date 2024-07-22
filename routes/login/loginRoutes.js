const express = require("express");
const router = express.Router();
const { login } = require("../../controllers/login/loginController");

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Operations related to user authentication
 */

/**
 * @swagger
 * /api/v1/login:
 *   post:
 *     summary: Login to the application
 *     description: Authenticate user with email and password and generate JWT token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: User's password
 *                 example: password123
 *     responses:
 *       '200':
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   description: HTTP status code
 *                   example: 200
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: Login successful
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   type: object
 *                   description: User details
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: User ID
 *                       example: 1
 *                     email:
 *                       type: string
 *                       format: email
 *                       description: User's email
 *                       example: user@example.com
 *                     roleId:
 *                       type: integer
 *                       description: ID of the user's role
 *                       example: 2
 *                     roleType:
 *                       type: string
 *                       description: Type of user's role
 *                       example: admin
 *                 profileData:
 *                   type: object
 *                   description: Profile data associated with the user's role
 *                 sportData:
 *                   type: object
 *                   description: Sport data associated with the user's role (for Athlete and Coach)
 *                 subscriptionData:
 *                   type: object
 *                   description: Subscription data associated with the user's role (if applicable)
 *                 isSubscribed:
 *                   type: boolean
 *                   description: Indicates if the user is subscribed (true) or not (false)
 *       '400':
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   description: HTTP status code
 *                   example: 400
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: Wrong Password
 *       '401':
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   description: HTTP status code
 *                   example: 401
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: User not found
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   description: HTTP status code
 *                   example: 500
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: Internal Server error
 */

router.post("/login", login);

module.exports = router;
