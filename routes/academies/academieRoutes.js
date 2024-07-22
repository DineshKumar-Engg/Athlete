const express = require("express");
const router = express.Router();
const auth = require("../../utills/auth");
const { adminAddAcademies, deleteAcademies, updateAcademies, getAllAcademies, registerAcademies, academieIsPublish, getAcademies, academieIsApprove } = require("../../controllers/academies/academiesController");
// Academies

/**
 * @swagger
 * tags:
 *   name: Academies & Clubs
 *   description: Operations related to Academies and Clubs management
 */

/**
 * @swagger
 * /api/v1/admin-addacademies:
 *   post:
 *     summary: Add new academies or clubs by admin
 *     description: Add new academies or clubs by admin with required information
 *     tags: [Academies & Clubs]
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
 *                 description: First name of the admin user
 *               lastName:
 *                 type: string
 *                 description: Last name of the admin user
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the admin user
 *               password:
 *                 type: string
 *                 description: Password of the admin user
 *               profileImg:
 *                 type: string
 *                 description: Profile image URL of the admin user
 *               academieName:
 *                 type: string
 *                 description: Name of the academy or club
 *               title:
 *                 type: string
 *                 description: Title of the academy or club
 *               bio:
 *                 type: string
 *                 description: Bio or description of the academy or club
 *               city:
 *                 type: string
 *                 description: City where the academy or club is located
 *               state:
 *                 type: string
 *                 description: State where the academy or club is located
 *               leagueName:
 *                 type: string
 *                 description: Name of the league associated with the academy or club
 *               ageYouCoach:
 *                 type: string
 *                 description: Name of the ageYouCoach associated with the academy or club
 *               genderYouCoach:
 *                 type: string
 *                 description: Name of the genderYouCoach associated with the academy or club
 *               instagramLink:
 *                 type: string
 *                 description: Instagram link of the academy or club
 *               twitterLink:
 *                 type: string
 *                 description: Twitter link of the academy or club
 *               sportId:
 *                 type: integer
 *                 description: ID of the sport associated with the academy or club
 *               subscriptionId:
 *                 type: integer
 *                 description: ID of the subscription associated with the academy or club
 *     responses:
 *       '200':
 *         description: Academy or club added successfully
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
 *                   example: Academie/club added successfully
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
router.post("/admin-addacademies", auth.authorization, adminAddAcademies);
/**
 * @swagger
 * /api/v1/registeracademies:
 *   post:
 *     summary: Register Academies or Clubs
 *     description: Register new Academies or Clubs with required information
 *     tags: [Academies & Clubs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: First name of the admin user
 *               lastName:
 *                 type: string
 *                 description: Last name of the admin user
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the admin user
 *               password:
 *                 type: string
 *                 description: Password of the admin user
 *               profileImg:
 *                 type: string
 *                 description: Profile image URL of the admin user
 *               academieName:
 *                 type: string
 *                 description: Name of the academy or club
 *               title:
 *                 type: string
 *                 description: Title of the academy or club
 *               bio:
 *                 type: string
 *                 description: Bio or description of the academy or club
 *               city:
 *                 type: string
 *                 description: City where the academy or club is located
 *               state:
 *                 type: string
 *                 description: State where the academy or club is located
 *               leagueName:
 *                 type: string
 *                 description: Name of the league associated with the academy or club
 *               instagramLink:
 *                 type: string
 *                 description: Instagram link of the academy or club
 *               twitterLink:
 *                 type: string
 *                 description: Twitter link of the academy or club
 *               sportId:
 *                 type: integer
 *                 description: ID of the sport associated with the academy or club
 *               subscriptionId:
 *                 type: integer
 *                 description: ID of the subscription associated with the academy or club
 *     responses:
 *       '200':
 *         description: Academy or club added successfully
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
 *                   example: Academie/club added successfully
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
router.post("/registeracademies", registerAcademies);
/**
 * @swagger
 * /api/v1/deleteacademies/{id}:
 *   post:
 *     summary: Delete Academies/Club
 *     description: Delete Academies/Club by ID
 *     tags: [Academies & Clubs]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the Academies/Club to delete
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Academies/Club deleted successfully
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
 *                   example: Academies/Club deleted successfully
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
 *       '404':
 *         description: Academies/Club already deleted or not found
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
 *                   example: Academies/Club already deleted
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
router.post("/deleteacademies/:id", auth.authorization, deleteAcademies);
/**
 * @swagger
 * /api/v1/updateacademies:
 *   post:
 *     summary: Update Academies/Club
 *     description: Update Academies/Club information
 *     tags: [Academies & Clubs]
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
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               profileImg:
 *                 type: string
 *               academieName:
 *                 type: string
 *               title:
 *                 type: string
 *               bio:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               leagueName:
 *                 type: string
 *               instagramLink:
 *                 type: string
 *               twitterLink:
 *                 type: string
 *               sportId:
 *                 type: integer
 *               subscriptionId:
 *                 type: integer
 *               isActive:
 *                 type: boolean
 *     responses:
 *       '200':
 *         description: Data updated successfully
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
router.post("/updateacademies", auth.authorization, updateAcademies);
/**
 * @swagger
 * /api/v1/getallacademies:
 *   get:
 *     summary: Get all Academies/Club
 *     description: Retrieve information about all Academies/Club
 *     tags: [Academies & Clubs]
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
 *                       userData:
 *                         type: object
 *                         description: User data
 *                       academieData:
 *                         type: object
 *                         description: Academie/Club data
 *                       sportData:
 *                         type: object
 *                         description: Sport data
 *                       subscriptionData:
 *                         type: object
 *                         description: Subscription data
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
router.get("/getallacademies", auth.authorization, getAllAcademies);
/**
 * @swagger
 * /api/v1/getacademies/{id}:
 *   get:
 *     summary: Get details of an Academie/Club by ID
 *     description: Retrieve details of an Academie/Club by its ID, including user data, academie data, role data, and sport data.
 *     tags: [Academies & Clubs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the Academie/Club to retrieve details for
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successfully retrieved Academie/Club details
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
 *                     academieData:
 *                       $ref: '#/components/schemas/Academie'
 *                     roleData:
 *                       $ref: '#/components/schemas/Role'
 *                     sportData:
 *                       $ref: '#/components/schemas/Sport'
 *       '404':
 *         description: Academie/Club or related data not found
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
 *                   example: Academie/Club not found
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
router.get("/getacademies/:id", auth.authorization, getAcademies);
/**
 * @swagger
 * /api/v1/academieisactive/{id}:
 *   post:
 *     summary: Update the active status of an Academies & Clubs
 *     description: Update the active status of an Academies & Clubs by ID
 *     tags: [Academies & Clubs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the Academies & Clubs to update
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
 *         description: Academie/Club not found
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
 *                   example: Academie/Club not found
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

router.post("/academieispublish/:id", auth.authorization, academieIsPublish);
/**
 * @swagger
 * /api/v1/academieisapprove/{id}:
 *   post:
 *     summary: Update Academie approval status
 *     description: Update the approval status of an Academie
 *     tags: [Academie]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the Academie to update
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
 *                   example: Academie not found
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

router.post("/academieisapprove/:id", auth.authorization, academieIsApprove);
module.exports = router;
