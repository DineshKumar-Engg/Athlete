const express = require("express");
const router = express.Router();
const auth = require("../../utills/auth");
const { adminAddAthlete, deleteAthlete, updateAthlete, getAllAthlete, registerAthlete, athleteIsPublish, getAthlete, athleteIsApprove, searchCoach, searchAcademies } = require("../../controllers/athlete/athleteController");

// Athlete
/**
 * @swagger
 * tags:
 *   name: Athlete
 *   description: Operations related to admin management
 */
/**
 * @swagger
 * /api/v1/admin-addathlete:
 *   post:
 *     summary: Add a new athlete by admin
 *     description: Add a new athlete profile by an admin user
 *     tags: [Athlete]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               profileImg:
 *                 type: string
 *               age:
 *                 type: integer
 *               gender:
 *                 type: string
 *               city:
 *                 type: string
 *               residentialState:
 *                 type: string
 *               school:
 *                 type: string
 *               bio:
 *                 type: string
 *               achievements:
 *                 type: string
 *               parentFirstName:
 *                 type: string
 *               parentLastName:
 *                 type: string
 *               parentEmail:
 *                 type: string
 *               parentPhone:
 *                 type: string
 *               parentConsent:
 *                 type: boolean
 *               instagramLink:
 *                 type: string
 *               twitterLink:
 *                 type: string
 *               sportId:
 *                 type: integer
 *               subscriptionId:
 *                 type: integer
 *     responses:
 *       '200':
 *         description: Athlete added successfully
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
 *                   example: Athlete added successfully
 *                   description: Response message
 *       '401':
 *         description: Unauthorized user
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
 *       '409':
 *         description: User already exists
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

router.post("/admin-addathlete", auth.authorization, adminAddAthlete);
/**
 * @swagger
 * /api/v1/registerathlete:
 *   post:
 *     summary: Register Athlete
 *     description: Register a new athlete
 *     tags: [Athlete]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: First name of the athlete
 *               lastName:
 *                 type: string
 *                 description: Last name of the athlete
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email of the athlete
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Password of the athlete
 *               profileImg:
 *                 type: string
 *                 description: Profile image URL of the athlete
 *               age:
 *                 type: integer
 *                 description: Age of the athlete
 *               gender:
 *                 type: string
 *                 description: Gender of the athlete
 *               city:
 *                 type: string
 *                 description: City of the athlete
 *               residentialState:
 *                 type: string
 *                 description: Residential state of the athlete
 *               school:
 *                 type: string
 *                 description: School of the athlete
 *               bio:
 *                 type: string
 *                 description: Bio of the athlete
 *               achievements:
 *                 type: string
 *                 description: Achievements of the athlete
 *               parentFirstName:
 *                 type: string
 *                 description: First name of the parent/guardian
 *               parentLastName:
 *                 type: string
 *                 description: Last name of the parent/guardian
 *               parentEmail:
 *                 type: string
 *                 format: email
 *                 description: Email of the parent/guardian
 *               parentPhone:
 *                 type: string
 *                 description: Phone number of the parent/guardian
 *               parentConsent:
 *                 type: boolean
 *                 description: Whether the parent/guardian has given consent
 *               instagramLink:
 *                 type: string
 *                 description: Instagram link of the athlete
 *               twitterLink:
 *                 type: string
 *                 description: Twitter link of the athlete
 *               sportId:
 *                 type: integer
 *                 description: ID of the sport associated with the athlete
 *               subscriptionId:
 *                 type: integer
 *                 description: ID of the subscription associated with the athlete
 *     responses:
 *       '200':
 *         description: Athlete added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: Athlete added successfully
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
 *                   example: Internal server error
 */
router.post("/registerathlete", registerAthlete);
/**
 * @swagger
 * /api/v1/deleteathlete/{id}:
 *   post:
 *     summary: Delete Athlete
 *     description: Delete an athlete by ID
 *     tags: [Athlete]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the athlete to delete
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Athlete deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: Athlete deleted successfully
 *       '401':
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: User not found
 *       '404':
 *         description: Athlete already deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: Athlete already deleted
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
 *                   example: Internal server error
 */
