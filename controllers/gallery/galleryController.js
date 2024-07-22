const userModel = require("../../models/user/userModel");
const galleryModel = require("../../models/gallery/galleryModel");
exports.uploadSingleFile = async (req, res, next) => {
  try {
    console.log("file location", req.fileUrl);
    const fileUrl = req.fileUrl;
    const { description, isActive, fileType, isApproved, userId } = req.body;
    console.log("req.body", req.body);

    const userdata = await userModel.findOne({ where: { id: userId } });
    console.log("userdata", userdata);
    if (!userdata) {
      return res.status(401).json({ status: 401, message: "Not authorized" });
    }

    if (!fileUrl) {
      return res.status(400).json({ status: 400, message: "File URL is missing" });
    }

    const createFile = await galleryModel.create({
      userId,
      description,
      isActive,
      fileType,
      isApproved,
      fileLocation: fileUrl,
      createdUser: userdata.id,
      updatedUser: userdata.id
    });
    console.log("createFile", createFile);
    if (createFile) {
      return res
        .status(201).json({ status: 201, message: "Gallery file created", data: createFile });
    } else {
      return res
        .status(500).json({ status: 500, message: "Failed to create gallery file" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500).json({ status: 500, message: "Internal server error" });
  }
};

exports.updateSingleFile = async (req, res, next) => {
  try {
    const fileUrl = req.fileUrl;
    const fileId = req.body.id;
    console.log("fileId", fileId);

    // Find the user data based on the authenticated user's ID
    const userData = await userModel.findOne({ where: { id: req.user.id } });
    console.log("userData", userData);

    // Check if user data exists
    if (!userData) {
      return res.status(401).json({ status: 401, message: "User data not found" });
    }

    // Check if file URL is provided
    if (!fileUrl) {
      return res.status(400).json({ status: 400, message: "File URL is missing" });
    }

    // Find the gallery data based on the provided file ID
    const galleryData = await galleryModel.findOne({ where: { id: fileId } });
    console.log("galleryData", galleryData);

    // Check if both user data and gallery data exist
    if (userData && galleryData) {
      let count = 0;
      const {
        description,
        isActive,
        fileType,
        isApproved
        // fileLocation
      } = req.body;

      // Update gallery data fields if they are different from the provided request body
      if (description && description !== galleryData.description) {
        await galleryData.update({ description });
        count++;
      }
      if (isActive !== undefined && isActive !== galleryData.isActive) {
        await galleryData.update({ isActive });
        count++;
      }
      if (fileType && fileType !== galleryData.fileType) {
        await galleryData.update({ fileType });
        count++;
      }
      if (isApproved !== undefined && isApproved !== galleryData.isApproved) {
        await galleryData.update({ isApproved });
        count++;
      }
      if (fileUrl && fileUrl !== galleryData.fileLocation) {
        await galleryData.update({ fileLocation: fileUrl });
        count++;
      }
      if (count > 0) {
        await galleryData.update(
          { updatedUser: userData.id }
        );

        return res.status(200).json({ status: 200, message: "Data updated successfully", data: galleryData });
      } else {
        return res.status(200).json({ status: 200, message: "Nothing is changed" });
      }
    } else {
      return res.status(401).json({ status: 401, message: "Not Authorized" });
    }
  } catch (error) {
    console.error("Error updating file:", error);
    return res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
};

exports.deleteFile = async (req, res, next) => {
  try {
    const fileId = req.params.fileId;
    console.log("fileId", fileId);
    const result = await galleryModel.destroy(
      {
        where: {
          id: fileId
        }
      }
    );
    if (result > 0) {
      return res.status(200).json({ status: 200, message: "file deleted successfully" });
    } else {
      return res.status(404).json({ status: 404, message: "file not found or already deleted" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
};

exports.uploadMultipleFiles = async (req, res, next) => {
  try {
    console.log("Files locations:", req.fileUrls);
    const fileUrls = req.fileUrls;
    const { description, isActive, fileType, userId } = req.body;
    console.log("req.body", req.body);

    const userData = await userModel.findOne({ where: { id: req.user.id } });
    console.log("userData", userData);

    // Check if user data exists
    if (!userData) {
      return res.status(401).json({ status: 401, message: "Not authorized" });
    }

    // Check if any file URL is missing
    if (!fileUrls || fileUrls.length === 0) {
      return res.status(400).json({ status: 400, message: "File URLs are missing" });
    }

    // Create gallery entries for each file
    const createFilesPromises = fileUrls.map(async (fileUrl) => {
      const createFile = await galleryModel.create({
        userId,
        description,
        isActive,
        fileType,
        isApproved: false,
        fileLocation: fileUrl,
        createdUser: userData.id,
        updatedUser: userData.id
      });
      return createFile;
    });

    // Execute all create file operations in parallel
    const createdFiles = await Promise.all(createFilesPromises);

    // Check if all files were successfully created
    const allFilesCreated = createdFiles.every(file => !!file);
    if (allFilesCreated) {
      return res.status(201).json({ status: 201, message: "Gallery files created" });
    } else {
      return res.status(500).json({ status: 500, message: "Failed to create some gallery files" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
// status change controller
exports.galleryIsActive = async (req, res, next) => {
  try {
    const galleryId = req.params.id;
    const { isActive } = req.body;

    console.log("galleryId", galleryId, "isActive", isActive);

    const galleryData = await galleryModel.findOne({ where: { id: galleryId } });
    console.log("galleryData", galleryData);

    if (!galleryData) {
      return res.status(404).json({ status: 404, message: "file not found" });
    }

    // Convert isActive from the request to match the database format
    const requestedIsActive = isActive === true || isActive === "true" || isActive === 1;

    if (requestedIsActive === galleryData.isActive) {
      return res.status(409).json({ status: 409, message: "Status not changed. It's already set to the same value." });
    }

    // Convert requestedIsActive back to database format before updating
    await galleryModel.update({ isActive: requestedIsActive ? 1 : 0 }, { where: { id: galleryId } });

    return res.status(200).json({ status: 200, message: "Status updated successfully" });
  } catch (error) {
    console.error("Coach status change API error:", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
// status change controller
exports.galleryIsApprove = async (req, res, next) => {
  try {
    const galleryId = req.params.id;
    const { isApproved } = req.body;

    console.log("galleryId", galleryId, "isApproved", isApproved);

    const galleryData = await galleryModel.findOne({ where: { id: galleryId } });
    console.log("galleryData", galleryData);

    if (!galleryData) {
      return res.status(404).json({ status: 404, message: "file not found" });
    }

    // Convert isActive from the request to match the database format
    const requestedIsActive = isApproved === true || isApproved === "true" || isApproved === 1;

    if (requestedIsActive === galleryData.isApproved) {
      return res.status(409).json({ status: 409, message: "Status not changed. It's already set to the same value." });
    }

    // Convert requestedIsActive back to database format before updating
    await galleryModel.update({ isApproved: requestedIsActive ? 1 : 0 }, { where: { id: galleryId } });

    return res.status(200).json({ status: 200, message: "Status updated successfully" });
  } catch (error) {
    console.error("Coach status change API error:", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
exports.getAllFiles = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    // Fetch all gallery files
    const allGalleryFiles = await galleryModel.findAll({ limit, offset });

    // Fetch all users
    const allUsers = await userModel.findAll();

    // Map gallery files with corresponding user data
    const connectedData = allGalleryFiles.map((gallery) => {
      // Find the user corresponding to the gallery file
      const userData = allUsers.find((user) => user.id === gallery.userId);

      // Return an object containing gallery data and user data
      return {
        galleryData: gallery,
        userData: userData || {} // Default to empty object if user not found
      };
    });

    // Respond with the connected data
    return res.status(200).json({ status: 200, message: "Success", data: connectedData });
  } catch (error) {
    console.error("Get all sport API error:", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

exports.getGallery = async (req, res, next) => {
  try {
    const galleryId = req.params.id;
    const role = req.user.roleId;
    console.log("galleryId", galleryId, "role", role);

    let galleryData;

    if (role === 1) {
      galleryData = await galleryModel.findOne({ where: { id: galleryId } });
    } else {
      galleryData = await galleryModel.findOne({ where: { id: galleryId, isActive: true, isApproved: "Approve" } });
    }

    if (galleryData) {
      console.log("galleryData", galleryData);
      return res.status(200).json({ status: 200, message: "Success", data: { galleryData } });
    } else {
      return res.status(400).json({ status: 400, message: "Data not found" });
    }
  } catch (error) {
    console.error("Error in singleSport:", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
