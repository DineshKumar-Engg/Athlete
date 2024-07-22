const statesModel = require("../../models/states/statesModel");
const citiesModel = require("../../models/cities/citiesModel");
exports.getAllCities = async (req, res, next) => {
  try {
    const { stateId } = req.query;

    let citiesData;

    if (!stateId || stateId === "0") {
      // Fetch all states and cities
      citiesData = await citiesModel.findAll();
    } else {
      // Fetch specific states and their cities
      const stateIds = stateId.split(",").map((id) => parseInt(id, 10));

      citiesData = await citiesModel.findAll({
        where: {
          stateId: stateIds
        },
        order: [["name", "ASC"]]
      });
    }

    // Combine states and cities data
    // const result = citiesData.filter(city => city.stateId === stateId);

    return res.status(200).json({ status: 200, citiesData });
  } catch (error) {
    console.error("Error fetching data:", error);

    // Handle the error and send a response
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};
exports.allCities = async (req, res, next) => {
  try {
    const citiesData = await citiesModel.findAll({
      order: [["name", "ASC"]]
    });
    return res.status(200).json({ status: 200, message: "Success", citiesData });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
exports.getAllStates = async (req, res, next) => {
  try {
    const allStates = await statesModel.findAll({
      order: [["name", "ASC"]]
    });
    if (allStates) {
      return res
        .status(200)
        .json({ status: 200, message: "Success", data: allStates });
    } else {
      return res.status(400).json({ status: 400, message: "Data not found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};
