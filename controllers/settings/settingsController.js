const settingsModel = require("../../models/settings/settingsModel");
const userModel = require("../../models/user/userModel");
exports.addSettings = async (req, res, next) => {
  try {
    const { appName, fromAge, toAge, instagramLink, twitterLink, youtubeLink, facebookLink, phoneNumber } = req.body;
    const { email, roleId } = req.user;
    console.log(fromAge, toAge, email, roleId);
    const existingUser = await userModel.findOne({ where: { email, roleId: 1 } });
    // const existingAge = await ageModel.findOne({ where: { age } });
    // if (existingAge) {
    //   return res.status(409).json({ status: 409, message: "Age already exist" });
    // }
    if (!existingUser) {
      return res.status(400).json({ status: 400, message: "User not found" });
    }
    const createSettings = await settingsModel.create({
      appName,
      fromAge,
      toAge,
      instagramLink,
      twitterLink,
      youtubeLink,
      facebookLink,
      phoneNumber,
      appIntroduction,
      email
    });
    if (createSettings) {
      return res.status(201).json({ status: 201, message: "Age added successfully" });
    } else {
      return res.status(404).json({ status: 201, message: "Age create failed" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

exports.editSettings = async (req, res, next) => {
  try {
    const { id, appName, fromAge, toAge, instagramLink, twitterLink, youtubeLink, facebookLink, phoneNumber, email, appIntroduction } = req.body;
    const existingSettings = await settingsModel.findOne({ where: { id } });
    // if (existingAge) {
    //   return res.status(409).json({ status: 409, message: "Age already exist" });
    // }
    if (existingSettings) {
      let count = 0;
      if (appName && appName !== existingSettings.appName) {
        await existingSettings.update({ appName });
        count++;
      }
      if (fromAge && fromAge !== existingSettings.fromAge) {
        await existingSettings.update({ fromAge });
        count++;
      }
      if (toAge && toAge !== existingSettings.toAge) {
        await existingSettings.update({ toAge });
        count++;
      }
      if (instagramLink && instagramLink !== existingSettings.instagramLink) {
        await existingSettings.update({ instagramLink });
        count++;
      }
      if (twitterLink && twitterLink !== existingSettings.twitterLink) {
        await existingSettings.update({ twitterLink });
        count++;
      }
      if (youtubeLink && youtubeLink !== existingSettings.youtubeLink) {
        await existingSettings.update({ youtubeLink });
        count++;
      }
      if (facebookLink && facebookLink !== existingSettings.facebookLink) {
        await existingSettings.update({ facebookLink });
        count++;
      }
      if (phoneNumber && phoneNumber !== existingSettings.phoneNumber) {
        await existingSettings.update({ phoneNumber });
        count++;
      }
      if (email && email !== existingSettings.email) {
        await existingSettings.update({ email });
        count++;
      }
      if (appIntroduction && appIntroduction !== existingSettings.appIntroduction) {
        await existingSettings.update({ appIntroduction });
        count++;
      }
      if (count > 0) {
        return res.status(200).json({ status: 200, message: "Age has been changed" });
      } else {
        return res.status(200).json({ status: 200, message: "Nothing is changed" });
      }
    } else {
      return res.status(401).json({ status: 401, message: "Age not found" });
    }
  } catch (error) {
    console.log("error", error.message);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

exports.getSingleSettings = async (req, res, next) => {
  try {
    const settingsId = req.params.id;
    const settingsData = await settingsModel.findOne({ where: { id: settingsId } });
    if (!settingsData) {
      return res.status(400).json({ status: 400, message: "No data available" });
    }
    return res.status(200).json({ status: 200, message: "Success", data: settingsData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
