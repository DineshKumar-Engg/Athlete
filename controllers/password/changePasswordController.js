const bcrypt = require("bcrypt");
// const sequelize = require("../../utills/database");
const userModel = require("../../models/user/userModel");

exports.changePassword = async (req, res, next) => {
  try {
    console.log("user", req.user);
    console.log("body", req.body);
    const reqUserId = req.user.id;
    const reqUserEmail = req.user.email;
    console.log(reqUserId, reqUserEmail);
    // Find the user by ID and Email
    const reqUser = await userModel.findOne({
      where: { id: reqUserId, email: reqUserEmail }
    });

    if (reqUser) {
      const oldPassword = req?.body?.oldpassword;
      const newPassword = req?.body?.newpassword;
      const existingPassword = reqUser.password;

      // Compare the old password with the existing hashed password
      bcrypt.compare(oldPassword, existingPassword, async (err, result) => {
        try {
          if (err) {
            return res.status(401).json({ status: 401, message: "Error occured in password compare" });
          }

          if (result) {
            // Hash the new password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

            // Update the password in the database
            const status = await reqUser.update({ password: hashedPassword });

            if (status) {
              return res
                .status(200)
                .json({
                  status: 200,
                  message: "Password changed successfully"
                });
            } else {
              return res
                .status(500)
                .json({
                  status: 500,
                  message: "Error occured while updating password"
                });
            }
          } else {
            return res
              .status(401)
              .json({ status: 401, message: "Wrong old password" });
          }
        } catch (error) {
          console.log(error);
          return res
            .status(500)
            .json({ status: 500, message: "Internal server error" });
        }
      });
    } else {
      return res.status(400).json({ status: 400, message: "Not Authorized" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ status: 400, message: "Some error occurred" });
  }
};
