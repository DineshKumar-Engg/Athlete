const galleryModel = require("../models/gallery/galleryModel");
const sportsModel = require("../models/common/sportsModel");
const AWS = require("aws-sdk");
// Configure AWS SDK with credentials and region
AWS.config.update({
  accessKeyId: process.env.IAM_USER_KEY,
  secretAccessKey: process.env.IAM_USER_SECRET
});

const s3 = new AWS.S3();

exports.uploadS3 = async (req, res, next) => {
  try {
    console.log("req.file", req.file);
    if (!req.file) {
      // return res.status(400).json({ status: 400, message: "No file uploaded" });
      req.fileUrl = null;
      return next();
    }

    const { originalname, buffer } = req.file;
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: `${Date.now().toString()}-${originalname}`,
      Body: buffer,
      ACL: "public-read"
    };

    s3.upload(params, (err, data) => {
      if (err) {
        console.error("Error uploading file to S3:", err);
        return res
          .status(500)
          .json({
            status: 500,
            message: "Error occurred while uploading the file"
          });
      }
      console.log("File uploaded successfully:", data);
      req.fileUrl = data.Location;
      next();
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
exports.uploadMobileWebS3 = async (req, res, next) => {
  try {
    if (req.file) {
      console.log("req.file", req.file);
      if (!req.file) {
        return res
          .status(400)
          .json({ status: 400, message: "No file uploaded" });
      }

      const { originalname, buffer } = req.file;
      const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: `${Date.now().toString()}-${originalname}`,
        Body: buffer,
        ACL: "public-read"
      };

      s3.upload(params, (err, data) => {
        if (err) {
          console.error("Error uploading file to S3:", err);
          return res
            .status(500)
            .json({
              status: 500,
              message: "Error occurred while uploading the file"
            });
        }
        console.log("File uploaded successfully:", data);
        req.fileUrl = data.Location;
        next();
      });
    } else {
      console.log(req.body.fileLocation);
      console.log(req.body);
      if (req.body.fileLocation) {
        const fileLocation = JSON.parse(req.body.fileLocation); // Parse the JSON string

        const { buffer, originalname } = fileLocation;

        // Convert buffer array to Buffer object
        const fileBuffer = Buffer.from(new Uint8Array(buffer));
        console.log("Image Type", req.body.ImageType);
        const params = {
          Bucket: process.env.BUCKET_NAME,
          Key: `${Date.now().toString()}-${originalname}`,
          // Body: Buffer.from(buffer),
          Body: fileBuffer,
          ACL: "public-read",
          ContentType: req.body.ImageType
        };

        s3.upload(params, (err, data) => {
          if (err) {
            console.error("Error uploading file to S3:", err);
            return res
              .status(500)
              .json({
                status: 500,
                message: "Error occurred while uploading the file"
              });
          }
          console.log("File uploaded successfully:", data);
          req.fileUrl = data.Location;
          next();
        });
      } else {
        return res
          .status(400)
          .json({
            status: 400,
            message: "No file uploaded or invalid location"
          });
      }
    }
  } catch (error) {
    console.error("Error:", error);
    // res.status(500).json({ status: 500, message: "Internal server error" });
    res.status(500).json({ status: 500, error:error.message });
  }
};

exports.updateMobileWebS3 = async (req, res, next) => {
  try {
    if (req.file) {
      console.log("req.file", req.file);
      if (!req.file) {
        return res
          .status(400)
          .json({ status: 400, message: "No file uploaded" });
      }

      // Retrieve the ID of the existing file from the request
      const existingFileId = req.body.id;
      console.log("existingFileId", existingFileId);

      // Retrieve existing file details from the database using the ID
      const existingFile = await galleryModel.findOne({
        where: { id: existingFileId }
      });
      console.log("existingFile", existingFile);

      // If the existing file is not found in the database, return an error
      if (!existingFile) {
        return res
          .status(400)
          .json({ status: 400, message: "File not found in database" });
      }
      const key = existingFile.fileLocation.split("/").pop();
      // Delete the existing file from the S3 bucket
      const deleteParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: key
      };
      await s3.deleteObject(deleteParams).promise();

      // Upload the new file to the S3 bucket
      const { buffer, originalname } = req.file;
      const newFileName = `${Date.now().toString()}-${originalname}`;
      const uploadParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: newFileName,
        Body: buffer,
        ACL: "public-read"
      };
      const data = await s3.upload(uploadParams).promise();
      console.log("File updated successfully:", data.Location);
      req.fileUrl = data.Location;
      next();
    } else {
      if (req.body.fileLocation) {
        // Retrieve the ID of the existing file from the request
        const existingFileId = req.body.id;
        console.log("existingFileId", existingFileId);

        // Retrieve existing file details from the database using the ID
        const existingFile = await galleryModel.findOne({
          where: { id: existingFileId }
        });
        console.log("existingFile", existingFile);

        // If the existing file is not found in the database, return an error
        if (!existingFile) {
          return res
            .status(400)
            .json({ status: 400, message: "File not found" });
        }
        const key = existingFile.fileLocation.split("/").pop();
        // Delete the existing file from the S3 bucket
        const deleteParams = {
          Bucket: process.env.BUCKET_NAME,
          Key: key
        };
        await s3.deleteObject(deleteParams).promise();

        // Upload the new file to the S3 bucket
        const fileLocation = JSON.parse(req.body.fileLocation); // Parse the JSON string

        const { buffer, originalname } = fileLocation;
        // Convert buffer array to Buffer object
        const fileBuffer = Buffer.from(new Uint8Array(buffer));

        const newFileName = `${Date.now().toString()}-${originalname}`;
        const uploadParams = {
          Bucket: process.env.BUCKET_NAME,
          Key: newFileName,
          Body: fileBuffer,
          ACL: "public-read",
          ContentType: req.body.ImageType
        };
        const data = await s3.upload(uploadParams).promise();
        console.log("File updated successfully:", data.Location);
        req.fileUrl = data.Location;
        next();
      } else {
        return res
          .status(400)
          .json({
            status: 400,
            message: "No file uploaded or invalid location"
          });
      }
    }
  } catch (error) {
    console.error("Error updating file:", error);
    if (error.code === "NoSuchKey") {
      return res
        .status(404)
        .json({ status: 404, message: "Existing file not found in S3" });
    } else {
      return res
        .status(500)
        .json({ status: 500, message: "Internal Server Error" });
    }
  }
};
// Update API on Mobile & Web
exports.updateS3 = async (req, res, next) => {
  try {
    // Check if a file was sent
    if (!req.file) {
      return res
        .status(400)
        .json({ status: 400, message: "Please send a file" });
    }

    // Retrieve the ID of the existing file from the request
    const existingFileId = req.body.id;
    console.log("existingFileId", existingFileId);

    // Retrieve existing file details from the database using the ID
    const existingFile = await galleryModel.findOne({
      where: { id: existingFileId }
    });
    console.log("existingFile", existingFile);

    // If the existing file is not found in the database, return an error
    if (!existingFile) {
      return res
        .status(400)
        .json({ status: 400, message: "File not found in database" });
    }
    const key = existingFile.fileLocation.split("/").pop();
    // Delete the existing file from the S3 bucket
    const deleteParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: key
    };
    await s3.deleteObject(deleteParams).promise();

    // Upload the new file to the S3 bucket
    const { buffer, originalname } = req.file;
    const newFileName = `${Date.now().toString()}-${originalname}`;
    const uploadParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: newFileName,
      Body: buffer,
      ACL: "public-read"
    };
    const data = await s3.upload(uploadParams).promise();
    console.log("File updated successfully:", data.Location);
    req.fileUrl = data.Location;
    next();
    // res.status(200).json({ status: 200, message: "File updated successfully", fileUrl: data.Location });
  } catch (error) {
    console.error("Error updating file:", error);
    if (error.code === "NoSuchKey") {
      return res
        .status(404)
        .json({ status: 404, message: "Existing file not found in S3" });
    } else {
      return res
        .status(500)
        .json({ status: 500, message: "Internal Server Error" });
    }
  }
};

