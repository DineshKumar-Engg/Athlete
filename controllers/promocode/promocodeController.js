const promocodeModel = require("../../models/common/promocodeModel");
const userModel = require("../../models/user/userModel");
// const sportModel = require("../../models/common/sportsModel");
const roleModel = require("../../models/role/roleModel");
const transactionHistoryModel = require("../../models/transaction/transactionHistoryModel");
exports.addPromocode = async (req, res, next) => {
  try {
    const {
      promocodeName,
      promocodeDescription,
      startDate,
      endDate,
      discount,
      accessLimit,
      roleId
      // sportId
    } = req.body;
    console.log("Request Body:", req.body);
    console.log("User:", req.user);
    const existingUser = await userModel.findOne({ where: { email: req?.user?.email, roleId: 1 } });

    console.log("existingUser", existingUser);
    if (!existingUser) {
      return res.status(409).json({ status: 409, message: "User not found" });
    }

    const existingPromocode = await promocodeModel.findOne({ where: { promocodeName } });

    if (existingPromocode) {
      return res.status(409).json({ status: 409, message: "Promocode with the same name already exists" });
    }

    try {
      const newPromocode = await promocodeModel.create(
        {
          promocodeName,
          promocodeDescription,
          startDate,
          endDate,
          discount,
          accessLimit,
          // sportId,
          roleId,
          isEnable: true
        }
      );
      await newPromocode.update(
        {
          createdUser: existingUser?.createdUser,
          updatedUser: existingUser?.updatedUser
        }
      );
      if (newPromocode) {
        return res.status(200).json({ status: 200, message: "Promocode added successfully" });
      } else {
        return res.status(400).json({ status: 400, message: "Promocode creation failed" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: 500, message: "Error occurred while adding Promocode" });
    }
  } catch (error) {
    console.error("Add Promocode API error:", error);

    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

// Delete Promocode
exports.deletePromocode = async (req, res, next) => {
  try {
    const promocodeId = req.params.id;
    console.log("promocodeId", promocodeId);

    const result = await promocodeModel.destroy(
      {
        where: {
          id: promocodeId
        }
      }
    );
    if (result > 0) {
      return res.status(200).json({ status: 200, message: "Promocode deleted successfully" });
    } else {
      return res.status(404).json({ status: 404, message: "Promocode not found or already deleted" });
    }
  } catch (error) {
    console.log("Delete Promocode API error:", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
// Update Promocode
exports.updatePromocode = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const promocodeId = req.body.id;
    console.log("userId", userId, "promocodeId", promocodeId);
    const userData = await userModel.findOne({
      where: { id: userId, roleId: 1 }
    });
    console.log("userDataInfo", userData);

    if (!userData) {
      return res.status(401).json({ status: 401, message: "User not found" });
    }

    const promocodeData = await promocodeModel.findOne({
      where: { id: promocodeId }
    });
    console.log("subscriptionData", promocodeData);
    if (userData && promocodeData) {
      let count = 0;
      const {
        promocodeName,
        promocodeDescription,
        startDate,
        endDate,
        discount,
        accessLimit,
        isEnable,
        roleId
        // sportId
      } = req.body;
      if (
        promocodeName &&
        promocodeName !== promocodeData.promocodeName
      ) {
        await promocodeData.update({ promocodeName });
        count++;
      }
      if (promocodeDescription && promocodeDescription !== promocodeData.promocodeDescription) {
        await promocodeData.update({ promocodeDescription });
        count++;
      }
      if (
        startDate &&
        startDate !== promocodeData.startDate
      ) {
        await promocodeData.update(
          { startDate }
        );
        count++;
      }
      if (
        endDate &&
        endDate !== promocodeData.endDate
      ) {
        await promocodeData.update(
          { endDate }
        );
        count++;
      }
      if (
        discount &&
        discount !== promocodeData.discount
      ) {
        await promocodeData.update(
          { discount }
        );
        count++;
      }
      // if (sportId && sportId !== promocodeData.sportId) {
      //   await promocodeData.update({ sportId });
      //   count++;
      // }
      if (accessLimit && accessLimit !== promocodeData.accessLimit) {
        await promocodeData.update({ accessLimit });
        count++;
      }
      if (isEnable && isEnable !== promocodeData.isEnable) {
        await promocodeData.update({ isEnable });
        count++;
      }
      if (roleId && roleId !== promocodeData.roleId) {
        await promocodeData.update({ roleId });
        count++;
      }
      if (count > 0) {
        await promocodeData.update(
          { updatedUser: userData.id }
        );

        return res.status(200).json({ status: 200, message: "Data updates successfully" });
      } else {
        return res.status(200).json({ status: 200, message: "Nothing is changed" });
      }
    } else {
      return res.status(401).json({ status: 401, message: "Not Authorized" });
    }
  } catch (error) {
    console.log("Update sport API error:", error);

    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
// Admin get all data
exports.getAllPromocodes = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    // Fetch all promocodes
    const allPromocodes = await promocodeModel.findAll({ limit, offset, include: [{ model: roleModel }], order: [["createdAt", "DESC"]]  });

    return res.status(200).json({ status: 200, message: "Success", data: allPromocodes });
  } catch (error) {
    console.error("Get all sport API error:", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
exports.getPromocode = async (req, res, next) => {
  try {
    const promocodeId = req.params.id;
    const role = req.user.roleId;
    console.log("promocodeId", promocodeId, "role", role);

    let promocodeData;

    if (role === 1) {
      promocodeData = await promocodeModel.findOne({ where: { id: promocodeId }, include: [{ model: roleModel }], order: [["createdAt", "DESC"]]  });
    } else {
      promocodeData = await promocodeModel.findOne({ where: { id: promocodeId, isEnable: true }, include: [{ model: roleModel }] });
    }

    if (promocodeData) {
      console.log("sportData", promocodeData);
      return res.status(200).json({ status: 200, message: "Success", data: promocodeData });
    } else {
      return res.status(400).json({ status: 400, message: "Data not found" });
    }
  } catch (error) {
    console.error("Error in singleSport:", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
// status change controller
exports.promocodeIsActive = async (req, res, next) => {
  try {
    const promocodeId = req.params.id;
    const { isEnable } = req.body;

    console.log("promocodeId", promocodeId, "isEnable", isEnable);

    const promocodeData = await promocodeModel.findOne({ where: { id: promocodeId } });
    console.log("promocodeData", promocodeData);

    if (!promocodeData) {
      return res.status(404).json({ status: 404, message: "Promocode not found" });
    }
    const requestedIsEnable = isEnable === true || isEnable === "true" || isEnable === 1;

    if (requestedIsEnable === promocodeData.isEnable) {
      return res.status(409).json({ status: 409, message: "Status not changed. It's already set to the same value." });
    }

    // Convert requestedIsActive back to database format before updating
    await promocodeData.update({ isEnable: requestedIsEnable ? 1 : 0 }, { where: { id: promocodeId } });

    return res.status(200).json({ status: 200, message: "Status updated successfully" });
  } catch (error) {
    console.error("Athlete change API error:", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
// Promo code Validating 
exports.validatePromocode = async (req, res, next) => {
  try {
    const roleId = req.user.roleId;
    const { promocodeName } = req.body;

    console.log("promocodeName", promocodeName, roleId);

    const existingPromocode = await promocodeModel.findOne({
      where: { promocodeName, isEnable: true }
    });

    console.log(existingPromocode);

    if (!existingPromocode) {
      return res.status(404).json({
        status: 404,
        message: "Promocode not found or not activated"
      });
    }

    if (roleId !== existingPromocode.roleId) {
      return res.status(403).json({
        status: 403,
        message: "User role does not match promocode role"
      });
    }

    const today = new Date().toISOString().split("T")[0];
    console.log("today", today);

    if (existingPromocode.startDate > today) {
      return res.status(400).json({
        status: 400,
        message: "Promocode is not active yet"
      });
    }

    if (existingPromocode.endDate < today) { 
      return res.status(400).json({
        status: 400,
        message: "Promocode has expired"
      });
    }
    const transactionHistoryCount = await transactionHistoryModel.count({where: {promocodeId: existingPromocode.id}});
    console.log("transactionHistoryCount", transactionHistoryCount);
    
    if (existingPromocode.accessLimit !== "unlimited" && Number(existingPromocode.accessLimit) <= transactionHistoryCount) {
      return res.status(400).json({
        status: 400,
        message: "Promocode access limit expired"
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Promocode matched successfully",
      existingPromocode
    });

  } catch (error) {
    console.error("error", error);
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      error: error.message 
    });
  }
};