router.post("/deleteathlete/:id", auth.authorization, deleteAthlete);
/**
 * @swagger
 * /api/v1/updateathlete:
 *   post:
 *     summary: Update athlete information
 *     description: Update existing athlete information with the provided data
 *     tags: [Athlete]
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
 *                 description: ID of the athlete to be updated
 *               firstName:
 *                 type: string
 *                 description: First name of the athlete
 *               lastName:
 *                 type: string
 *                 description: Last name of the athlete
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the athlete
 *               profileImg:
 *                 type: string
 *                 description: Profile image URL of the athlete
 *               age:
 *                 type: integer
 *                 description: Age of the athlete
 *               gender:
 *                 type: string
 *                 description: Gender of the athlete
 *               bio:
 *                 type: string
 *                 description: Bio or description of the athlete
 *               city:
 *                 type: string
 *                 description: City where the athlete resides
 *               achievements:
 *                 type: string
 *                 description: Achievements of the athlete
 *               residentialState:
 *                 type: string
 *                 description: Residential state of the athlete
 *               school:
 *                 type: string
 *                 description: School attended by the athlete
 *               parentFirstName:
 *                 type: string
 *                 description: First name of the athlete's parent
 *               parentLastName:
 *                 type: string
 *                 description: Last name of the athlete's parent
 *               parentEmail:
 *                 type: string
 *                 format: email
 *                 description: Email address of the athlete's parent
 *               parentPhone:
 *                 type: string
 *                 description: Phone number of the athlete's parent
 *               parentConsent:
 *                 type: boolean
 *                 description: Parental consent for the athlete
 *               instagramLink:
 *                 type: string
 *                 description: Instagram link of the athlete
 *               twitterLink:
 *                 type: string
 *                 description: Twitter link of the athlete
 *               sportId:
 *                 type: integer
 *                 description: ID of the sport associated with the athlete
 *               subscriptionId:
 *                 type: integer
 *                 description: ID of the subscription associated with the athlete
 *               isActive:
 *                 type: boolean
 *                 description: Status of the athlete (active/inactive)
 *     responses:
 *       '200':
 *         description: Athlete information updated successfully
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
 *         description: Unauthorized access or user not found
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
router.post("/updateathlete", auth.authorization, updateAthlete);
/**
 * @swagger
 * /api/v1/getallathlete:
 *   get:
 *     summary: Get all athlete details
 *     description: Retrieve details of all athletes
 *     tags: [Athlete]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully retrieved all athlete details
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
 *                       userData:
 *                         $ref: '#/components/schemas/User'
 *                       athleteData:
 *                         $ref: '#/components/schemas/Athlete'
 *                       sportData:
 *                         $ref: '#/components/schemas/Sport'
 *                       subscriptionData:
 *                         $ref: '#/components/schemas/Subscription'
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
router.get("/getallathlete", auth.authorization, getAllAthlete);
/**
 * @swagger
 * /api/v1/getathlete/{id}:
 *   get:
 *     summary: Get athlete details by ID
 *     description: Retrieves details of an athlete by their ID
 *     tags: [Athlete]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the athlete to retrieve
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   type: object
 *                   properties:
 *                     userData:
 *                       type: object
 *                       description: User data excluding password
 *                     athleteData:
 *                       type: object
 *                       description: Athlete profile data
 *                     roleData:
 *                       type: object
 *                       description: Role data of the athlete
 *                     sportData:
 *                       type: object
 *                       description: Sport data associated with the athlete
 *       '404':
 *         description: Athlete not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: Athlete not found
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

router.get("/getathlete/:id", auth.authorization, getAthlete);
/**
 * @swagger
 * /api/v1/athleteisactive/{id}:
 *   post:
 *     summary: Update athlete's activation status
 *     description: Update the activation status of an athlete by ID
 *     tags: [Athlete]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the athlete to update
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
 *         description: Athlete not found
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
 *                   example: Athlete not found
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
router.post("/athleteispublish/:id", auth.authorization, athleteIsPublish);
router.post("/athleteisapprove/:id", auth.authorization, athleteIsApprove);
router.get("/athletesearchcoach", auth.authorization, searchCoach);
router.get("/athletesearchacademies", auth.authorization, searchAcademies);

module.exports = router;
