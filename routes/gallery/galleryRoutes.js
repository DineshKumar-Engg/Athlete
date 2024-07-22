const express = require("express");
const router = express.Router();
const multer = require("multer");
const auth = require("../../utills/auth");
const { uploadS3, updateS3, deleteFileS3, uploadS3Multiple, uploadMobileWebS3, updateMobileWebS3 } = require("../../middlewares/s3");
const { uploadSingleFile, updateSingleFile, deleteFile, uploadMultipleFiles, galleryIsActive, getAllFiles, getGallery, galleryIsApprove } = require("../../controllers/gallery/galleryController");
const upload = multer({ limits: { fileSize: 3072 * 1024 * 1024 } });

/**
 * @swagger
 * tags:
 *   name: Gallery
 *   description: Operations related to Gallery management
 */
/**
 * @swagger
 * /api/v1/upload-singlefile:
 *   post:
 *     summary: Upload a single file
 *     description: Uploads a single file and creates a gallery entry
 *     tags: [Gallery]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fileLocation:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload
 *               description:
 *                 type: string
 *                 description: Description of the file
 *               isActive:
 *                 type: boolean
 *                 description: Specifies if the file is active
 *               fileType:
 *                 type: string
 *                 description: Type of the file
 *               isApproved:
 *                 type: boolean
 *                 description: Specifies if the file is approved
 *     responses:
 *       '201':
 *         description: Gallery file created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   description: HTTP status code
 *                   example: 201
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: Gallery file created
 *       '400':
 *         description: Invalid input or missing file URL
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
 *                   example: File URL is missing
 *       '401':
 *         description: Not authorized
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
 *                   example: Not authorized
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

router.post("/upload-singlefile", auth.authorization, upload.single("fileLocation"), uploadS3, uploadSingleFile);
router.post("/upload-singlefiletest", auth.authorization, upload.single("fileLocation"), uploadMobileWebS3, uploadSingleFile);
/**
 * @swagger
 * /api/v1/update-file:
 *   post:
 *     summary: Update a file
 *     description: Update the details of a file in the gallery
 *     tags: [Gallery]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fileLocation:
 *                 type: string
 *                 format: binary
 *                 description: The updated file to upload
 *               id:
 *                 type: string
 *                 description: ID of the file to update
 *               description:
 *                 type: string
 *                 description: New description of the file
 *               isActive:
 *                 type: boolean
 *                 description: Specifies if the file is active
 *               fileType:
 *                 type: string
 *                 description: New type of the file
 *               isApproved:
 *                 type: boolean
 *                 description: Specifies if the file is approved
 *     responses:
 *       '200':
 *         description: File updated successfully
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
 *                   example: Data updated successfully
 *       '400':
 *         description: Invalid input or missing file URL
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
 *                   example: File URL is missing
 *       '401':
 *         description: Not authorized or provided file ID is invalid
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
 *                   example: Not Authorized
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
 *                   example: Internal Server Error
 */

router.post("/update-file", auth.authorization, upload.single("fileLocation"), updateS3, updateSingleFile);
router.post("/updatefiletwoplatforms", auth.authorization, upload.single("fileLocation"), updateMobileWebS3, updateSingleFile);
/**
 * @swagger
 * /api/v1/delete-file/{fileId}:
 *   post:
 *     summary: Delete a file
 *     description: Delete a file from the gallery by its ID
 *     tags: [Gallery]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         description: ID of the file to delete
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: File deleted successfully
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
 *                   example: File deleted successfully
 *       '404':
 *         description: File not found or already deleted
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
 *                   example: File not found or already deleted
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
 *                   example: Internal Server Error
 */

router.post("/delete-file/:fileId", auth.authorization, deleteFileS3, deleteFile);
/**
 * @swagger
 * /api/v1/upload-multiplefiles:
 *   post:
 *     summary: Upload multiple files
 *     description: Upload multiple files to the gallery
 *     tags: [Gallery]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fileLocation:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of file locations
 *               description:
 *                 type: string
 *                 description: Description of the files
 *                 example: A collection of images
 *               isActive:
 *                 type: boolean
 *                 description: Status of the files
 *                 example: true
 *               fileType:
 *                 type: string
 *                 description: Type of the files
 *                 example: image
 *     responses:
 *       '201':
 *         description: Gallery files created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   description: HTTP status code
 *                   example: 201
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: Gallery files created
 *       '400':
 *         description: Invalid input
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
 *                   example: File URLs are missing
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
 *                   example: Failed to create some gallery files
 */

router.post("/upload-multiplefiles", auth.authorization, upload.array("fileLocation", 5), uploadS3Multiple, uploadMultipleFiles);
/**
 * @swagger
 * /galleryisactive/{id}:
 *   post:
 *     summary: Update gallery file status
 *     description: Update the status of a gallery file (active/inactive)
 *     tags: [Gallery]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the gallery file
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
 *                 description: New status of the gallery file
 *                 example: true
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
 *                   example: Status updated successfully
 *       '404':
 *         description: Gallery file not found
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
 *                   example: Gallery file not found
 *       '409':
 *         description: Status not changed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   description: HTTP status code
 *                   example: 409
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: Status not changed. It's already set to the same value.
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

router.post("/galleryisactive/:id", auth.authorization, galleryIsActive);
router.post("/galleryisapprove/:id", auth.authorization, galleryIsApprove);
/**
 * @swagger
 * /get-allfiles:
 *   get:
 *     summary: Get all gallery files with user data
 *     description: Retrieve all gallery files stored in the system along with corresponding user data
 *     tags: [Gallery]
 *     security:
 *       - bearerAuth: []
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
 *                   description: HTTP status code
 *                   example: 200
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: Success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       galleryData:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             description: ID of the gallery file
 *                           userId:
 *                             type: integer
 *                             description: ID of the user who uploaded the file
 *                           description:
 *                             type: string
 *                             description: Description of the file
 *                           isActive:
 *                             type: boolean
 *                             description: Indicates whether the file is active or not
 *                           fileType:
 *                             type: string
 *                             description: Type of the file
 *                           isApproved:
 *                             type: boolean
 *                             description: Indicates whether the file is approved or not
 *                           fileLocation:
 *                             type: string
 *                             description: URL of the file location
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             description: Date and time when the file was created
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             description: Date and time when the file was last updated
 *                       userData:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             description: ID of the user
 *                           firstName:
 *                             type: string
 *                             description: First name of the user
 *                           lastName:
 *                             type: string
 *                             description: Last name of the user
 *                           email:
 *                             type: string
 *                             format: email
 *                             description: Email address of the user
 *                           profileImg:
 *                             type: string
 *                             description: URL of the user's profile image
 *                           roleId:
 *                             type: integer
 *                             description: ID of the user's role
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             description: Date and time when the user was created
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             description: Date and time when the user was last updated
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

router.get("/get-allfiles", auth.authorization, getAllFiles);
/**
 * @swagger
 * /api/v1/get-files/{id}:
 *   get:
 *     summary: Get gallery data by ID
 *     description: Retrieves gallery data based on the provided ID
 *     tags: [Gallery]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the gallery
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successful retrieval of gallery data
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
 *                   description: Gallery data
 *       '400':
 *         description: Gallery data not found
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

router.get("/get-files/:id", auth.authorization, getGallery);
module.exports = router;
