// const { Op, fn, col, sequelize, literal  } = require("sequelize");
const { Op, literal  } = require("sequelize");
const athleteModel = require("../../models/athlete/athleteModel");
const coachModel = require("../../models/coach/coachModel");
const academieModel = require("../../models/academies/academiesModel");
const userModel = require("../../models/user/userModel");
const transactionhistoryModel = require("../../models/transaction/transactionHistoryModel");
exports.totalProfileReport = async(req, res, next) =>{
  try {
    const isAdminId = req.user.id;
    const existingUser = await userModel.findOne({where:{id: isAdminId, roleId: 1}});
    if(!existingUser) {
      return res.status(400).json({status: 400, message: "User not found"});
    }
    const userCount = await userModel.count();
    console.log("total user", userCount);
    return res.status(200).json({status: 200, message: "Success", userCount});
  } catch (error) {
    console.log("error", error);
  }
};
// exports.overAllReport = async(req, res, next) =>{
//   try {
//     const isAdminId = req.user.id;
//     const existingUser = await userModel.findOne({where:{id: isAdminId, roleId: 1}});
//     if(!existingUser) {
//       return res.status(400).json({status: 400, message: "User not found"});
//     }
//     const { state, sportsId, asOfDate } = req.query;
//     const userCount = await userModel.count();
//     console.log("total user", userCount);
//     // const athleteCount = await athleteModel.count();
//     // const coachCount = await coachModel.count();
//     // const academieCount = await academieModel.count(); 

//     // Athlete Handling
//     // Process sportsId into an array if it exists
//     const sportsIds = sportsId ? sportsId.split(",").map(id => parseInt(id, 10)) : null;

//     // Create an array of LIKE conditions for each sportsId
//     const sportsIdConditions = sportsIds ? sportsIds.map(id => ({
//       sportsId: {
//         [Op.like]: `%${id}%`
//       }
//     })) : null;
    
//     let athleteWhereClause = {
//       deletedAt: { [Op.is]: null },
//       ...(state && { residentialState: state }),
//       ...(asOfDate && {
//         [Op.and]: [
//           fn("DATE", col("createdAt")), // Extract date part from createdAt
//           { [Op.eq]: asOfDate }
//         ]
//       }),
//       ...(sportsIdConditions && { [Op.or]: sportsIdConditions }),
//     };
    
//     const athleteActiveProfile = await athleteModel.count({
//       where: {
//         ...athleteWhereClause,
//         isSubscription: "Active",
//       }
//     });
    
//     const athleteInActiveProfile = await athleteModel.count({
//       where: {
//         ...athleteWhereClause,
//         isSubscription: "Inactive",
//       }
//     });
    
//     const athleteExpiredProfile = await athleteModel.count({
//       where: {
//         ...athleteWhereClause,
//         isSubscription: "Expired",
//       }
//     });

//     // Coach Handling
//     // Process sportsId into an array if it exists
//     //  const sportsIds = sportsId ? sportsId.split(",").map(id => parseInt(id, 10)) : null;

//     // Create an array of LIKE conditions for each sportsId
//     //  const sportsIdConditions = sportsIds ? sportsIds.map(id => ({
//     //    sportsId: {
//     //      [Op.like]: `%${id}%`
//     //    }
//     //  })) : null;

//     let coachWhereClause = {
//       deletedAt: { [Op.is]: null },
//       ...(state && { state }),
//       ...(asOfDate && {
//         [Op.and]: [
//           fn("DATE", col("createdAt")), // Extract date part from createdAt
//           { [Op.eq]: asOfDate }
//         ]
//       }),
//       ...(sportsIdConditions && { [Op.or]: sportsIdConditions }),
//     };

//     const coachActiveProfile = await coachModel.count({
//       where: {
//         ...coachWhereClause,
//         isSubscription: "Active",
//       }
//     });

//     const coachInActiveProfile = await coachModel.count({
//       where: {
//         ...coachWhereClause,
//         isSubscription: "Inactive",
//       }
//     });

//     // Academie handling
//     let academieWhereClause = {
//       deletedAt: { [Op.is]: null },
//       ...(state && { state }),
//       ...(asOfDate && {
//         [Op.and]: [
//           fn("DATE", col("createdAt")), // Extract date part from createdAt
//           { [Op.eq]: asOfDate }
//         ]
//       }),
//       ...(sportsIdConditions && { [Op.or]: sportsIdConditions }),
//     };

//     const academieActiveProfile = await academieModel.count({
//       where: {
//         ...academieWhereClause,
//         isSubscription: "Active",
//       }
//     });

//     const academieInActiveProfile = await academieModel.count({
//       where: {
//         ...academieWhereClause,
//         isSubscription: "Inactive",
//       }
//     });

