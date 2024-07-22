const express = require("express");
const router = express.Router();
const auth = require("../../utills/auth");
const { addSubscription, deleteSubscription, getAllSubscriptions, updateSubscription, singleSubscription, sportSubscription, subscribtionIsActive, subscribtionIsSubscription } = require("../../controllers/subscription/subscriptionController");
// subscriptions

/**
 * @swagger
 * tags:
 *   name: Subscription
 *   description: Operations related to Subscription management
 */

/**
 * @swagger
 * /api/v1/addsubscription:
 *   post:
 *     summary: Add a new subscription
 *     description: Add a new subscription to the system
 *     tags: [Subscription]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subscriptionName:
 *                 type: string
 *               description:
 *                 type: string
 *               subscriptionAmount:
 *                 type: number
 *               subscriptionLimit:
 *                 type: number
 *               subscribtionStatus:
 *                 type: boolean
 *               sportId:
 *                 type: integer
 *             example:
 *               subscriptionName: "Premium Subscription"
 *               description: "Access to premium features"
 *               subscriptionAmount: 29.99
 *               subscriptionLimit: 100
 *               subscribtionStatus: true
 *               sportId: 1
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
 *                   example: Subscription added successfully
 *                   description: Success message
 *       '400':
 *         description: Subscription creation failed
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
 *                   example: Subscription creation failed
 *                   description: Error message
 *       '409':
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 409
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

router.post("/addsubscription", auth.authorization, addSubscription);
/**
 * @swagger
 * /api/v1/deletesubscription/{id}:
 *   post:
 *     summary: Delete a subscription
 *     description: Delete a subscription from the system
 *     tags: [Subscription]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the subscription to delete
 *         schema:
 *           type: integer
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
 *                   example: Subscription deleted successfully
 *                   description: Success message
 *       '404':
 *         description: Subscription already deleted
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
 *                   example: Subscription already deleted
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
router.post("/deletesubscription/:id", auth.authorization, deleteSubscription);
/**
 * @swagger
 * /api/v1/updatesubscription:
 *   post:
 *     summary: Update a subscription
 *     description: Update an existing subscription in the system
 *     tags: [Subscription]
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
 *                 type: integer
 *                 description: ID of the subscription to update
 *               subscriptionName:
 *                 type: string
 *                 description: New name for the subscription
 *               description:
 *                 type: string
 *                 description: New description for the subscription
 *               subscriptionAmount:
 *                 type: number
 *                 description: New amount for the subscription
 *               subscriptionLimit:
 *                 type: integer
 *                 description: New limit for the subscription
 *               subscribtionStatus:
 *                 type: boolean
 *                 description: New status for the subscription
 *               sportId:
 *                 type: integer
 *                 description: ID of the sport associated with the subscription
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
router.post("/updatesubscription", auth.authorization, updateSubscription);
/**
 * @swagger
 * /api/v1/getallsubscriptions:
 *   get:
 *     summary: Get all subscriptions
 *     description: Retrieve all subscriptions from the system
 *     tags: [Subscription]
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
 *                       subscriptionData:
 *                         type: object
 *                         description: Subscription data
 *                         properties:
 *                           id:
 *                             type: integer
 *                             description: ID of the subscription
 *                           subscriptionName:
 *                             type: string
 *                             description: Name of the subscription
 *                           description:
 *                             type: string
 *                             description: Description of the subscription
 *                           subscriptionAmount:
 *                             type: number
 *                             description: Amount of the subscription
 *                           subscriptionLimit:
 *                             type: integer
 *                             description: Limit of the subscription
 *                           subscribtionStatus:
 *                             type: boolean
 *                             description: Status of the subscription
 *                           sportData:
 *                             type: object
 *                             description: Sport associated with the subscription
 *                             properties:
 *                               id:
 *                                 type: integer
 *                                 description: ID of the sport
 *                               name:
 *                                 type: string
 *                                 description: Name of the sport
 *                               description:
 *                                 type: string
 *                                 description: Description of the sport
 *                               createdAt:
 *                                 type: string
 *                                 format: date-time
 *                                 description: Creation date of the sport
 *                               updatedAt:
 *                                 type: string
 *                                 format: date-time
 *                                 description: Last update date of the sport
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

router.get("/getallsubscriptions", auth.authorization, getAllSubscriptions);
/**
 * @swagger
 * /api/v1/getsubscription/{id}:
 *   get:
 *     summary: Get subscription data by ID
 *     description: Retrieves subscription data based on the provided ID
 *     tags: [Subscription]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the subscription
 *         schema:
 *           type: integer
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful retrieval of subscription data
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
 *                   description: Subscription data
 *       '400':
 *         description: Subscription data not found
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

router.get("/getsubscription/:id", auth.authorization, singleSubscription);
router.get("/getsportsubscription/:sportid", auth.authorization, sportSubscription);
router.post("/subscribtionisactive/:id", auth.authorization, subscribtionIsActive);
router.post("/subscribtionissubscription", auth.authorization, subscribtionIsSubscription);
module.exports = router;
