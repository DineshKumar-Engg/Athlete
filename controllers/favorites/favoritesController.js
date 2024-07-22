const favoritesModel = require("../../models/favorites/favoritesModel");
const userModel = require("../../models/user/userModel");
const athleteModel = require("../../models/athlete/athleteModel");
const coachModel = require("../../models/coach/coachModel");
const academieModel = require("../../models/academies/academiesModel");
// const roleModel = require("../../models/role/roleModel");
const galleryModel = require("../../models/gallery/galleryModel");
const stateModel = require("../../models/states/statesModel");
const citiesModel = require("../../models/cities/citiesModel");
const specialityModel = require("../../models/speciality/specialityModel");
const sportsModel = require("../../models/common/sportsModel");
exports.favoritesAdd = async (req, res, next) => {
  try {
    const { userId, favoritesId, roleId } = req.body;
    const existingUser = await userModel.findOne({
      where: { id: userId }
    });
    console.log("existingUser", existingUser);
    if (!existingUser) {
      return res.status(401).json({ status: 401, message: "User not found" });
    }
    const existingFavorites = await favoritesModel.findOne({where:{userId, favoritesId, roleId}});
    if (existingFavorites) {
      return res.status(401).json({ status: 401, message: "Already added in favorites" });
    }
    const createFavorites = await favoritesModel.create({
      userId,
      favoritesId,
      roleId
    });
    console.log("createFavorites", createFavorites);
    return res.status(201).json({ status: 201, message: "Favorite added" });
  } catch (error) {
    console.error("Update page API error:", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
exports.favoritesRemove = async (req, res, next) => {
  try {
    const { id } = req.body;
    const existingFavorite = await favoritesModel.findOne({ where: { id } });
    console.log("existingFavorite", existingFavorite);
    if (!existingFavorite) {
      return res.status(401).json({ status: 401, message: "Favorite not found" });
    }

    const deletedFavorites = await favoritesModel.destroy({ where: { id } });
    console.log("deletedFavorites", deletedFavorites);

    // Optional check for deletion success (if number of affected rows is 0)
    if (deletedFavorites === 0) {
      return res.status(404).json({ status: 404, message: "Favorite deletion failed" });
    }

    return res.status(200).json({ status: 200, message: "Favorite deleted" });
  } catch (error) {
    console.error("Favorites Delete API error:", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
// exports.favoritesGetAll = async (req, res, next) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 20;
//     const offset = (page - 1) * limit;
//     const userId = req.query.userId;
//     const roleId = req.query.roleId;

//     console.log("userId", userId, "roleId", roleId);

//     // Fetch all favorites
//     const favoritesTable = await favoritesModel.findAll({
//       where: { userId, roleId },
//       limit,
//       offset,
//     });

//     if (!favoritesTable || favoritesTable.length === 0) {
//       return res.status(404).json({ status: 404, message: "No favorites found" });
//     }

//     // Fetch associated data for each favorite
//     const favoritesDataPromises = favoritesTable.map(async (favorite) => {
//       const userData = await userModel.findByPk(favorite.userId);
//       const favoriteUserData = await userModel.findByPk(favorite.favoritesId);
//       const galleryData = await galleryModel.findAll({
//         where: { userId: favorite.favoritesId },
//       });

//       // Conditionally fetch athlete, coach, or academy data based on roleId
//       let profileData = null;
//       let stateData = null;
//       let citiesData = null;
//       let specialityData = null;
//       let sportsData = null;
//       if (roleId == 2) {
//         profileData = await athleteModel.findAll({ where: { id: favoriteUserData.profileInfo } });
//         // Fetch stateData based on profileData
//         if (profileData && profileData[0].residentialState) {
//           stateData = await stateModel.findAll({ where: { id: profileData[0].residentialState } });
//         }
//         console.log("profileData[0].residentialState", profileData[0].residentialState);
//         // Fetch citiesData based on profileData
//         if (profileData && profileData[0].city) {
//           citiesData = await citiesModel.findAll({ where: { id: profileData[0].city } });
//           console.log("profileData[0].residentialState", profileData[0].city);
//         }
//         // Fetch specialityData based on profileData
//         if (profileData && profileData[0].athleteSpecialty) {
//           const specialityIds = profileData[0].athleteSpecialty.split(",").map(specialityId => specialityId.trim());
//           specialityData = await specialityModel.findAll({ where: { id: specialityIds}});
//         }
//         // Fetch specialityData based on profileData
//         if (profileData && profileData[0].sportsId) {
//           const sportIds = profileData[0].sportsId.split(",").map(sportsId => sportsId.trim());
//           sportsData = await sportsModel.findAll({ where: { id: sportIds}});
//         }

//         // Fetch stateData based on profileData
//         // if (profileData && profileData[0].sportsId) {
//         //   stateData = await sportsModel.findAll({ where: { id: profileData[0].sportsId } });
//         // }
//       } else if (roleId == 3) {
//         profileData = await coachModel.findAll({ where: { id: favoriteUserData.profileInfo } });
//         console.log("profileData", profileData);
//         // Fetch stateData based on profileData
//         if (profileData && profileData[0].state) {
//           const stateIds = profileData[0].state.split(",").map(stateId => stateId.trim());
//           stateData = await stateModel.findAll({ where: { id: stateIds } });
//         }
        
//         if (profileData && profileData[0].city) {
//           const cityIds = profileData[0].city.split(",").map(cityId => cityId.trim());
//           citiesData = await citiesModel.findAll({ where: { id: cityIds } });
//         }
//         // Fetch specialityData based on profileData
//         if (profileData && profileData[0].coachSpecialty) {
//           const specialityIds = profileData[0].coachSpecialty.split(",").map(specialityId => specialityId.trim());
//           specialityData = await specialityModel.findAll({ where: { id: specialityIds}});
//         }
//       } else if (roleId == 4) {
//         profileData = await academieModel.findAll({
//           where: { id: favoriteUserData.profileInfo },
//         });
//         if (profileData && profileData[0].state) {
//           const stateIds = profileData[0].state.split(",").map((stateId) => stateId.trim());
//           stateData = await stateModel.findAll({ where: { id: stateIds } });
//         }

//         if (profileData && profileData[0].city) {
//           const cityIds = profileData[0].city.split(",").map((cityId) => cityId.trim());
//           citiesData = await citiesModel.findAll({ where: { id: cityIds } });
//         }

//         // Fetch sportData based on profileData
//         if (profileData && profileData[0].sportsId) {
//           const sportIds = profileData[0].sportsId.split(",").map((sportsId) => sportsId.trim());
//           sportsData = await sportsModel.findAll({
//             where: { id: sportIds },
//           });
//         }
//       }

//       return {
//         favorite,
//         userData,
//         favoriteUserData,
//         galleryData,
//         profileData,
//         stateData,
//         citiesData,
//         sportsData,
//         specialityData
//       };
//     });

//     const favoritesData = await Promise.all(favoritesDataPromises);

//     return res.status(200).json({ status: 200, message: "Success", data: favoritesData });
//   } catch (error) {
//     console.error("Get all favorites API error:", error);
//     return res.status(500).json({ status: 500, message: "Internal server error" });
//   }
// };

exports.favoritesGetAll = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const userId = req.query.userId;
    const roleId = req.query.roleId;

    console.log("userId", userId, "roleId", roleId);

    // Fetch all favorites
    const favoritesTable = await favoritesModel.findAll({
      where: { userId, roleId },
      limit,
      offset,
    });

    if (!favoritesTable || favoritesTable.length === 0) {
      return res.status(404).json({ status: 404, message: "No favorites found" });
    }

    // Fetch associated data for each favorite
    const favoritesDataPromises = favoritesTable.map(async (favorite) => {
      const userData = await userModel.findByPk(favorite.userId);
      const favoriteUserData = await userModel.findByPk(favorite.favoritesId);

      const galleryData = await galleryModel.findAll({
        where: { userId: favorite?.favoritesId },
      });

      // Conditionally fetch athlete, coach, or academy data based on roleId
      let profileData = null;
      let stateData = null;
      let citiesData = null;
      let specialityData = null;
      let sportsData = null;
      if (roleId == 2) {
        profileData = await athleteModel.findAll({
          where: { id: favoriteUserData?.profileInfo },
        });
        // Fetch stateData based on profileData
        if (profileData && profileData[0].residentialState) {
          stateData = await stateModel.findAll({ where: { id: profileData[0]?.residentialState } });
        }
        // Fetch citiesData based on profileData
        if (profileData && profileData[0].city) {
          citiesData = await citiesModel.findAll({ where: { id: profileData[0]?.city } });
        }
        // Fetch specialityData based on profileData
        if (profileData && profileData[0].athleteSpecialty) {
          const specialityIds = profileData[0].athleteSpecialty.split(",").map(specialityId => specialityId.trim());
          specialityData = await specialityModel.findAll({ where: { id: specialityIds}});
        }
        // Fetch sportsData based on profileData
        if (profileData && profileData[0].sportsId) {
          const sportIds = profileData[0].sportsId.split(",").map(sportsId => sportsId.trim());
          sportsData = await sportsModel.findAll({ where: { id: sportIds}});
        }
      } else if (roleId == 3) {
        profileData = await coachModel.findAll({ where: { id: favoriteUserData.profileInfo } });
        // Fetch stateData based on profileData
        if (profileData && profileData[0].state) {
          const stateIds = profileData[0].state.split(",").map(stateId => stateId.trim());
          stateData = await stateModel.findAll({ where: { id: stateIds } });
        }
        if (profileData && profileData[0].city) {
          const cityIds = profileData[0].city.split(",").map(cityId => cityId.trim());
          citiesData = await citiesModel.findAll({ where: { id: cityIds } });
        }
        // Fetch specialityData based on profileData
        if (profileData && profileData[0].coachSpecialty) {
          const specialityIds = profileData[0].coachSpecialty.split(",").map(specialityId => specialityId.trim());
          specialityData = await specialityModel.findAll({ where: { id: specialityIds}});
        }
      } else if (roleId == 4) {
        profileData = await academieModel.findAll({
          where: { id: favoriteUserData.profileInfo },
        });
        if (profileData && profileData[0].state) {
          const stateIds = profileData[0].state.split(",").map((stateId) => stateId.trim());
          stateData = await stateModel.findAll({ where: { id: stateIds } });
        }
        if (profileData && profileData[0].city) {
          const cityIds = profileData[0].city.split(",").map((cityId) => cityId.trim());
          citiesData = await citiesModel.findAll({ where: { id: cityIds } });
        }
        // Fetch sportsData based on profileData
        if (profileData && profileData[0].sportsId) {
          const sportIds = profileData[0].sportsId.split(",").map((sportsId) => sportsId.trim());
          sportsData = await sportsModel.findAll({
            where: { id: sportIds },
          });
        }
      }

      return {
        favorite,
        userData,
        favoriteUserData,
        galleryData,
        profileData,
        stateData,
        citiesData,
        sportsData,
        specialityData
      };
    });

    const favoritesData = await Promise.all(favoritesDataPromises);

    return res.status(200).json({ status: 200, message: "Success", data: favoritesData });
  } catch (error) {
    console.error("Get all favorites API error:", error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