//     const academieExpiredProfile = await academieModel.count({
//       where: {
//         ...academieWhereClause,
//         isSubscription: "Expired",
//       }
//     });
//     const ActiveProfileCount = athleteActiveProfile + coachActiveProfile + academieActiveProfile;
//     const InActiveProfileCount = athleteInActiveProfile + coachInActiveProfile + academieInActiveProfile;
//     const EcpiredProfileCount = athleteExpiredProfile + academieExpiredProfile;

//     return res.status(200).json({status: 200, message: "Success", ActiveProfileCount, InActiveProfileCount, EcpiredProfileCount});
//   } catch (error) {
//     console.log("error", error);
//     res.status(500).json({
//       status: 500,
//       message: "Internal server error",
//     });
//   }
// };


exports.overAllReport = async (req, res, next) => {
  try {
    const isAdminId = req.user.id;
    const existingUser = await userModel.findOne({ where: { id: isAdminId, roleId: 1 } });

    if (!existingUser) {
      return res.status(400).json({ status: 400, message: "User not found" });
    }

    const { state, sportsId, asOfDate } = req.query;

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
      ...(state && { residentialState: state }),
      ...(sportsIdConditions && { [Op.or]: sportsIdConditions }),
    };

    let coachWhereClause = {
      deletedAt: { [Op.is]: null },
      ...(state && { state }),
      ...(sportsIdConditions && { [Op.or]: sportsIdConditions }),
    };

    let academieWhereClause = {
      deletedAt: { [Op.is]: null },
      ...(state && { state }),
      ...(sportsIdConditions && { [Op.or]: sportsIdConditions }),
    };

    if (asOfDate) {
      athleteWhereClause = {
        ...athleteWhereClause,
        [Op.and]: literal(`DATE(createdAt) = '${asOfDate}'`)
      };
      coachWhereClause = {
        ...coachWhereClause,
        [Op.and]: literal(`DATE(createdAt) = '${asOfDate}'`)
      };
      academieWhereClause = {
        ...academieWhereClause,
        [Op.and]: literal(`DATE(createdAt) = '${asOfDate}'`)
        // [Op.and]: [
        //   sequelize.where(fn("DATE", col("createdAt")), asOfDate),
        // ]
      };
    }

    const [athleteActiveProfile, athleteInActiveProfile, athleteExpiredProfile] = await Promise.all([
      athleteModel.count({ where: { ...athleteWhereClause, isSubscription: "Active" } }),
      athleteModel.count({ where: { ...athleteWhereClause, isSubscription: "Inactive" } }),
      athleteModel.count({ where: { ...athleteWhereClause, isSubscription: "Expired" } }),
    ]);

    const [coachActiveProfile, coachInActiveProfile] = await Promise.all([
      coachModel.count({ where: { ...coachWhereClause, isSubscription: "Active" } }),
      coachModel.count({ where: { ...coachWhereClause, isSubscription: "Inactive" } }),
    ]);

    const [academieActiveProfile, academieInActiveProfile, academieExpiredProfile] = await Promise.all([
      academieModel.count({ where: { ...academieWhereClause, isSubscription: "Active" } }),
      academieModel.count({ where: { ...academieWhereClause, isSubscription: "Inactive" } }),
      academieModel.count({ where: { ...academieWhereClause, isSubscription: "Expired" } }),
    ]);

    const ActiveProfileCount = athleteActiveProfile + coachActiveProfile + academieActiveProfile;
    const InActiveProfileCount = athleteInActiveProfile + coachInActiveProfile + academieInActiveProfile;
    const ExpiredProfileCount = athleteExpiredProfile + academieExpiredProfile;

    return res.status(200).json({ status: 200, message: "Success", ActiveProfileCount, InActiveProfileCount, ExpiredProfileCount });
  } catch (error) {
    console.error("error", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

exports.athleteReport = async (req, res, next) => {
  try {
    const isAdminId = req.user.id;
    const existingUser = await userModel.findOne({ where: { id: isAdminId, roleId: 1 } });
    if (!existingUser) {
      return res.status(400).json({ status: 400, message: "User not found" });
    }

    const { state, sportsId, asOfDate } = req.query;

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
      ...(state && { residentialState: state }),
      ...(asOfDate && {
        [Op.and]: literal(`DATE(createdAt) = '${asOfDate}'`)
      }),
      ...(sportsIdConditions && { [Op.or]: sportsIdConditions }),
    };

    const athleteActiveProfile = await athleteModel.count({
      where: {
        ...athleteWhereClause,
        isSubscription: "Active",
      }
    });

    const athleteInActiveProfile = await athleteModel.count({
      where: {
        ...athleteWhereClause,
        isSubscription: "Inactive",
      }
    });

    const athleteExpiredProfile = await athleteModel.count({
      where: {
        ...athleteWhereClause,
        isSubscription: "Expired",
      }
    });

    return res.status(200).json({
      status: 200,
      message: "Success",
      athleteActiveProfile,
      athleteInActiveProfile,
      athleteExpiredProfile
    });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};
exports.academieReport = async(req, res, next) => {
  try {
    const isAdminId = req.user.id;
    const existingUser = await userModel.findOne({where: {id: isAdminId, roleId: 1}});
    if (!existingUser) {
      return res.status(400).json({status: 400, message: "User not found"});
    }

    const { state, sportsId, asOfDate } = req.query;

    // Process sportsId into an array if it exists
    const sportsIds = sportsId ? sportsId.split(",").map(id => parseInt(id, 10)) : null;

    // Create an array of LIKE conditions for each sportsId
    const sportsIdConditions = sportsIds ? sportsIds.map(id => ({
      sportsId: {
        [Op.like]: `%${id}%`
      }
    })) : null;

    let academieWhereClause = {
      deletedAt: { [Op.is]: null },
      ...(state && { state }),
      ...(asOfDate && {
        [Op.and]: literal(`DATE(createdAt) = '${asOfDate}'`)
      }),
      ...(sportsIdConditions && { [Op.or]: sportsIdConditions }),
    };

    const academieActiveProfile = await academieModel.count({
      where: {
        ...academieWhereClause,
        isSubscription: "Active",
      }
    });

    const academieInActiveProfile = await academieModel.count({
      where: {
        ...academieWhereClause,
        isSubscription: "Inactive",
      }
    });

    const academieExpiredProfile = await academieModel.count({
      where: {
        ...academieWhereClause,
        isSubscription: "Expired",
      }
    });

    return res.status(200).json({
      status: 200,
      message: "Success",
      academieActiveProfile,
      academieInActiveProfile,
      academieExpiredProfile
    });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};
exports.coachReport = async(req, res, next) => {
  try {
    const isAdminId = req.user.id;
    const existingUser = await userModel.findOne({where: {id: isAdminId, roleId: 1}});
    if (!existingUser) {
      return res.status(400).json({status: 400, message: "User not found"});
    }

    const { state, sportsId, asOfDate } = req.query;

    // Process sportsId into an array if it exists
    const sportsIds = sportsId ? sportsId.split(",").map(id => parseInt(id, 10)) : null;

    // Create an array of LIKE conditions for each sportsId
    const sportsIdConditions = sportsIds ? sportsIds.map(id => ({
      sportsId: {
        [Op.like]: `%${id}%`
      }
    })) : null;

    let coachWhereClause = {
      deletedAt: { [Op.is]: null },
      ...(state && { state }),
      ...(asOfDate && {
        [Op.and]: literal(`DATE(createdAt) = '${asOfDate}'`)
      }),
      ...(sportsIdConditions && { [Op.or]: sportsIdConditions }),
    };

    const coachActiveProfile = await coachModel.count({
      where: {
        ...coachWhereClause,
        isSubscription: "Active",
      }
    });

    const coachInActiveProfile = await coachModel.count({
      where: {
        ...coachWhereClause,
        isSubscription: "Inactive",
      }
    });

    // const academieExpiredProfile = await coachModel.count({
    //   where: {
    //     ...academieWhereClause,
    //     isSubscription: "Expired",
    //   }
    // });

    return res.status(200).json({
      status: 200,
      message: "Success",
      coachActiveProfile,
      coachInActiveProfile,
      // academieExpiredProfile
    });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};

exports.athleteRevenue = async (req, res, next) => {
  try {
    const isAdminId = req.user.id;
    const existingUser = await userModel.findOne({ where: { id: isAdminId, roleId: 1 } });
    if (!existingUser) {
      return res.status(400).json({ status: 400, message: "User not found" });
    }

    const { year } = req.query;
    let athleteWhereClause;
    if (year === "All") {
      athleteWhereClause = {
        deletedAt: { [Op.is]: null },
      };
    } else {
      athleteWhereClause = {
        deletedAt: { [Op.is]: null },
        ...(year && {
          [Op.and]: literal(`YEAR(createdAt) = '${year}'`)
        }),
      };
    }

    const Allathlete = await athleteModel.count({
      where: {
        ...athleteWhereClause,
      }
    });

    const athleteActiveProfile = await athleteModel.count({
      where: {
        ...athleteWhereClause,
        isSubscription: "Active",
      }
    });

    const revenue = await transactionhistoryModel.sum("totalAmount", {
      where: {
        ...athleteWhereClause,
        roleId: 2,
      }
    });

    return res.status(200).json({
      status: 200,
      message: "Success",
      Allathlete,
      athleteActiveProfile,
      revenue
    });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};

exports.academieRevenue = async (req, res, next) => {
  try {
    const isAdminId = req.user.id;
    const existingUser = await userModel.findOne({ where: { id: isAdminId, roleId: 1 } });
    if (!existingUser) {
      return res.status(400).json({ status: 400, message: "User not found" });
    }

    const { year } = req.query;
    let academieWhereClause;
    if (year === "All") {
      academieWhereClause = {
        deletedAt: { [Op.is]: null },
      };
    } else {
      academieWhereClause = {
        deletedAt: { [Op.is]: null },
        ...(year && {
          [Op.and]: literal(`YEAR(createdAt) = '${year}'`)
        }),
      };
    }

    const Allacademie = await academieModel.count({
      where: {
        ...academieWhereClause,
      }
    });

    const academieActiveProfile = await academieModel.count({
      where: {
        ...academieWhereClause,
        isSubscription: "Active",
      }
    });

    const revenue = await transactionhistoryModel.sum("totalAmount", {
      where: {
        ...academieWhereClause,
        roleId: 4,
      }
    });

    return res.status(200).json({
      status: 200,
      message: "Success",
      Allacademie,
      academieActiveProfile,
      revenue
    });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};

exports.athleteRevenueMonth = async (req, res, next) => {
  try {
    const isAdminId = req.user.id;
    const existingUser = await userModel.findOne({ where: { id: isAdminId, roleId: 1 } });
    if (!existingUser) {
      return res.status(400).json({ status: 400, message: "User not found" });
    }

    const { year } = req.query;
    if (!year) {
      return res.status(400).json({ status: 400, message: "Year is required" });
    }

    let results = {};
    let finalResult = {
      Allathlete: 0,
      athleteActiveProfile: 0,
      revenue: 0
    };

    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    for (let i = 0; i < 12; i++) {
      const month = i + 1;

      let athleteWhereClause;
      if (year === "All") {
        athleteWhereClause = {
          deletedAt: { [Op.is]: null },
          [Op.and]: literal(`MONTH(createdAt) = '${month}'`)
        };
      } else {
        athleteWhereClause = {
          deletedAt: { [Op.is]: null },
          [Op.and]: [
            literal(`YEAR(createdAt) = '${year}'`),
            literal(`MONTH(createdAt) = '${month}'`)
          ]
        };
      }

      const Allathlete = await athleteModel.count({
        where: {
          ...athleteWhereClause,
        }
      });

      const athleteActiveProfile = await athleteModel.count({
        where: {
          ...athleteWhereClause,
          isSubscription: "Active",
        }
      });

      const revenue = await transactionhistoryModel.sum("totalAmount", {
        where: {
          ...athleteWhereClause,
          roleId: 2,
        }
      });

      results[months[i]] = {
        Allathlete,
        athleteActiveProfile,
        revenue
      };

      finalResult.Allathlete += Allathlete;
      finalResult.athleteActiveProfile += athleteActiveProfile;
      finalResult.revenue += revenue;
    }

    results.final = finalResult;

    return res.status(200).json({
      status: 200,
      message: "Success",
      data: results
    });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};

exports.academieRevenueMonth = async (req, res, next) => {
  try {
    const isAdminId = req.user.id;
    const existingUser = await userModel.findOne({ where: { id: isAdminId, roleId: 1 } });
    if (!existingUser) {
      return res.status(400).json({ status: 400, message: "User not found" });
    }

    const { year } = req.query;
    if (!year) {
      return res.status(400).json({ status: 400, message: "Year is required" });
    }

    let results = {};
    let finalResult = {
      Allacademie: 0,
      academieActiveProfile: 0,
      revenue: 0
    };

    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    for (let i = 0; i < 12; i++) {
      const month = i + 1;

      let academieWhereClause;
      if (year === "All") {
        academieWhereClause = {
          deletedAt: { [Op.is]: null },
          [Op.and]: literal(`MONTH(createdAt) = '${month}'`)
        };
      } else {
        academieWhereClause = {
          deletedAt: { [Op.is]: null },
          [Op.and]: [
            literal(`YEAR(createdAt) = '${year}'`),
            literal(`MONTH(createdAt) = '${month}'`)
          ]
        };
      }

      const Allacademie = await academieModel.count({
        where: {
          ...academieWhereClause,
        }
      });

      const academieActiveProfile = await academieModel.count({
        where: {
          ...academieWhereClause,
          isSubscription: "Active",
        }
      });

      const revenue = await transactionhistoryModel.sum("totalAmount", {
        where: {
          ...academieWhereClause,
          roleId: 4,
        }
      });

      results[months[i]] = {
        Allacademie,
        academieActiveProfile,
        revenue
      };

      finalResult.Allacademie += Allacademie;
      finalResult.academieActiveProfile += academieActiveProfile;
      finalResult.revenue += revenue;
    }

    results.final = finalResult;

    return res.status(200).json({
      status: 200,
      message: "Success",
      data: results
    });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};