const express = require("express");
const router = express.Router();
const auth = require("../../utills/auth");
const multer = require("multer");
const { uploadS3, updateSportS3 } = require("../../middlewares/s3");
const { addSport, deleteSport, getAllSport, updateSport, singleSport  } = require("../../controllers/sport/sportController");
const upload = multer({ limits: { fileSize: 100 * 1024 * 1024 } });
// sport
/**
 * @swagger
 * tags:
 *   name: Sport
 *   description: Operations related to Sport management
 */

/**
 * @swagger
 * /api/v1/addsport:
 *   post:
 *     summary: Add a new sport
 *     description: Add a new sport with required information
 *     tags: [Sport]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sportName:
 *                 type: string
 *                 description: Name of the sport
 *               sportDescription:
 *                 type: string
 *                 description: Description of the sport
 *               sportLogo:
 *                 type: string
 *                 description: URL of the sport logo
 *     responses:
 *       '200':
 *         description: Sport added successfully
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
 *                   example: Sport added successfully
 *                   description: Success message
 *       '400':
 *         description: User not found or other validation errors
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
router.post("/addsport", auth.authorization, upload.single("sportLogo"), uploadS3, addSport);
// router.post("/addsportlink", auth.authorization, upload.single("sportLogo"), uploadS3, addSportFile);
// router.post("/updatesportlink", auth.authorization, upload.single("sportLogo"), updateSportS3, updateSportFile);

/**
 * @swagger
 * /api/v1/deletesport/{id}:
 *   post:
 *     summary: Delete a sport
 *     description: Delete a sport by its ID
 *     tags: [Sport]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the sport to delete
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Sport deleted successfully
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
 *                   example: Sport deleted successfully
 *                   description: Success message
 *       '404':
 *         description: Sport already deleted or not found
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
 *                   example: Sport already deleted
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
router.post("/deletesport/:id", auth.authorization, deleteSport);
/**
 * @swagger
 * /api/v1/updatesport:
 *   post:
 *     summary: Update a sport
 *     description: Update a sport with new information
 *     tags: [Sport]
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
 *                 description: ID of the sport to update
 *               sportName:
 *                 type: string
 *                 description: Name of the sport
 *               sportDescription:
 *                 type: string
 *                 description: Description of the sport
 *               sportLogo:
 *                 type: string
 *                 description: URL of the sport logo
 *               isActive:
 *                 type: boolean
 *                 description: Indicates whether the sport is active or not
 *     responses:
 *       '200':
 *         description: Sport updated successfully
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
 *                   example: Sport updated successfully
 *                   description: Success message
 *       '404':
 *         description: Sport not found
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
 *                   example: Sport not found
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
router.post("/updatesport", upload.single("sportLogo"), updateSportS3, updateSport);
/**
 * @swagger
 * /api/v1/getallsports:
 *   get:
 *     summary: Get all sports
 *     description: Retrieve a list of all sports
 *     tags: [Sport]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Success
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
 *                         type: integer
 *                         description: ID of the sport
 *                       sportName:
 *                         type: string
 *                         description: Name of the sport
 *                       sportDescription:
 *                         type: string
 *                         description: Description of the sport
 *                       sportLogo:
 *                         type: string
 *                         description: URL of the sport's logo
 *                       isActive:
 *                         type: boolean
 *                         description: Whether the sport is active or not
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
// Define the route with the page parameter
router.get("/getallsports", getAllSport);

/**
 * @swagger
 * /api/v1/getsport/{id}:
 *   get:
 *     summary: Get sport data by ID
 *     description: Retrieves sport data based on the provided ID
 *     tags: [Sport]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the sport
 *         schema:
 *           type: integer
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful retrieval of sport data
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
 *                   description: Sport data
 *       '400':
 *         description: Sport data not found
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

router.get("/getsport/:id", auth.authorization, singleSport);

module.exports = router;