exports.deleteFileS3 = async (req, res, next) => {
  try {
    // Retrieve the ID of the existing file from the request
    const existingFileId = req.params.fileId;
    console.log("existingFileId", existingFileId);

    // Retrieve existing file details from the database using the ID
    const existingFile = await galleryModel.findOne({
      where: { id: existingFileId }
    });
    console.log("existingFile", existingFile);

    // If the existing file is not found in the database, return an error
    if (!existingFile) {
      return res
        .status(400)
        .json({ status: 400, message: "File not found in database" });
    }

    // Extract the key (file name) from the existing file location
    const key = existingFile.fileLocation.split("/").pop();

    // Delete the existing file from the S3 bucket
    const deleteParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: key
    };
    await s3.deleteObject(deleteParams).promise();
    console.log("File deleted successfully");

    // Proceed to the next middleware
    next();
  } catch (error) {
    console.error("Error deleting file:", error);
    // Handle specific S3 error codes
    if (error.code === "NoSuchKey") {
      return res
        .status(404)
        .json({ status: 404, message: "File not found in S3 bucket" });
    } else {
      // Handle other errors
      return res
        .status(500)
        .json({ status: 500, message: "Internal Server Error" });
    }
  }
};
exports.uploadS3Multiple = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ status: 400, message: "No files uploaded" });
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
// Sport Update
exports.updateSportS3 = async (req, res, next) => {
  try {
    // Check if a file was sent
    if (!req.file) {
      req.fileUrl = req.body.sportLogo || null;
      return next();
    }

    // Retrieve the ID of the existing file from the request
    const existingFileId = req.body.id;
    console.log("existingFileId", existingFileId);

    // Retrieve existing file details from the database using the ID
    const existingFile = await sportsModel.findOne({
      where: { id: existingFileId }
    });
    console.log("existingFile", existingFile);

    // If the existing file is not found in the database, return an error
    if (!existingFile) {
      return res.status(400).json({ status: 400, message: "File not found in database" });
    }

    // If there's an existing file URL, delete the existing file first
    if (existingFile.sportLogo) {
      const key = existingFile.sportLogo.split("/").pop();
      const deleteParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: key
      };
      await s3.deleteObject(deleteParams).promise();
      console.log("Existing file deleted successfully:", key);
    }

    // Upload the new file to the S3 bucket
    const { buffer, originalname } = req.file;
    const newFileName = `${Date.now().toString()}-${originalname}`;
    const uploadParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: newFileName,
      Body: buffer,
      ACL: "public-read"
    };

    const data = await s3.upload(uploadParams).promise();
    console.log("File updated successfully:", data.Location);
    req.fileUrl = data.Location;
    next();
  } catch (error) {
    console.error("Error updating file:", error);
    if (error.code === "NoSuchKey") {
      return res.status(404).json({ status: 404, message: "Existing file not found in S3" });
    } else {
      return res.status(500).json({ status: 500, message: "Internal Server Error" });
    }
  }
};

