const billingstateModel = require("../../models/common/billingStateModel");
const userModel = require("../../models/user/userModel");

// Add Billing state
exports.addBillingState = async (req, res, next) => {
  try {
    const {
      stateName,
      tax
    } = req.body;
    console.log("Request Body:", req.body);
    console.log("User:", req.user);
    const existingUser = await userModel.findOne({ where: { email: req?.user?.email, roleId: 1 } });
    console.log("existingUser", existingUser);
    if (!existingUser) {
      return res.status(409).json({ status: 409, message: "User not found" });
    }

    const existingBillingstate = await billingstateModel.findOne({ where: { stateName } });

    if (existingBillingstate) {
      return res.status(409).json({ status: 409, message: "Billing State with the same name already exists" });
    }
    try {
      const newBillingstate = await billingstateModel.create(
        {
          stateName,
          tax,
          isActive: true,
          roleId: req.user.roleId
        }
      );
      await newBillingstate.update(
        {
          createdUser: existingUser?.createdUser,
          updatedUser: existingUser?.updatedUser
        }
      );
      if (newBillingstate) {
        return res.status(200).json({ message: "Billing State added successfully" });
      } else {
        return res.status(400).json({ status: 400, message: "Billing State creation failed" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: 500, message: "Error occurred while adding Billing State" });
    }
  } catch (error) {
    console.error("Add Billing State API error:", error);

    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

// Delete Promocode
exports.deleteBillingSatate = async (req, res, next) => {
  try {
    const billingStateId = req.params.id;
    console.log("billingStateId", billingStateId);

    const result = await billingstateModel.destroy(
      {
        where: {
          id: billingStateId
        }
      }
    );
    if (result > 0) {
      return res.status(200).json({ status: 200, message: "Billing State deleted successfully" });
    } else {
      return res.status(404).json({ status: 404, message: "Billing State not found or already deleted" });
    }
  } catch (error) {
    console.log("Delete Billing State API error:", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

// Update Billing State
exports.updateBillingState = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const billingStateId = req.body.id;
    console.log("userId", userId, "billingStateId", billingStateId);
    const userData = await userModel.findOne({ where: { id: userId, roleId: 1 } });
    console.log("userDataInfo", userData);

    if (!userData) {
      return res.status(401).json({ status: 401, message: "User not found" });
    }

    const billingStateData = await billingstateModel.findOne({
      where: { id: billingStateId }
    });
    console.log("subscriptionData", billingStateData);
    if (userData && billingStateData) {
      let count = 0;
      const {
        stateName,
        tax,
        isActive
      } = req.body;
      if (stateName && stateName !== billingStateData.stateName) {
        await billingStateData.update({ stateName });
        count++;
      }
      if (tax && tax !== billingStateData.tax) {
        await billingStateData.update({ tax });
        count++;
      }
      if (isActive && isActive !== billingStateData.isActive) {
        await billingStateData.update({ isActive });
        count++;
      }
      if (count > 0) {
        await billingStateData.update(
          { updatedUser: userData.id }
        );

        return res.status(200).json({ status: 200, message: "Data updates successfully", data: billingStateData });
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
// Get all billing state
exports.getAllBillingState = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    // Get all data
    const allBillingState = await billingstateModel.findAll({ limit, offset, include: [{ model: userModel }], order: [["createdAt", "DESC"]], });
    return res.status(200).json({ status: 200, message: "Success", data: allBillingState });
  } catch (error) {
    console.error("Get all billing state API error:", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
exports.getBillingState = async (req, res, next) => {
  try {
    const billingstateId = req.params.id;
    const role = req.user.roleId;
    console.log("billingstateId", billingstateId, "role", role);

    let billingstateData;

    if (role === 1) {
      billingstateData = await billingstateModel.findOne({ where: { id: billingstateId }, include: [{ model: userModel }], order: [["createdAt", "DESC"]] });
    } else {
      billingstateData = await billingstateModel.findOne({ where: { id: billingstateId, isActive: true }, include: [{ model: userModel }], order: [["createdAt", "DESC"]] });
    }

    if (billingstateData) {
      console.log("sportData", billingstateData);
      return res.status(200).json({ status: 200, message: "Success", data: billingstateData });
    } else {
      return res.status(400).json({ status: 400, message: "Data not found" });
    }
  } catch (error) {
    console.error("Error in singleSport:", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
