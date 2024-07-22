const roleModel = require("../../models/role/roleModel");

exports.addRole = async (req, res, next) => {
  try {
    console.log("role =>", req.body);
    const { roleName, roleDescription, roleType } =
      req.body;
    const newRole = await roleModel.create({
      roleName,
      roleDescription,
      roleType,
      createdUser: 1,
      updatedUser: 1
    });
    if (newRole) {
      console.log("New Role added:", newRole);
      return res.status(200).json({ status: 200, message: "Role added successfully" });
    } else {
      return res.status(500).json({ status: 500, message: "Error occurred form submitted" });
    }
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
