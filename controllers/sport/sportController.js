const sportModel = require("../../models/common/sportsModel");
const userModel = require("../../models/user/userModel");
exports.addSport = async (req, res, next) => {
  try {
    const fileUrl = req.fileUrl;
    const { sportName, sportDescription } = req.body;
    console.log("Request Body:", req.body);
    console.log("User:", req.user);

    const existingUser = await userModel.findOne({ where: { email: req?.user?.email } });
    console.log("existingUser", existingUser);

    if (!existingUser) {
      return res.status(409).json({ status: 409, message: "User not found" });
    }

    const existingSport = await sportModel.findOne({ where: { sportName } });

    if (existingSport) {
      return res.status(409).json({ status: 409, message: "Sport with the same name already exists" });
    }

    try {
      const newSport = await sportModel.create({
        sportName,
        sportDescription,
        sportLogo: fileUrl,
        isActive: true
      });
      await newSport.update({ createdUser: existingUser?.createdUser, updatedUser: existingUser?.updatedUser });
      if (newSport) {
        return res.status(200).json({ status: 200, message: "Sport added successfully" });
      } else {
        return res.status(400).json({ status: 400, message: "Sport creation failed" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: 500, message: "Error occurred while adding sport" });
    }
  } catch (error) {
    console.error("Add sport API error:", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
// Delete athlete
exports.deleteSport = async (req, res, next) => {
  try {
    const sportId = req.params.id;
    console.log("sportId", sportId);
    // Soft delete the sport
    const result = await sportModel.destroy(
      {
        where: {
          id: sportId
        }
      }
    );
    if (result > 0) {
      return res.status(200).json({ status: 200, message: "Sport deleted successfully" });
    } else {
      return res.status(404).json({ status: 404, message: "Sport not found or already deleted" });
    }
  } catch (error) {
    console.log("Delete Sport API error:", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

// Admin get all data with pagination
exports.getAllSport = async (req, res, next) => {
  try {
    let page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
    let limit = parseInt(req.query.limit) || 20; // Default limit to 20 items per page if not specified

    // If both page and limit are not provided, return a default set of data
    if (!req.query.page && !req.query.limit) {
      page = 1;
      limit = 20; // Set your default limit here
    }

    // Calculate offset
    const offset = (page - 1) * limit;

    // Fetch all sports with pagination
    const allSports = await sportModel.findAll({ limit, offset, order: [["createdAt", "DESC"]]  });

    return res.status(200).json({ status: 200, message: "Success", data: allSports });
  } catch (error) {
    console.error("Get all sport API error:", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

// Update Sport
exports.updateSport = async (req, res, next) => {
  try {
    // const userId = req.user.id;
    const fileUrl = req.fileUrl;
    const { sportName, sportDescription, isActive, id } = req.body;
    const existingSport = await sportModel.findOne({where: {id}});
    console.log("existingSport =>", existingSport);
    if (!existingSport) {
      return res.status(404).json({ status: 404, message: "Sport not found" });
    }
    try {
      await existingSport.update({
        sportName,
        sportDescription,
        isActive,
        sportLogo:fileUrl
      });
      return res.status(200).json({ status: 200, message: "Sport updated successfully" });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Some error occured sport update" });
    }
  } catch (error) {
    console.log("Update sport API error:", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
exports.singleSport = async (req, res, next) => {
  try {
    const sportId = req.params.id;
    const role = req.user.roleId;
    console.log("sportId", sportId, "role", role);

    let sportData;

    if (role === 1) {
      sportData = await sportModel.findOne({ where: { id: sportId } });
    } else {
      sportData = await sportModel.findOne({ where: { id: sportId, isActive: true }});
    }

    if (sportData) {
      console.log("sportData", sportData);
      return res.status(200).json({ status: 200, message: "Success", data: { sportData } });
    } else {
      return res.status(400).json({ status: 400, message: "Data not found" });
    }
  } catch (error) {
    console.error("Error in singleSport:", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

// exports.addSportFile = async (req, res, next) => {
//   try {
//     const fileUrl = req.fileUrl;
//     const { sportName, sportDescription, galleryId } = req.body;
//     console.log("Request Body:", req.body);
//     console.log("User:", req.user);

//     const existingUser = await userModel.findOne({ where: { email: req?.user?.email } });
//     console.log("existingUser", existingUser);

//     if (!existingUser) {
//       return res.status(409).json({ status: 409, message: "User not found" });
//     }

//     const existingSport = await sportModel.findOne({ where: { sportName } });

//     if (existingSport) {
//       return res.status(409).json({ status: 409, message: "Sport with the same name already exists" });
//     }

//     try {
//       const newSport = await sportModel.create({
//         sportName,
//         sportDescription,
//         galleryId,
//         sportLogo: fileUrl,
//         isActive: true
//       });
//       await newSport.update({ createdUser: existingUser?.createdUser, updatedUser: existingUser?.updatedUser });
//       if (newSport) {
//         return res.status(200).json({ status: 200, message: "Sport added successfully" });
//       } else {
//         return res.status(400).json({ status: 400, message: "Sport creation failed" });
//       }
//     } catch (error) {
//       console.log(error);
//       return res.status(500).json({ status: 500, message: "Error occurred while adding sport" });
//     }
//   } catch (error) {
//     console.error("Add sport API error:", error);
//     return res.status(500).json({ status: 500, message: "Internal server error" });
//   }
// };
// // Update Sport
// exports.updateSportFile = async (req, res, next) => {
//   try {
//     const userId = req.user.id;
//     const fileUrl = req.fileUrl;
//     console.log("userId", userId);
//     const sportId = req.body.id;
//     const { sportName, sportDescription, galleryId, isActive } = req.body;
//     const existingSport = await sportModel.findOne({where: {id: sportId}});
//     console.log("existingSport =>", existingSport);
//     if (!existingSport) {
//       return res.status(404).json({ status: 404, message: "Sport not found" });
//     }
//     try {
//       await existingSport.update({
//         sportName,
//         sportDescription,
//         galleryId,
//         isActive,
//         sportLogo:fileUrl,
//         updatedUser: userId
//       });
//       return res.status(200).json({ status: 200, message: "Sport updated successfully" });
//     } catch (error) {
//       console.log(error);
//       return res
//         .status(500)
//         .json({ message: "Some error occured sport update" });
//     }
//   } catch (error) {
//     console.log("Update sport API error:", error);
//     return res.status(500).json({ status: 500, message: "Internal server error" });
//   }
// };