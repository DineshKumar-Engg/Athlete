const express = require("express");
const router = express.Router();
const multer = require("multer");
const auth = require("../../utills/auth");
const upload = multer({ limits: { fileSize: 100 * 1024 * 1024 } });
const { uploadS3Multiple, updateS3, uploadExactS3Multiple } = require("../../middlewares/cmss3");
const { createPageGallery, deletePage, getAllPages, getPage, updatePage, pageIsPublished, uploadExactMultipleFiles, deletePageImage } = require("../../controllers/cms/cmsControllers");

router.post("/deletepage/:id", auth.authorization, deletePage);
router.post("/deletepageimage/:id", auth.authorization, deletePageImage);
router.post("/updatepage", auth.authorization, upload.array("fileLocation", 20), updateS3, updatePage);
router.post("/updateexactfiles", auth.authorization, upload.array("fileLocation", 20), uploadExactS3Multiple, uploadExactMultipleFiles);
//
router.post("/addsectionimage", auth.authorization, upload.array("fileLocation", 5), uploadS3Multiple, createPageGallery); // createPage
router.get("/getall-page", auth.authorization, getAllPages);
router.get("/getpage/:id", getPage);
router.post("/pageis-publish/:id", auth.authorization, pageIsPublished);
module.exports = router;
