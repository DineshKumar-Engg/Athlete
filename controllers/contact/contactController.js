const contactModel = require("../../models/common/contactModel");

exports.addContact = async (req, res, next) => {
  try {
    console.log("req.body =>", req.body);
    const { firstname, lastname, phone, email, message } = req.body;

    // Check if a contact with the same email already exists
    // const existingUser = await contactModel.findOne({ where: { email } });

    // if (existingUser) {
    //   return res.status(401).json({ status: 401, message: "User data already submitted" });
    // }

    try {
      // Create a new contact entry
      const newEnquiry = await contactModel.create({
        firstname,
        lastname,
        phone,
        email,
        message
      });

      if (newEnquiry) {
        console.log("New contact added:", newEnquiry);
        return res.status(201).json({ status: 201, message: "User data added successfully" });
      } else {
        return res.status(500).json({ status: 500, message: "Error occurred form submitted" });
      }
    } catch (error) {
      // Handle any potential errors during the contact creation
      console.error("Add contact API error:", error);
      return res.status(500).json({ status: 500, message: "Error occurred form submitted" });
    }
  } catch (error) {
    // Handle any potential errors in the try-catch block
    console.error("Add contact API error:", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

// Get all contacts
exports.getAllContacts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    console.log("req.user =>", req.user);
    if (req.user.roleId !== 1) {
      return res.status(401).json({ status: 401, message: "Not Authorized" });
    }
    const allContacts = await contactModel.findAll({
      limit,
      offset,
      order: [["createdAt", "DESC"]]
    });
    return res.status(200).json({ status: 200, message: "Success", data: allContacts });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
