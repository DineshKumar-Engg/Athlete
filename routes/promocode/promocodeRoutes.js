const express = require("express");
const router = express.Router();
const auth = require("../../utills/auth");
const { addPromocode, deletePromocode, updatePromocode, getAllPromocodes, getPromocode, promocodeIsActive, validatePromocode } = require("../../controllers/promocode/promocodeController");
// promocode
/**
 * @swagger
 * tags:
 *   name: Promocode
 *   description: Operations related to Promocode management
 */
/**
 * @swagger
 * /api/v1/addPromocode:
 *   post:
 *     summary: Add a new promocode
 *     description: Add a new promocode to the system
 *     tags: [Promocode]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               promocodeName:
 *                 type: string
 *                 description: The name of the promocode
 *                 example: NEWUSER50
 *               promocodeDescription:
 *                 type: string
 *                 description: Description of the promocode
 *                 example: Get 50% off on your first purchase
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: Start date of the promocode validity
 *                 example: "2024-03-12"
 *               EndDate:
 *                 type: string
 *                 format: date
 *                 description: End date of the promocode validity
 *                 example: "2024-03-31"
 *               discount:
 *                 type: number
 *                 description: Discount percentage offered by the promocode
 *                 example: 50
 *               accessLimit:
 *                 type: number
 *                 description: Number of times the promocode can be used
 *                 example: 100
 *               sportId:
 *                 type: number
 *                 description: ID of the sport related to the promocode
 *                 example: 1
 *     responses:
 *       '200':
 *         description: Promocode added successfully
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
 *                   example: Promocode added successfully
 *                   description: Success message
 *       '400':
 *         description: Promocode creation failed
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
 *                   example: Promocode creation failed
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

router.post("/addPromocode", auth.authorization, addPromocode);
/**
 * @swagger
 * /api/v1/deletepromocode/{id}:
 *   post:
 *     summary: Delete a promocode
 *     description: Delete a promocode by its ID
 *     tags: [Promocode]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the promocode to delete
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Promocode deleted successfully
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
 *                   example: Promocode deleted successfully
 *                   description: Success message
 *       '404':
 *         description: Promocode not found or already deleted
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
 *                   example: Promocode not found or already deleted
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

router.post("/deletepromocode/:id", auth.authorization, deletePromocode);
/**
 * @swagger
 * /api/v1/updatepromocode:
 *   post:
 *     summary: Update a promocode
 *     description: Update a promocode with new data
 *     tags: [Promocode]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID of the promocode to update
 *               promocodeName:
 *                 type: string
 *                 description: New name for the promocode
 *               promocodeDescription:
 *                 type: string
 *                 description: New description for the promocode
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: New start date for the promocode
 *               EndDate:
 *                 type: string
 *                 format: date
 *                 description: New end date for the promocode
 *               discount:
 *                 type: number
 *                 description: New discount value for the promocode
 *               accessLimit:
 *                 type: integer
 *                 description: New access limit for the promocode
 *               isEnable:
 *                 type: boolean
 *                 description: New status of the promocode
 *               sportId:
 *                 type: integer
 *                 description: New sport ID associated with the promocode
 *     responses:
 *       '200':
 *         description: Data updates successfully
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

router.post("/updatepromocode", auth.authorization, updatePromocode);
/**
 * @swagger
 * /api/v1/getallpromocodes:
 *   get:
 *     summary: Get all promocodes
 *     description: Retrieve all promocodes
 *     tags: [Promocode]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: A list of promocodes
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
 *                   description: Response message
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       promocodeData:
 *                         type: object
 *                         description: Promocode data
 *                       sportData:
 *                         type: object
 *                         description: Sport data associated with the promocode
 *                       roleData:
 *                         type: object
 *                         description: Role data associated with the promocode
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

router.get("/getallpromocodes", auth.authorization, getAllPromocodes);
/**
 * @swagger
 * /api/v1/getpromocode/{id}:
 *   get:
 *     summary: Get promocode data by ID
 *     description: Retrieves promocode data based on the provided ID
 *     tags: [Promocode]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the promocode
 *         schema:
 *           type: integer
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful retrieval of promocode data
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
 *                   description: Promocode data
 *       '400':
 *         description: Promocode data not found
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

router.get("/getpromocode/:id", auth.authorization, getPromocode);
router.post("/promocodeisactive/:id", auth.authorization, promocodeIsActive);
router.post("/promocodeismatched", auth.authorization, validatePromocode);
module.exports = router;
