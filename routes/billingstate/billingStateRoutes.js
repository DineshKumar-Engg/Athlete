const express = require("express");
const router = express.Router();
const auth = require("../../utills/auth");
const { addBillingState, deleteBillingSatate, updateBillingState, getAllBillingState, getBillingState } = require("../../controllers/billingstate/billingStateController");
// sport
/**
 * @swagger
 * tags:
 *   name: Billing State
 *   description: Operations related to Billing State management
 */

/**
 * @swagger
 * /api/v1/addbillingstate:
 *   post:
 *     summary: Add a new Billing State
 *     description: Add a new Billing State with state name and tax rate
 *     tags: [Billing State]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stateName:
 *                 type: string
 *                 description: Name of the state
 *               tax:
 *                 type: number
 *                 description: Tax rate
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Billing State added successfully
 *                   description: Success message
 *       '400':
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 400
 *                   description: HTTP status code
 *                 message:
 *                   type: string
 *                   example: Billing State creation failed
 *                   description: Error message
 *       '401':
 *         description: Not Authorized
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
 *                   example: User not found
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
router.post("/addbillingstate", auth.authorization, addBillingState);
/**
 * @swagger
 * /api/v1/deletebillingstater/{id}:
 *   post:
 *     summary: Delete a Billing State
 *     description: Delete a Billing State by ID
 *     tags: [Billing State]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the Billing State to delete
 *     responses:
 *       '200':
 *         description: Successful operation
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
 *                   example: Billing State deleted successfully
 *                   description: Success message
 *       '404':
 *         description: Billing State not found or already deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 404
 *                   description: HTTP status code
 *                 message:
 *                   type: string
 *                   example: Billing State not found or already deleted
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
router.post("/deletebillingstate/:id", auth.authorization, deleteBillingSatate);
/**
 * @swagger
 * /api/v1/updatebillingstate:
 *   post:
 *     summary: Update a Billing State
 *     description: Update a Billing State
 *     tags: [Billing State]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID of the Billing State to update
 *               stateName:
 *                 type: string
 *                 description: New state name
 *               tax:
 *                 type: number
 *                 description: New tax value
 *               isActive:
 *                 type: boolean
 *                 description: New status indicating whether the billing state is active or not
 *             required:
 *               - id
 *     responses:
 *       '200':
 *         description: Successful operation
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
 *                   example: Data updates successfully
 *                   description: Success message
 *       '401':
 *         description: Not authorized or user not found
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
router.post("/updatebillingstate", auth.authorization, updateBillingState);
/**
 * @swagger
 * /api/v1/getallbillingstate:
 *   get:
 *     summary: Get all billing states
 *     description: Retrieve all billing states
 *     tags: [Billing State]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful operation
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
 *                       billingstateData:
 *                         type: object
 *                         description: Billing state data
 *                       roleData:
 *                         type: object
 *                         description: Role data
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
router.get("/getallbillingstate", auth.authorization, getAllBillingState);
/**
 * @swagger
 * /api/v1/getbillingstate/{id}:
 *   get:
 *     summary: Get billing state data by ID
 *     description: Retrieves billing state data based on the provided ID
 *     tags: [Billing State]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the billing state
 *         schema:
 *           type: integer
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful retrieval of billing state data
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
 *                   example: Success
 *                 data:
 *                   type: object
 *                   description: Billing state data
 *       '400':
 *         description: Billing state data not found
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
 *                   example: Data not found
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
 *                   example: Internal server error
 */

router.get("/getbillingstate/:id", auth.authorization, getBillingState);
module.exports = router;
