const cmsModel = require("../../models/cms/cmsModel");
const userModel = require("../../models/user/userModel");
const cmsSectionsModel = require("../../models/cms/cmsSectionModel");
const cmsGalleryModel = require("../../models/cms/cmsGalleryModel");
exports.createPageGallery = async (req, res, next) => {
  try {
    console.log("Files locations:", req.fileUrls);
    const fileUrls = req.fileUrls;
    const { fileType, fileDescription, fileTitle, cmssectionId, cmId } = req.body;

    console.log("User:", req.body);
    const existingUser = await userModel.findOne({
      where: { email: req?.user?.email }
    });
    console.log("existingUser", existingUser);
    if (!existingUser) {
      return res.status(401).json({ status: 401, message: "User not found" });
    }
    // Check if any file URL is missing
    if (!fileUrls || fileUrls.length === 0) {
      return res.status(400).json({ status: 400, message: "File URLs are missing" });
    }
    try {
      // Create gallery entries for each file
      const createFilesPromises = fileUrls.map(async (fileUrl) => {
        const createFile = await cmsGalleryModel.create({
          fileTitle,
          fileDescription,
          cmssectionId,
          fileType,
          cmId,
          fileLocation: fileUrl
        });
        return createFile;
      });
      // Execute all create file operations in parallel
      const createdFiles = await Promise.all(createFilesPromises);

      // Check if all files were successfully created
      const allFilesCreated = createdFiles.every((file) => !!file);
      if (allFilesCreated) {
        return res.status(201).json({ status: 201, message: "Field created successfully" });
      } else {
        return res.status(500).json({ status: 500, message: "Field created failed" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: 500, message: "Error occurred while adding field" });
    }
  } catch (error) {
    console.log("page add api error", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
// Delete CMS
exports.deletePage = async (req, res, next) => {
  try {
    const pageId = req.params.id;
    console.log("pageId", pageId);
    // Soft delete the page
    const result = await cmsModel.destroy({
      where: {
        id: pageId
      }
    });
    if (result > 0) {
      return res.status(200).json({ status: 200, message: "Page deleted successfully" });
    } else {
      return res.status(404).json({ status: 404, message: "Page not found or already deleted" });
    }
  } catch (error) {
    console.log("Delete Page API error:", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
exports.deletePageImage = async (req, res, next) => {
  try {
    const pageId = req.params.id;
    console.log("pageId", pageId);
    // Soft delete the page
    const result = await cmsGalleryModel.destroy({
      where: {
        id: pageId
      }
    });
    if (result > 0) {
      return res.status(200).json({ status: 200, message: "Page Image deleted successfully" });
    } else {
      return res.status(404).json({ status: 404, message: "Page Image not found or already deleted" });
    }
  } catch (error) {
    console.log("Delete Page API error:", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
// Admin get all data
exports.getAllPages = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    // Fetch all pages
    const allPage = await cmsModel.findAll({ limit, offset, include: [{ model: cmsSectionsModel }, { model: cmsGalleryModel }], order: [["createdAt", "DESC"]] });
    // const allSections = await

    return res.status(200).json({ status: 200, message: "Success", data: allPage });
  } catch (error) {
    console.error("Get all pages API error:", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
exports.getPage = async (req, res, next) => {
  try {
    const pageId = req.params.id;
    // Fetch all pages
    const allPage = await cmsModel.findOne({ where: { id: pageId }, include: [{ model: cmsSectionsModel }, { model: cmsGalleryModel }] });
    // const allSections = await

    return res.status(200).json({ status: 200, message: "Success", data: allPage });
  } catch (error) {
    console.error("Get all pages API error:", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
// Update page
// exports.updatePage = async (req, res, next) => {
//   try {
//     console.log("Request Body:", req.body);

//     const { data } = req.body;
//     if (!data) {
//       return res.status(400).json({ status: 400, message: "Invalid data format" });
//     }

//     const { id, metaTitle, metaDescription, metaKeywords, title, content, isPublish, cmssections, cmsgalleries } = data;

//     await cmsModel.update(
//       { metaTitle, metaDescription, metaKeywords, title, content, isPublish },
//       { where: { id } }
//     );

//     for (const section of cmssections) {
//       await cmsSectionsModel.update(
//         { title: section.title, shortDescription: section.shortDescription, description: section.description },
//         { where: { id: section.id, cmId: id } }
//       );
//     }

//     // Ensure req.fileUpdates is defined
//     const fileUpdates = req.fileUpdates || [];

//     for (const gallery of cmsgalleries) {
//       const fileUpdate = fileUpdates.find(fu => fu.id === gallery.id);
//       const fileLocation = fileUpdate ? fileUpdate.fileLocation : gallery.fileLocation;

//       await cmsGalleryModel.update(
//         { fileLocation, fileType: gallery.fileType, fileTitle: gallery.fileTitle, fileDescription: gallery.fileDescription },
//         { where: { id: gallery.id, cmId: id, cmssectionId: gallery.cmssectionId } }
//       );
//     }

//     return res.status(200).json({ status: 200, message: "Page updated successfully" });
//   } catch (error) {
//     console.error("Update page API error:", error);
//     return res.status(500).json({ status: 500, message: "Internal server error" });
//   }
// };
// exports.updatePage = async (req, res, next) => {
//   try {
//     console.log("Request Body:", req.body);

//     const { data } = req.body;
//     if (!data) {
//       return res.status(400).json({ status: 400, message: "Invalid data format" });
//     }

//     const { id, metaTitle, metaDescription, metaKeywords, title, content, isPublish, cmssections, cmsgalleries } = data;

//     await cmsModel.update(
//       { metaTitle, metaDescription, metaKeywords, title, content, isPublish },
//       { where: { id } }
//     );

//     for (const section of cmssections) {
//       await cmsSectionsModel.update(
//         { title: section.title, shortDescription: section.shortDescription, description: section.description },
//         { where: { id: section.id, cmId: id } }
//       );
//     }

//     const fileUpdates = req.fileUpdates || [];

//     for (const gallery of cmsgalleries) {
//       const fileUpdate = fileUpdates.find(fu => fu.id === gallery.id);
//       const fileLocation = fileUpdate ? fileUpdate.fileLocation : gallery.fileLocation;

//       await cmsGalleryModel.update(
//         { fileLocation, fileType: gallery.fileType, fileTitle: gallery.fileTitle, fileDescription: gallery.fileDescription },
//         { where: { id: gallery.id, cmId: id, cmssectionId: gallery.cmssectionId } }
//       );
//     }

//     return res.status(200).json({ status: 200, message: "Page updated successfully" });
//   } catch (error) {
//     console.error("Update page API error:", error);
//     return res.status(500).json({ status: 500, message: "Internal server error" });
//   }
// };
exports.updatePage = async (req, res, next) => {
  try {
    console.log("Request Body:", req.body);

    const { data } = req.body;
    if (!data) {
      return res.status(400).json({ status: 400, message: "Invalid data format" });
    }

    const { id, metaTitle, metaDescription, metaKeywords, title, content, isPublish, cmssections, cmsgalleries } = data;

    await cmsModel.update(
      { metaTitle, metaDescription, metaKeywords, title, content, isPublish },
      { where: { id } }
    );

    for (const section of cmssections) {
      await cmsSectionsModel.update(
        { title: section.title, shortDescription: section.shortDescription, description: section.description },
        { where: { id: section.id, cmId: id } }
      );
    }

    const fileUpdates = req.fileUpdates || [];

    for (const gallery of cmsgalleries) {
      const fileUpdate = fileUpdates.find(fu => fu.id === gallery.id);
      const fileLocation = fileUpdate ? fileUpdate.fileLocation : (typeof gallery.fileLocation === "object" ? "" : gallery.fileLocation);

      await cmsGalleryModel.update(
        { fileLocation, fileType: gallery.fileType, fileTitle: gallery.fileTitle, fileDescription: gallery.fileDescription },
        { where: { id: gallery.id, cmId: id, cmssectionId: gallery.cmssectionId } }
      );
    }

    return res.status(200).json({ status: 200, message: "Page updated successfully" });
  } catch (error) {
    console.error("Update page API error:", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

// status change controller
exports.pageIsPublished = async (req, res, next) => {
  try {
    const pageId = req.params.id;
    const { isPublish } = req.body;

    console.log("pageId", pageId, "isPublish", isPublish);

    const pageData = await cmsModel.findOne({ where: { id: pageId } });
    console.log("pageData", pageData);

    if (!pageData) { return res.status(404).json({ status: 404, message: "page not found" }); }

    // Convert isPublish from the request to match the database format
    const requestedIsActive = isPublish === true || isPublish === "true" || isPublish === 1;

    if (requestedIsActive === pageData.isActive) {
      return res.status(409).json({ status: 409, message: "Status not changed. It's already set to the same value." });
    }

    // Convert requestedIsActive back to database format before updating
    await pageData.update({ isPublish: requestedIsActive ? 1 : 0 }, { where: { id: pageId } });

    return res.status(200).json({ status: 200, message: "Status updated successfully" });
  } catch (error) {
    console.error("Athlete change API error:", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
exports.uploadExactMultipleFiles = async (req, res) => {
  try {
    const updatedFileLocations = req.updatedFileLocations;

    if (!updatedFileLocations || !updatedFileLocations.length) {
      return res.status(400).json({ status: 400, message: "No files were updated" });
    }

    return res.status(200).json({ status: 200, message: "Files updated successfully", updatedFileLocations });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
