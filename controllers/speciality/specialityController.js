const specialityModel = require("../../models/speciality/specialityModel");
const sportsModel = require("../../models/common/sportsModel");
exports.addSpeciality = async (req, res, next) => {
  try {
    const { specialityTitle, sportId } = req.body;

    // Log input parameters
    console.log("Received:", { specialityTitle, sportId });

    // Check if the sport exists
    const existingSport = await sportsModel.findOne({
      where: { id: sportId }
    });
    if (!existingSport) {
      return res.status(400).json({ status: 400, message: "Sport not found" });
    }

    // Create the new speciality
    const createSpeciality = await specialityModel.create({
      specialityTitle,
      sportId
    });

    // Log the created speciality
    console.log("createSpeciality:", createSpeciality);

    return res.status(201).json({ status: 201, message: "Speciality created" });
  } catch (error) {
    console.error("Error creating speciality:", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
exports.editSpeciality = async (req, res, next) => {
  try {
    const { id, specialityTitle, sportId } = req.body;
    console.log("Received:", { id, specialityTitle, sportId });
    const existingSpecility = await specialityModel.findOne({ where: { id } });
    console.log("existingSpecility", existingSpecility);
    if (existingSpecility) {
      let count = 0;
      if (specialityTitle && specialityTitle !== existingSpecility.specialityTitle) {
        await existingSpecility.update({ specialityTitle });
        count++;
      }
      if (sportId && sportId !== existingSpecility.sportId) {
        await existingSpecility.update({ sportId });
        count++;
      }
      if (count > 0) {
        return res.status(200).json({ status: 200, message: "Data updates successfully" });
      } else {
        return res.status(200).json({ status: 200, message: "Nothing is changed" });
      }
    } else {
      return res.status(401).json({ status: 401, message: "No data found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
exports.deleteSpeciality = async (req, res, next) => {
  try {
    const specialityId = req.params.id;
    console.log(specialityId);
    const result = await specialityModel.destroy(
      {
        where: {
          id: specialityId
        }
      }
    );
    if (result > 0) {
      return res.status(200).json({ status: 200, message: "Speciality deleted successfully" });
    } else {
      return res.status(404).json({ status: 404, message: "Speciality not found or already deleted" });
    }
  } catch (error) {
    console.log("Delete Speciality API error:", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
exports.getAllSpeciality = async (req, res, next) => {
  try {
    const allSpecialityData = await specialityModel.findAll();
    const allSport = await sportsModel.findAll();
    const specialityData = allSpecialityData.map((speciality) => {
      const sportData = allSport.find((sport) => sport.id === speciality.sportId);
      return {
        specialityData: speciality,
        sportData
      };
    });
    // const specialityData = await specialityModel.findAll();
    return res.status(200).json({ status: 200, message: "Success", specialityData });
  } catch (error) {
    console.error("Get all sport API error:", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
exports.getSpeciality = async (req, res, next) => {
  try {
    const specialityId = req.params.specialityId;
    console.log(specialityId);
    const specialityData = await specialityModel.findOne({ where: { id: specialityId } });
    const sportData = await sportsModel.findOne({ where: { id: specialityData?.sportId } });
    if (specialityData) {
      return res.status(200).json({ status: 200, message: "Success", data: { specialityData, sportData } });
    } else {
      return res.status(400).json({ status: 400, message: "Data not found" });
    }
  } catch (error) {
    console.error("Error in singleSport:", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

exports.getSportsBasedSpeciality = async (req, res, next) => {
  try {
    const { sportId } = req.query;
    console.log("sportId", sportId);
    const sportIds = sportId.split(",").map(id => parseInt(id, 10));

    const specialityData = await specialityModel.findAll({
      where: {
        sportId: sportIds
      }
    });

    if (specialityData && specialityData.length > 0) {
      return res.status(200).json({ status: 200, message: "Success", data: specialityData });
    } else {
      return res.status(404).json({ status: 404, message: "Specialities not found" });
    }
  } catch (error) {
    console.error("Error fetching specialities:", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
