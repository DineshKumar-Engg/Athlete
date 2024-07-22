const { Op } = require("sequelize");
const promocodeModel = require("../../models/common/promocodeModel");
const sportsModel = require("../../models/common/sportsModel");
const roleModel = require("../../models/role/roleModel");
const userModel = require("../../models/user/userModel");
const athleteModel = require("../../models/athlete/athleteModel");
const academieModel = require("../../models/academies/academiesModel");
const transactionHistoryModel = require("../../models/transaction/transactionHistoryModel");
const stateModel = require("../../models/states/statesModel");
const cityModel = require("../../models/cities/citiesModel");
exports.promocodeReport = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const whereClause = {};
    if (req.query.sportId && req.query.sportId !== "0") {
      whereClause.sportId = req.query.sportId;
    }
    if (req.query.roleId && req.query.roleId !== "0") {
      whereClause.roleId = req.query.roleId;
    }
    if (req.query.promocodeName) {
      whereClause.promocodeName = { [Op.like]: `%${req.query.promocodeName}%` };
    }
    if (req.query.startDate) {
      whereClause.startDate = { [Op.like]: `%${req.query.startDate}%` };
    }
    if (req.query.endDate) {
      whereClause.endDate = { [Op.like]: `%${req.query.endDate}%` };
    }
    if (req.query.isEnable) {
      whereClause.isEnable = { [Op.like]: `%${req.query.isEnable}%` };
    }
    const allPromocodes = await promocodeModel.findAll({
      where: whereClause,
      include: [
        // { model: sportsModel },
        { model: roleModel }
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset
    });
    return res.status(200).json({ status: 200, message: "Success", allPromocodes });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

exports.athleteReport = async (req, res) => {
  try {
    const { age, gender, residentialState, city, isSubscription, isPublish, startDate, endDate, sportsId } = req.query;

    // Process sportsId into an array if it exists
    const sportsIds = sportsId ? sportsId.split(",").map(id => parseInt(id, 10)) : null;

    // Create an array of LIKE conditions for each sportsId
    const sportsIdConditions = sportsIds ? sportsIds.map(id => ({
      sportsId: {
        [Op.like]: `%${id}%`
      }
    })) : null;

    let athleteWhereClause = {
      deletedAt: { [Op.is]: null },
      ...(age && { age }),
      ...(gender && { gender }),
      ...(isPublish && { isPublish }),
      ...(isSubscription && { isSubscription }),
      ...(residentialState && { residentialState }),
      ...(city && { city }),
      ...(sportsIdConditions && { [Op.or]: sportsIdConditions }),
    };

    let transactionHistoryWhereClause = {
      deletedAt: { [Op.is]: null },
      ...(startDate && { startDate: { [Op.gte]: startDate } }),
      ...(endDate && { endDate: { [Op.lte]: endDate } }),
    };

    // Fetch users with their associated athletes and transaction histories
    const users = await userModel.findAll({
      where: {
        deletedAt: { [Op.is]: null },
        roleId: 2,
      },
      include: [
        {
          model: athleteModel,
          as: "athletes",
          where: athleteWhereClause,
          required: true,
        },
        {
          model: transactionHistoryModel,
          as: "transactionhistories",
          where: transactionHistoryWhereClause,
          required: false,
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: 20,
    });

    // Fetch all states, cities, and sports
    const stateAll = await stateModel.findAll();
    const cityAll = await cityModel.findAll();
    const sportsAll = await sportsModel.findAll();

    // Map state, city, and sports data
    const stateMap = stateAll.reduce((acc, state) => {
      acc[state.id] = state;
      return acc;
    }, {});

    const cityMap = cityAll.reduce((acc, city) => {
      acc[city.id] = city;
      return acc;
    }, {});

    const sportsMap = sportsAll.reduce((acc, sport) => {
      acc[sport.id] = sport;
      return acc;
    }, {});

    const usersWithStateCity = users.map(user => {
      const athletesWithStateCity = user.athletes.map(athlete => {
        return {
          ...athlete.get(),
          residentialStateData: stateMap[athlete.residentialState],
          cityData: cityMap[athlete.city],
          sportsData: athlete.sportsId.split(",").map(id => sportsMap[id]) // Map sports data
        };
      });
      return {
        ...user.get(),
        athletes: athletesWithStateCity,
      };
    });

    res.status(200).json({
      status: 200,
      message: "Success",
      users: usersWithStateCity,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};
// Academie report
exports.academieReport = async (req, res) => {
  try {
    const { academieName, state, city, isSubscription, isPublish, startDate, endDate, sportsId } = req.query;

    // Process sportsId into an array if it exists
    const sportsIds = sportsId ? sportsId.split(",").map(id => parseInt(id, 10)) : null;

    // Create an array of LIKE conditions for each sportsId
    const sportsIdConditions = sportsIds ? sportsIds.map(id => ({
      sportsId: {
        [Op.like]: `%${id}%`
      } 
    })) : null;

    // Process sportsId into an array if it exists
    const stateIds = state ? state.split(",").map(id => parseInt(id, 10)) : null;

    // Create an array of LIKE conditions for each sportsId
    const stateIdConditions = state ? stateIds.map(id => ({
      sportsId: {
        [Op.like]: `%${id}%`
      } 
    })) : null;

    let academieWhereClause = {
      deletedAt: { [Op.is]: null },
      ...(academieName && { academieName }),
      ...(isPublish && { isPublish }),
      ...(isSubscription && { isSubscription }),
      ...(stateIdConditions && { [Op.or]: stateIdConditions }),
      ...(city && { city }),
      ...(sportsIdConditions && { [Op.or]: sportsIdConditions }),
    };

    let transactionHistoryWhereClause = {
      deletedAt: { [Op.is]: null },
      ...(startDate && { startDate: { [Op.gte]: startDate } }),
      ...(endDate && { endDate: { [Op.lte]: endDate } }),
    };

    // Fetch users with their associated athletes and transaction histories
    const users = await userModel.findAll({
      where: {
        deletedAt: { [Op.is]: null },
        roleId: 4,
      },
      include: [
        {
          model: academieModel,
          as: "academies",
          where: academieWhereClause,
          required: true,
        },
        {
          model: transactionHistoryModel,
          as: "transactionhistories",
          where: transactionHistoryWhereClause,
          required: false,
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: 20,
    });

    // Fetch all states, cities, and sports
    const stateAll = await stateModel.findAll();
    const cityAll = await cityModel.findAll();
    const sportsAll = await sportsModel.findAll();

    // Map state, city, and sports data
    const stateMap = stateAll.reduce((acc, state) => {
      acc[state.id] = state;
      return acc;
    }, {});

    const cityMap = cityAll.reduce((acc, city) => {
      acc[city.id] = city;
      return acc;
    }, {});

    const sportsMap = sportsAll.reduce((acc, sport) => {
      acc[sport.id] = sport;
      return acc;
    }, {});

    const usersWithStateCity = users.map(user => {
      const academiesWithStateCity = user.academies.map(academie => {
        return {
          ...academie.get(),
          stateData: academie.state.split(",").map(id => stateMap[id]), // Map state data
          cityData: academie.city.split(",").map(id => cityMap[id]), // Map sports data
          sportsData: academie.sportsId.split(",").map(id => sportsMap[id]) // Map sports data
        };
      });
      return {
        ...user.get(),
        academies: academiesWithStateCity,
      };
    });

    res.status(200).json({
      status: 200,
      message: "Success",
      users: usersWithStateCity,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};
// Reports
exports.athletePurchaseReport = async (req, res) => {
  try {
    const { age, gender, residentialState, city, isSubscription, isPublish, startDate, endDate, sportsId } = req.query;

    // Process sportsId into an array if it exists
    const sportsIds = sportsId ? sportsId.split(",").map(id => parseInt(id, 10)) : null;

    // Create an array of LIKE conditions for each sportsId
    const sportsIdConditions = sportsIds ? sportsIds.map(id => ({
      sportsId: {
        [Op.like]: `%${id}%`
      }
    })) : null;

    let athleteWhereClause = {
      deletedAt: { [Op.is]: null },
      ...(age && { age }),
      ...(gender && { gender }),
      ...(isPublish && { isPublish }),
      ...(isSubscription && { isSubscription }),
      ...(residentialState && { residentialState }),
      ...(city && { city }),
      ...(sportsIdConditions && { [Op.or]: sportsIdConditions }),
    };

    // let transactionHistoryWhereClause = {
    //   deletedAt: { [Op.is]: null },
    //   ...(startDate && { createdAt: { [Op.gte]: startDate } }),
    //   ...(endDate && { createdAt: { [Op.lte]: endDate } }),
    // };

    let transactionHistoryWhereClause = {
      deletedAt: { [Op.is]: null },
      ...(startDate && { startDate: { [Op.eq]: startDate } }),
      ...(endDate && { endDate: { [Op.eq]: endDate } }),
    };
    
    // Log the constructed where clauses
    console.log("athleteWhereClause:", athleteWhereClause);
    console.log("transactionHistoryWhereClause:", transactionHistoryWhereClause);

    // Fetch transaction histories with their associated users and athletes
    const transactionHistories = await transactionHistoryModel.findAll({
      where: {
        ...transactionHistoryWhereClause,
        roleId: 2,
      },
      include: [
        {
          model: userModel,
          as: "user",
          required: true,
          include: [
            {
              model: athleteModel,
              as: "athletes",
              where: athleteWhereClause,
              required: true,
            }
          ]
        }
      ],
      order: [["createdAt", "DESC"]],
      limit: 20,
    });

    // Fetch all states, cities, and sports
    const stateAll = await stateModel.findAll();
    const cityAll = await cityModel.findAll();
    const sportsAll = await sportsModel.findAll();

    // Map state, city, and sports data
    const stateMap = stateAll.reduce((acc, state) => {
      acc[state.id] = state;
      return acc;
    }, {});

    const cityMap = cityAll.reduce((acc, city) => {
      acc[city.id] = city;
      return acc;
    }, {});

    const sportsMap = sportsAll.reduce((acc, sport) => {
      acc[sport.id] = sport;
      return acc;
    }, {});

    // Map the transaction histories to include state, city, and sports data
    const transactionHistoriesWithStateCity = transactionHistories.map(transactionHistory => {
      const user = transactionHistory.user;
      const athletesWithStateCity = user.athletes.map(athlete => {
        return {
          ...athlete.get(),
          residentialStateData: stateMap[athlete.residentialState],
          cityData: cityMap[athlete.city],
          sportsData: athlete.sportsId.split(",").map(id => sportsMap[id]) // Map sports data
        };
      });
      return {
        ...transactionHistory.get(),
        user: {
          ...user.get(),
          athletes: athletesWithStateCity,
        },
      };
    });

    res.status(200).json({
      status: 200,
      message: "Success",
      transactionHistories: transactionHistoriesWithStateCity,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};

// Academie report
exports.academiePurcahseReport = async (req, res) => {
  try {
    const { academieName, state, city, isSubscription, isPublish, startDate, endDate, sportsId } = req.query;

    // Process sportsId into an array if it exists
    const sportsIds = sportsId ? sportsId.split(",").map(id => parseInt(id, 10)) : null;

    // Create an array of LIKE conditions for each sportsId
    const sportsIdConditions = sportsIds ? sportsIds.map(id => ({
      sportsId: {
        [Op.like]: `%${id}%`
      } 
    })) : null;

    // Process sportsId into an array if it exists
    const stateIds = state ? state.split(",").map(id => parseInt(id, 10)) : null;

    // Create an array of LIKE conditions for each sportsId
    const stateIdConditions = state ? stateIds.map(id => ({
      sportsId: {
        [Op.like]: `%${id}%`
      } 
    })) : null;

    let academieWhereClause = {
      deletedAt: { [Op.is]: null },
      ...(academieName && { academieName }),
      ...(isPublish && { isPublish }),
      ...(isSubscription && { isSubscription }),
      ...(stateIdConditions && { [Op.or]: stateIdConditions }),
      ...(city && { city }),
      ...(sportsIdConditions && { [Op.or]: sportsIdConditions }),
    };

    let transactionHistoryWhereClause = {
      deletedAt: { [Op.is]: null },
      ...(startDate && { startDate: { [Op.eq]: startDate } }),
      ...(endDate && { endDate: { [Op.eq]: endDate } }),
    };

    // Fetch users with their associated athletes and transaction histories
    // const users = await userModel.findAll({
    //   where: {
    //     deletedAt: { [Op.is]: null },
    //     roleId: 4,
    //   },
    //   include: [
    //     {
    //       model: academieModel,
    //       as: "academies",
    //       where: academieWhereClause,
    //       required: true,
    //     },
    //     {
    //       model: transactionHistoryModel,
    //       as: "transactionhistories",
    //       where: transactionHistoryWhereClause,
    //       required: false,
    //     },
    //   ],
    //   order: [["createdAt", "DESC"]],
    //   limit: 20,
    // });
    // Fetch transaction histories with their associated users and athletes
    const transactionHistories = await transactionHistoryModel.findAll({
      where: {
        ...transactionHistoryWhereClause,
        roleId: 4,
      },
      include: [
        {
          model: userModel,
          as: "user",
          required: true,
          include: [
            {
              model: academieModel,
              as: "academies",
              where: academieWhereClause,
              required: true,
            }
          ]
        }
      ],
      order: [["createdAt", "DESC"]],
      limit: 20,
    });
    // Fetch all states, cities, and sports
    const stateAll = await stateModel.findAll();
    const cityAll = await cityModel.findAll();
    const sportsAll = await sportsModel.findAll();

    // Map state, city, and sports data
    const stateMap = stateAll.reduce((acc, state) => {
      acc[state.id] = state;
      return acc;
    }, {});

    const cityMap = cityAll.reduce((acc, city) => {
      acc[city.id] = city;
      return acc;
    }, {});

    const sportsMap = sportsAll.reduce((acc, sport) => {
      acc[sport.id] = sport;
      return acc;
    }, {});

    // const usersWithStateCity = users.map(user => {
    //   const academiesWithStateCity = user.academies.map(academie => {
    //     return {
    //       ...academie.get(),
    //       stateData: academie.state.split(",").map(id => stateMap[id]), // Map state data
    //       cityData: academie.city.split(",").map(id => cityMap[id]), // Map sports data
    //       sportsData: academie.sportsId.split(",").map(id => sportsMap[id]) // Map sports data
    //     };
    //   });
    //   return {
    //     ...user.get(),
    //     academies: academiesWithStateCity,
    //   };
    // });
    // Map the transaction histories to include state, city, and sports data
    const transactionHistoriesWithStateCity = transactionHistories.map(transactionHistory => {
      const user = transactionHistory.user;
      const academiesWithStateCity = user.academies.map(academie => {
        return {
          ...academie.get(),
          stateData: academie.state.split(",").map(id => stateMap[id]),
          cityData: academie.city.split(",").map(id => cityMap[id]),
          sportsData: academie.sportsId.split(",").map(id => sportsMap[id]) // Map sports data
        };
      });
      return {
        ...transactionHistory.get(),
        user: {
          ...user.get(),
          academies: academiesWithStateCity,
        },
      };
    });

    res.status(200).json({
      status: 200,
      message: "Success",
      transactionHistories: transactionHistoriesWithStateCity,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};

exports.promocodePurchaseReport = async (req, res, next) => {
  try {
    const { roleId, promocodeName, startDate, endDate, isEnable } = req.query;

    // Ensure all values are properly parsed and used in the query
    let promocodeWhereClause = {
      deletedAt: { [Op.is]: null },
      ...(roleId && { roleId }),
      ...(promocodeName && { promocodeName: { [Op.eq]: promocodeName } }),
      ...(startDate && { startDate: { [Op.eq]: startDate } }),
      ...(endDate && { endDate: { [Op.eq]: endDate } }),
      ...(isEnable && { isEnable: {isEnable} }) // Convert isEnable to a boolean
    };

    // Log the constructed where clauses
    console.log("promocodeWhereClause:", promocodeWhereClause);

    // Fetch transaction histories with their associated users and athletes
    const transactionHistories = await transactionHistoryModel.findAll({
      where: {
        deletedAt: { [Op.is]: null }
      },
      include: [
        {
          model: userModel,
          as: "user",
          required: true,
        },
        {
          model: promocodeModel,
          as: "promocode",
          where: promocodeWhereClause,
          required: true,
          include: [
            {
              model: roleModel,
              as: "role",
              required: true,
            }
          ]
        }
      ],
      order: [["createdAt", "DESC"]],
      limit: 20,
    });

    // Log the transactionHistories result
    console.log("transactionHistories:", transactionHistories);

    res.status(200).json({
      status: 200,
      message: "Success",
      transactionHistories
    });
  } catch (error) {
    console.error("error", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
