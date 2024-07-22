const { Op } = require("sequelize");
const announcementModel = require("../../models/announcement/announcementModel");
const userModel = require("../../models/user/userModel");
const sportsModel = require("../../models/common/sportsModel");
const sequelize = require("../../utills/database");
exports.addAnnounceMent = async ( req, res, next ) =>{
  try {
    const existingId = req.user.id;
    const existingRoleId = req.user.roleId;
    const {announcementTitle, announcementDescription, roleId, sportsId, fromDate, toDate} = req.body;
    console.log("existingId", existingId, "existingRoleId", existingRoleId);
    const existingUser = await userModel.findOne({
      where: { id: existingId, roleId: existingRoleId }
    });
    console.log("existingUser", existingUser);
    if (!existingUser) {
      return res.status(401).json({ status: 401, message: "User not found" });
    }
    // const existingAnnouncement = await announcementModel.findOne({where: {roleId: roleId, sportsId: sportsId}});
    // console.log("existingAnnouncement", existingAnnouncement);
    // if (existingAnnouncement){
    //   return res.status(409).json({ status: 409, message: "Already Sports announcement added" });  
    // }
    const announcementCreate = await announcementModel.create({
      announcementTitle,
      announcementDescription, 
      roleId,
      sportsId,
      fromDate,
      toDate
    });
    console.log("announcementCreate", announcementCreate);
    return res.status(201).json({ status: 201, message: "Success" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
exports.removeAnnounceMent = async ( req, res, next ) =>{
  try {
    const id = req.params.id;
    const existingId = req.user.id;
    const existingRoleId = req.user.roleId;
    console.log("existingId", existingId, "existingRoleId", existingRoleId);
    const existingUser = await userModel.findOne({
      where: { id: existingId, roleId: existingRoleId }
    });
    console.log("existingUser", existingUser);
    if (!existingUser) {
      return res.status(401).json({ status: 401, message: "User not found" });
    }
    const announcementRemove = await announcementModel.destroy({
      where: { id }
    });
    console.log("announcementRemove", announcementRemove);
    // Check if any rows were affected
    if (announcementRemove > 0) {
      return res.status(200).json({ status: 200, message: "Announcement Deleted" });
    } else {
      return res.status(404).json({ status: 404, message: "Announcement not found or already deleted" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
exports.updateAnnounceMent = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const existingId = req.user.id;
    const existingRoleId = req.user.roleId;
    const { id } = req.body;
    console.log("existingId", existingId, "existingRoleId", existingRoleId);

    // Check if the user exists
    const existingUser = await userModel.findOne({
      where: { id: existingId, roleId: existingRoleId }
    });
    console.log("existingUser", existingUser);
    if (!existingUser) {
      return res.status(401).json({ status: 401, message: "User not found" });
    }

    // Check if the announcement exists
    const existingAnnouncement = await announcementModel.findOne({
      where: { id }
    });
    console.log("existingAnnouncement", existingAnnouncement);
    if (!existingAnnouncement) {
      return res.status(404).json({ status: 404, message: "Announcement not found" });
    }

    // Collect all fields to be updated
    const {
      announcementTitle,
      announcementDescription,
      roleId,
      sportsId,
      fromDate,
      toDate
    } = req.body;

    let fieldsToUpdate = {};
    if (announcementTitle && announcementTitle !== existingAnnouncement.announcementTitle) {
      fieldsToUpdate.announcementTitle = announcementTitle;
    }
    if (announcementDescription && announcementDescription !== existingAnnouncement.announcementDescription) {
      fieldsToUpdate.announcementDescription = announcementDescription;
    }
    if (roleId && roleId !== existingAnnouncement.roleId) {
      fieldsToUpdate.roleId = roleId;
    }
    if (sportsId && sportsId !== existingAnnouncement.sportsId) {
      fieldsToUpdate.sportsId = sportsId;
    }
    if (fromDate && fromDate !== existingAnnouncement.fromDate) {
      fieldsToUpdate.fromDate = fromDate;
    }
    if (toDate && toDate !== existingAnnouncement.toDate) {
      fieldsToUpdate.toDate = toDate;
    }

    if (Object.keys(fieldsToUpdate).length > 0) {
      await existingAnnouncement.update(fieldsToUpdate, { transaction });
      await transaction.commit();
      return res.status(200).json({ status: 200, message: "Data updated successfully" });
    } else {
      await transaction.rollback();
      return res.status(200).json({ status: 200, message: "Nothing is changed" });
    }
  } catch (error) {
    await transaction.rollback();
    console.error("Update announcement API error:", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};


exports.getAllAnnounceMent = async (req, res, next) => {
  try {
    const existingRoleId = req.user.roleId;
    const existingId = req.user.id;
    const roleId = req.params.roleId;

    console.log("existingId", existingId);

    const existingUser = await userModel.findOne({
      where: { id: existingId }
    });

    console.log("existingUser", existingUser);

    if (!existingUser) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }
    let announcementWithSports;
    if (existingRoleId === 1) {
      const announcementGet = await announcementModel.findAll({
        where: { roleId: roleId }
      });
      const allSport = await sportsModel.findAll();
      console.log("allSport", allSport);
  
      announcementWithSports = announcementGet.map(announcement => {
        const sportData = announcement ? allSport.find(sport => sport.id == announcement.sportsId) : null;
        return {
          announcement, 
          sportData
        };
      });
    } else {
      const today = new Date().toISOString().split("T")[0];
      const announcementGet = await announcementModel.findAll({
        where: { roleId: roleId,
          fromDate: { [Op.lte]: today },
          toDate: { [Op.gte]: today }
        }
      });
      const allSport = await sportsModel.findAll();
      console.log("allSport", allSport);
  
      announcementWithSports = announcementGet.map(announcement => {
        const sportData = announcement ? allSport.find(sport => sport.id == announcement.sportsId) : null;
        return {
          announcement, 
          sportData
        };
      });
    }
    return res.status(200).json({ status: 200, message: "Success", announcementWithSports });

  } catch (error) {
    console.error("Error fetching announcements:", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

exports.getAnnounceMent = async ( req, res, next ) =>{
  try {
    const existingId = req.user.id;
    const id = req.params.id;
    console.log("existingId", existingId);
    const existingUser = await userModel.findOne({
      where: { id: existingId }
    });
    console.log("existingUser", existingUser);
    if (!existingUser) {
      return res.status(401).json({ status: 401, message: "User not found" });
    }
    const announcementGet = await announcementModel.findOne({
      where: { id }
    });
    const sportGet = await sportsModel.findOne({
      where: { id: announcementGet.sportsId }
    });
    console.log("announcementGet", announcementGet);
    return res.status(200).json({ status: 200, message: "Success",  announcementGet, sportGet});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
exports.getMobileAnnounceMent = async (req, res, next) => {
  try {
    const existingId = req.user.id;
    const roleId = req.params.roleId;

    console.log("existingId", existingId);

    const existingUser = await userModel.findOne({
      where: { id: existingId }
    });

    console.log("existingUser", existingUser);

    if (!existingUser) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }

    const announcementGet = await announcementModel.findAll({
      where: { roleId: roleId }
    });
    const allSport = await sportsModel.findAll();
    console.log("allSport", allSport);

    const groupedAnnouncements = announcementGet.reduce((acc, announcement) => {
      if (announcement.sportsId === "general") {
        acc.general.push(announcement);
      } else {
        const sportData = allSport.find(sport => sport.id == announcement.sportsId);
        if (!acc[announcement.sportsId]) {
          acc[announcement.sportsId] = [];
        }
        acc[announcement.sportsId].push({
          announcement,
          sportData
        });
      }
      return acc;
    }, { general: [] });

    const announcementWithSports = Object.keys(groupedAnnouncements).map(sportsId => {
      if (sportsId === "general") {
        return groupedAnnouncements.general.map(announcement => ({ announcement }));
      }
      return groupedAnnouncements[sportsId];
    }).flat();

    return res.status(200).json({ status: 200, message: "Success", announcementWithSports });

  } catch (error) {
    console.error("Error fetching announcements:", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
