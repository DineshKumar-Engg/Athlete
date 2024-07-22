const cmsGalleryModel = require("../models/cms/cmsGalleryModel");
const AWS = require("aws-sdk");

// Configure AWS SDK with credentials and region
AWS.config.update({
  accessKeyId: process.env.IAM_USER_KEY,
  secretAccessKey: process.env.IAM_USER_SECRET
});

const s3 = new AWS.S3();
exports.uploadS3Multiple = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ status: 400, message: "No files uploaded" });
    }
    const fileUrls = [];
    // Iterate over each file uploaded
    for (const file of req.files) {
      const { originalname, buffer } = file;
      const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: `${Date.now().toString()}-${originalname}`,
        Body: buffer,
        ACL: "public-read"
      };
      // Upload file to S3
      const data = await s3.upload(params).promise();
      console.log("File uploaded successfully", data);
      fileUrls.push(data.Location);
    }
    // Set the file in the request object
    req.fileUrls = fileUrls;
    next();
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
// exports.updateS3 = async (req, res, next) => {
//   try {
//     req.fileUpdates = req.fileUpdates || [];

//     if (req.files && req.files.length > 0) {
//       const fileUpdates = [];

//       for (const file of req.files) {
//         const existingFileId = req.body.data.cmsgalleries.find(g => g.fileLocation === file.originalname)?.id;
//         if (!existingFileId) continue;

//         const existingFile = await cmsGalleryModel.findOne({ where: { id: existingFileId } });

//         if (!existingFile) {
//           return res.status(400).json({ status: 400, message: `File with ID ${existingFileId} not found in database` });
//         }

//         const key = existingFile.fileLocation.split("/").pop();
//         const deleteParams = {
//           Bucket: process.env.BUCKET_NAME,
//           Key: key
//         };
//         await s3.deleteObject(deleteParams).promise();

//         const newFileName = `${Date.now().toString()}-${file.originalname}`;
//         const uploadParams = {
//           Bucket: process.env.BUCKET_NAME,
//           Key: newFileName,
//           Body: file.buffer,
//           ACL: "public-read"
//         };
//         const data = await s3.upload(uploadParams).promise();
//         fileUpdates.push({ id: existingFileId, fileLocation: data.Location });
//       }

//       req.fileUpdates = fileUpdates;
//     }

//     next();
//   } catch (error) {
//     console.error("Error updating file:", error);
//     return res.status(500).json({ status: 500, message: "Internal Server Error" });
//   }
// };
// exports.updateS3 = async (req, res, next) => {
//   try {
//     req.fileUpdates = req.fileUpdates || [];

//     if (req.files && req.files.length > 0) {
//       const fileUpdates = [];

//       for (const file of req.files) {
//         const existingFileId = req.body.data.cmsgalleries.find(g => g.fileLocation.includes(file.originalname))?.id;
//         if (!existingFileId) continue;

//         const existingFile = await cmsGalleryModel.findOne({ where: { id: existingFileId } });

//         if (!existingFile) {
//           return res.status(400).json({ status: 400, message: `File with ID ${existingFileId} not found in database` });
//         }

//         const key = existingFile.fileLocation.split("/").pop();
//         const deleteParams = {
//           Bucket: process.env.BUCKET_NAME,
//           Key: key
//         };
//         await s3.deleteObject(deleteParams).promise();

//         const newFileName = `${Date.now().toString()}-${file.originalname}`;
//         const uploadParams = {
//           Bucket: process.env.BUCKET_NAME,
//           Key: newFileName,
//           Body: file.buffer,
//           ACL: "public-read"
//         };
//         const data = await s3.upload(uploadParams).promise();
//         fileUpdates.push({ id: existingFileId, fileLocation: data.Location });
//       }

//       req.fileUpdates = fileUpdates;
//     }

//     next();
//   } catch (error) {
//     console.error("Error updating file:", error);
//     return res.status(500).json({ status: 500, message: "Internal Server Error" });
//   }
// };
exports.updateS3 = async (req, res, next) => {
  try {
    req.fileUpdates = req.fileUpdates || [];

    if (req.files && req.files.length > 0) {
      const fileUpdates = [];

      for (const file of req.files) {
        const galleryItem = req.body.data.cmsgalleries.find(g => {
          // Check if fileLocation is a string (URL) or a File object
          return typeof g.fileLocation === "object" && g.fileLocation.name === file.originalname;
        });
        if (!galleryItem) continue;
        const existingFileId = galleryItem.id;

        const existingFile = await cmsGalleryModel.findOne({ where: { id: existingFileId } });

        if (!existingFile) {
          return res.status(400).json({ status: 400, message: `File with ID ${existingFileId} not found in database` });
        }

        const key = existingFile.fileLocation.split("/").pop();
        const deleteParams = {
          Bucket: process.env.BUCKET_NAME,
          Key: key
        };
        await s3.deleteObject(deleteParams).promise();

        const newFileName = `${Date.now().toString()}-${file.originalname}`;
        const uploadParams = {
          Bucket: process.env.BUCKET_NAME,
          Key: newFileName,
          Body: file.buffer,
          ACL: "public-read"
        };
        const data = await s3.upload(uploadParams).promise();
        fileUpdates.push({ id: existingFileId, fileLocation: data.Location });
      }

      req.fileUpdates = fileUpdates;
    }

    next();
  } catch (error) {
    console.error("Error updating file:", error);
    return res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
};

exports.uploadExactS3Multiple = async (req, res, next) => {
  try {
    console.log("Request body:", req.body); // Add this line to log the request body

    if (!req.files || !req.files.length) {
      return res.status(400).json({ status: 400, message: "Please send at least one file" });
    }

    // Parse cmsgalleries from the request body
    let cmsgalleries;
    try {
      cmsgalleries = JSON.parse(req.body.cmsgalleries);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ status: 400, message: "cmsgalleries should be a valid JSON array" });
    }

    if (!Array.isArray(cmsgalleries)) {
      return res.status(400).json({ status: 400, message: "cmsgalleries should be an array" });
    }

    cmsgalleries = cmsgalleries.map((fileData, index) => ({
      ...fileData,
      file: req.files[index]
    }));

    const updatePromises = cmsgalleries.map(async (fileData) => {
      const { id, cmId, file, fileLocation } = fileData;

      if (!file) {
        return res.status(400).json({ status: 400, message: `File data missing for ${fileLocation}` });
      }

      const existingFile = await cmsGalleryModel.findOne({
        where: { id, cmId }
      });

      if (!existingFile) {
        return res.status(404).json({ status: 404, message: `File not found for id ${id} and cmId ${cmId}` });
      }

      // Delete the existing file from S3
      const key = existingFile.fileLocation.split("/").pop();
      const deleteParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: key
      };
      await s3.deleteObject(deleteParams).promise();

      // Upload the new file to S3
      const newFileName = `${Date.now().toString()}-${file.originalname}`;
      const uploadParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: newFileName,
        Body: file.buffer,
        ACL: "public-read"
      };
      const data = await s3.upload(uploadParams).promise();

      // Update the file location in the database
      await existingFile.update({ fileLocation: data.Location });

      return data.Location; // Return the new file URL
    });

    const updatedFileLocations = await Promise.all(updatePromises);

    req.updatedFileLocations = updatedFileLocations; // Pass the updated file locations to the next middleware

    next();
  } catch (error) {
    console.error("Error updating files:", error);
    return res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
};
