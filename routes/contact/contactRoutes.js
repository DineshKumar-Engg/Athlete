const express = require("express");
const router = express.Router();
const auth = require("../../utills/auth");
const { addContact, getAllContacts } = require("../../controllers/contact/contactController");

// Contacts
/**
 * @swagger
 * tags:
 *   name: Contact
 *   description: Operations related to Contact management
 */
/**
 * @swagger
 * /api/v1/addcontacts:
 *   post:
 *     summary: Add a contact
 *     description: Add a new contact to the system
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *                 description: First name of the contact
 *               lastname:
 *                 type: string
 *                 description: Last name of the contact
 *               phone:
 *                 type: string
 *                 description: Phone number of the contact
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the contact
 *               message:
 *                 type: string
 *                 description: Message from the contact
 *     responses:
 *       '201':
 *         description: Contact added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 201
 *                   description: HTTP status code
 *                 message:
 *                   type: string
 *                   example: User data added successfully
 *                   description: Success message
 *       '401':
 *         description: User data already submitted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 401
 *                   description: HTTP status code
 *                 message:
 *                   type: string
 *                   example: User data already submitted
 *                   description: Error message
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 500
 *                   description: HTTP status code
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                   description: Error message
 */
router.post("/addcontacts", addContact);
/**
 * @swagger
 * /api/v1/getcontacts:
 *   get:
 *     summary: Get all contacts
 *     description: Retrieve all contacts from the system
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully retrieved contacts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                   description: HTTP status code
 *                 message:
 *                   type: string
 *                   example: Success
 *                   description: Success message
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                         description: ID of the contact
 *                         example: 1
 *                       firstname:
 *                         type: string
 *                         description: First name of the contact
 *                         example: John
 *                       lastname:
 *                         type: string
 *                         description: Last name of the contact
 *                         example: Doe
 *                       phone:
 *                         type: string
 *                         description: Phone number of the contact
 *                         example: +1234567890
 *                       email:
 *                         type: string
 *                         description: Email address of the contact
 *                         example: john.doe@example.com
 *                       message:
 *                         type: string
 *                         description: Message from the contact
 *                         example: This is a test message
 *       '401':
 *         description: Not authorized to access the resource
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 401
 *                   description: HTTP status code
 *                 message:
 *                   type: string
 *                   example: Not Authorized
 *                   description: Error message
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 500
 *                   description: HTTP status code
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                   description: Error message
 */

router.get("/getcontacts", auth.authorization, getAllContacts);

module.exports = router;
