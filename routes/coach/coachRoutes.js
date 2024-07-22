const express = require("express");
const router = express.Router();
const auth = require("../../utills/auth");
const { adminAddCoach, deleteCoach, updateCoach, getAllCoach, registerCoach, coachIsPublish, getCoach, coachIsApprove, searchAthlete } = require("../../controllers/coach/coachController");
// Coach
/**
 * @swagger
 * tags:
 *   name: Coach
 *   description: Operations related to Coach management
 */

/**
 * @swagger
 * /api/v1/admin-addcoach:
 *   post:
 *     summary: Add a new coach by admin
 *     description: Add a new coach by admin with required information
 *     tags: [Coach]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: First name of the coach
 *               lastName:
 *                 type: string
 *                 description: Last name of the coach
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the coach
 *               password:
 *                 type: string
 *                 description: Password of the coach
 *               profileImg:
 *                 type: string
 *                 description: Profile image URL of the coach
 *               age:
 *                 type: integer
 *                 description: Age of the coach
 *               gender:
 *                 type: string
 *                 description: Gender of the coach
 *               bio:
 *                 type: string
 *                 description: Bio or description of the coach
 *               city:
 *                 type: string
 *                 description: City where the coach is located
 *               achievements:
 *                 type: string
 *                 description: Achievements of the coach
 *               state:
 *                 type: string
 *                 description: State where the coach is located
 *               instagramLink:
 *                 type: string
 *                 description: Instagram link of the coach
 *               twitterLink:
 *                 type: string
 *                 description: Twitter link of the coach
 *               sportId:
 *                 type: integer
 *                 description: ID of the sport associated with the coach
 *     responses:
 *       '200':
 *         description: Coach added successfully
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
 *                   example: Coach added successfully
 *                   description: Success message
 *       '400':
 *         description: User already exists or other validation errors
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
 *                   example: User already exists
 *                   description: Error message
 *       '401':
 *         description: Unauthorized user or invalid token
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
 *                   example: Unauthorized user
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
router.post("/admin-addcoach", auth.authorization, adminAddCoach);

/**
 * @swagger
 * /api/v1/registercoach:
 *   post:
 *     summary: Register a new coach
 *     description: Register a new coach with required information
 *     tags: [Coach]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: First name of the coach
 *               lastName:
 *                 type: string
 *                 description: Last name of the coach
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the coach
 *               password:
 *                 type: string
 *                 description: Password of the coach
 *               profileImg:
 *                 type: string
 *                 description: Profile image URL of the coach
 *               age:
 *                 type: integer
 *                 description: Age of the coach
 *               gender:
 *                 type: string
 *                 description: Gender of the coach
 *               bio:
 *                 type: string
 *                 description: Bio or description of the coach
 *               city:
 *                 type: string
 *                 description: City where the coach is located
 *               achievements:
 *                 type: string
 *                 description: Achievements of the coach
 *               state:
 *                 type: string
 *                 description: State where the coach is located
 *               instagramLink:
 *                 type: string
 *                 description: Instagram link of the coach
 *               twitterLink:
 *                 type: string
 *                 description: Twitter link of the coach
 *               sportId:
 *                 type: integer
 *                 description: ID of the sport associated with the coach
 *     responses:
 *       '200':
 *         description: Coach registered successfully
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
 *                   example: Coach added successfully
 *                   description: Success message
 *       '400':
 *         description: User already exists or other validation errors
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
 *                   example: User already exists
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
router.post("/registercoach", registerCoach);
/**
 * @swagger
 * /api/v1/deletecoach/{id}:
 *   post:
 *     summary: Delete a coach
 *     description: Delete a coach by ID
 *     tags: [Coach]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the coach to delete
 *     responses:
 *       '200':
 *         description: Coach deleted successfully
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
 *                   example: Coach deleted successfully
 *                   description: Success message
 *       '404':
 *         description: Coach already deleted or not found
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
 *                   example: Coach already deleted
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
router.post("/deletecoach/:id", auth.authorization, deleteCoach);
/**
 * @swagger
 * /api/v1/updatecoach:
 *   post:
 *     summary: Update coach details
 *     description: Update coach details by ID
 *     tags: [Coach]
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
 *                 description: ID of the coach to update
 *               firstName:
 *                 type: string
 *                 description: First name of the coach
 *               lastName:
 *                 type: string
 *                 description: Last name of the coach
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the coach
 *               profileImg:
 *                 type: string
 *                 description: Profile image URL of the coach
 *               age:
 *                 type: integer
 *                 description: Age of the coach
 *               gender:
 *                 type: string
 *                 description: Gender of the coach
 *               bio:
 *                 type: string
 *                 description: Bio or description of the coach
 *               city:
 *                 type: string
 *                 description: City where the coach is located
 *               achievements:
 *                 type: string
 *                 description: Achievements of the coach
 *               state:
 *                 type: string
 *                 description: State where the coach is located
 *               instagramLink:
 *                 type: string
 *                 description: Instagram link of the coach
 *               twitterLink:
 *                 type: string
 *                 description: Twitter link of the coach
 *               sportId:
 *                 type: integer
 *                 description: ID of the sport associated with the coach
 *               isActive:
 *                 type: boolean
 *                 description: Indicates if the coach is active or not
 *     responses:
 *       '200':
 *         description: Coach details updated successfully
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
 *         description: Not Authorized or coach not found
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
router.post("/updatecoach", auth.authorization, updateCoach);
/**
 * @swagger
 * /api/v1/getallcoach:
 *   get:
 *     summary: Get all coaches
 *     description: Retrieve all coaches
 *     tags: [Coach]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully retrieved all coaches
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
 *                   description: Array of connected coach data
 *                   items:
 *                     type: object
 *                     properties:
 *                       userData:
 *                         type: object
 *                         description: User data excluding password
 *                       coachData:
 *                         type: object
 *                         description: Coach data
 *                       sportData:
 *                         type: object
 *                         description: Sport data associated with the coach
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
router.get("/getallcoach", auth.authorization, getAllCoach);
/**
 * @swagger
 * /api/v1/getcoach/{id}:
 *   get:
 *     summary: Get details of a Coach by ID
 *     description: Retrieve details of a Coach by its ID, including user data, coach data, role data, and sport data.
 *     tags: [Coach]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the Coach to retrieve details for
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successfully retrieved Coach details
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
 *                   type: object
 *                   properties:
 *                     userData:
 *                       $ref: '#/components/schemas/User'
 *                     coachData:
 *                       $ref: '#/components/schemas/Coach'
 *                     roleData:
 *                       $ref: '#/components/schemas/Role'
 *                     sportData:
 *                       $ref: '#/components/schemas/Sport'
 *       '404':
 *         description: Coach or related data not found
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
 *                   example: Coach not found
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
router.get("/getcoach/:id", auth.authorization, getCoach);
/**
 * @swagger
 * /api/v1/coachisactive/{id}:
 *   post:
 *     summary: Update the active status of a Coach
 *     description: Update the active status of a Coach by ID
 *     tags: [Coach]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the Coach to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isActive:
 *                 type: boolean
 *     responses:
 *       '200':
 *         description: Status updated successfully
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
 *                   example: Status updated successfully
 *                   description: Response message
 *       '404':
 *         description: Coach not found
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
 *                   example: Coach not found
 *                   description: Error message
 *       '409':
 *         description: Status not changed. It's already set to the same value.
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
 *                   example: Status not changed. It's already set to the same value.
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
router.post("/coachispublish/:id", auth.authorization, coachIsPublish);
/**
 * @swagger
 * /api/v1/coachisapprove/{id}:
 *   post:
 *     summary: Update Coach approval status
 *     description: Update the approval status of a Coach
 *     tags: [Coach]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the Coach to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isApprove:
 *                 type: string
 *                 enum: [Pending, Reject, Approve]
 *                 description: Approval status
 *                 example: Approve
 *     responses:
 *       '200':
 *         description: Status updated successfully
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
 *                   example: Approve status updated
 *       '404':
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   description: HTTP status code
 *                   example: 404
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: Coach not found
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

router.post("/coachisapprove/:id", auth.authorization, coachIsApprove);
router.get("/coachsearchathlete", auth.authorization, searchAthlete);

module.exports = router;
