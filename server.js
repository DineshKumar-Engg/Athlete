require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const database = require("./utills/database");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
require("./middlewares/cronJobs");

// Import Models
const adminModel = require("./models/admin/adminModel");
const roleModel = require("./models/role/roleModel");
const athleteModel = require("./models/athlete/athleteModel");
const coachModel = require("./models/coach/coachModel");
const academiesModel = require("./models/academies/academiesModel");
const userModel = require("./models/user/userModel");
const sportsModel = require("./models/common/sportsModel");
const subscriptionModel = require("./models/reports/subscriptionModule");
const promocodeModel = require("./models/common/promocodeModel");
const galleryModel = require("./models/gallery/galleryModel");
const transactionHistoryModel = require("./models/transaction/transactionHistoryModel");
const specialityModel = require("./models/speciality/specialityModel");
const cmsModel = require("./models/cms/cmsModel");
const cmsSectionModel = require("./models/cms/cmsSectionModel");
const cmsGalleryModel = require("./models/cms/cmsGalleryModel");
const favoritesModel = require("./models/favorites/favoritesModel");
const announcementModel = require("./models/announcement/announcementModel");
const Message = require("./models/message/messageModel"); 
// Import Routes
const roleRoutes = require("./routes/role/roleRoutes");
const loginRoutes = require("./routes/login/loginRoutes");
const adminRoutes = require("./routes/admin/adminRoutes");
const athleteRoutes = require("./routes/athlete/athleteRoutes");
const coachRoutes = require("./routes/coach/coachRoutes");
const academieRoutes = require("./routes/academies/academieRoutes");
const sportRoutes = require("./routes/sport/sportRoutes");
const contactRoutes = require("./routes/contact/contactRoutes");
const subscriptionRoutes = require("./routes/subscription/subscriptionRoutes");
const promocodeRoutes = require("./routes/promocode/promocodeRoutes");
const billingstateRoutes = require("./routes/billingstate/billingStateRoutes");
const changePasswordRoutes = require("./routes/password/changePasswordRoutes");
const forgotPasswordRoutes = require("./routes/password/forgotPasswordRoutes");
const galleryRoutes = require("./routes/gallery/galleryRoutes");
const cmsRoutes = require("./routes/cms/cmsRoutes");
const transactionHistoryRoutes = require("./routes/transactionhistory/transactionHistoryRoutes");
const settingsRoutes = require("./routes/settings/settingsRoutes");
const specialityRoutes = require("./routes/speciality/specialityRoutes");
const usaRoutes = require("./routes/usa/usaRoutes");
const reportRoutes = require("./routes/reports/reportRoutes");
const favoritesRoutes = require("./routes/favorites/favoritesRoutes");
const announcementRoutes = require("./routes/announcement/announcementRoutes");
const dashboardRoutes = require("./routes/dashboard/dashboardRoutes");
const messageRoutes = require("./routes/message/messageRouter");
// swagger options
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Connect Athlete",
      description: "Connect Athlete, Coach & Academies",
      version: "1.0.0"
    },
    // components: {
    //   securitySchemes: {
    //     BearerAuth: {
    //       type: "http",
    //       scheme: "bearer",
    //       bearerFormat: "JWT"
    //     }
    //   }
    // },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "apiKey",
          in: "header",
          name: "Authorization",
          description: "JWT authorization token"
        }
      }
    },

    security: [
      {
        BearerAuth: []
      }
    ],
    servers: [
      {
        url: "http://localhost:8000"
      },
      {
        url: "http://34.197.243.220:8000"
      },
      {
        url: "https://api.engageathlete.com"
      }
    ]
  },
  apis: [
    "./routes/login/loginRoutes.js",
    "./routes/admin/adminRoutes.js",
    "./routes/athlete/athleteRoutes.js",
    "./routes/coach/coachRoutes.js",
    "./routes/academies/academieRoutes.js",
    "./routes/sport/sportRoutes.js",
    "./routes/subscription/subscriptionRoutes.js",
    "./routes/promocode/promocodeRoutes.js",
    "./routes/billingstate/billingStateRoutes.js",
    "./routes/contact/contactRoutes.js",
    "./routes/password/changePasswordRoutes.js",
    "./routes/cms/cmsRoutes.js",
    "./routes/gallery/galleryRoutes.js"
  ]
};

const swaggerSpec = swaggerJsDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Cors Error Handling
const corsOption = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "OPTION", "HEAD", "PATCH", "DELETE"],
  allowedHeaders: ["Accept", "Content-Type", "Authorization", "device"],
  credentials: true
};

// Middlewares
app.use(cors(corsOption));
app.use(express.json({ limit: "3072mb" }));
app.use(express.urlencoded({ limit: "3072mb", extended: true }));

// Route Middlewares
app.use("/api/v1", loginRoutes);
app.use("/api/v1", adminRoutes);
app.use("/api/v1", contactRoutes);
app.use("/api/v1", roleRoutes);
app.use("/api/v1", athleteRoutes);
app.use("/api/v1", sportRoutes);
app.use("/api/v1", coachRoutes);
app.use("/api/v1", academieRoutes);
app.use("/api/v1", subscriptionRoutes);
app.use("/api/v1", promocodeRoutes);
app.use("/api/v1", billingstateRoutes);
app.use("/api/v1", changePasswordRoutes);
app.use("/api/v1", forgotPasswordRoutes);
app.use("/api/v1", galleryRoutes);
app.use("/api/v1", cmsRoutes);
app.use("/api/v1", transactionHistoryRoutes);
app.use("/api/v1", settingsRoutes);
app.use("/api/v1", specialityRoutes);
app.use("/api/v1", usaRoutes);
app.use("/api/v1", reportRoutes);
app.use("/api/v1", favoritesRoutes);
app.use("/api/v1", announcementRoutes);
app.use("/api/v1", dashboardRoutes);
app.use("/api/messages", messageRoutes);

// Table Connection
userModel.belongsTo(roleModel);
adminModel.belongsTo(roleModel);
athleteModel.belongsTo(roleModel);
// athleteModel.belongsTo(sportsModel, { constraints: false });
athleteModel.belongsTo(subscriptionModel, { constraints: false });
athleteModel.belongsTo(userModel);
userModel.hasMany(athleteModel);
coachModel.belongsTo(roleModel);
// coachModel.belongsTo(sportsModel, { constraints: false });
coachModel.belongsTo(userModel);
userModel.hasMany(coachModel);
academiesModel.belongsTo(roleModel);
// academiesModel.belongsTo(sportsModel);
academiesModel.belongsTo(subscriptionModel, { constraints: false });
academiesModel.belongsTo(userModel);
userModel.hasMany(academiesModel);
// subscriptionModel.belongsTo(sportsModel, { constraints: false });
subscriptionModel.belongsTo(roleModel); 
promocodeModel.belongsTo(roleModel);
// promocodeModel.belongsTo(sportsModel);
userModel.hasMany(galleryModel, { constraints: false });
transactionHistoryModel.belongsTo(roleModel);
// transactionHistoryModel.belongsTo(sportsModel); 
subscriptionModel.hasMany(transactionHistoryModel, { constraints: false });
sportsModel.hasMany(specialityModel);
cmsModel.hasMany(cmsSectionModel);
cmsSectionModel.hasMany(cmsGalleryModel);
cmsModel.hasMany(cmsGalleryModel);
userModel.hasMany(favoritesModel);
userModel.hasMany(favoritesModel, { foreignKey: "favoritesId" });
roleModel.hasMany(favoritesModel);
roleModel.hasMany(announcementModel, { constraints: false });
announcementModel.belongsTo(roleModel, { constraints: false });
promocodeModel.hasMany(transactionHistoryModel, { constraints: false });
transactionHistoryModel.belongsTo(promocodeModel , { constraints: false });
userModel.hasMany(transactionHistoryModel, { constraints: false });
transactionHistoryModel.belongsTo(userModel , { constraints: false });
transactionHistoryModel.belongsTo(subscriptionModel, { constraints: false });

// Socket setup
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["*", "http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003", "http://localhost:4005","https://engageathlete.com/", "https://www.engageathlete.com", "https://admin.engageathlete.com/", "https://www.admin.engageathlete.com", "http://localhost:65292/", "http://localhost:65293/", "http://localhost:65292", "http://localhost:65293"],
    methods: ["GET", "POST"],
    allowedHeaders: [
      "Access-Control-Allow-Headers",
      "Access-Control-Allow-Origin",
      "X-Requested-With",
      "X-Access-Token",
      "Content-Type",
      "Host",
      "Accept",
      "Connection",
      "Cache-Control",
    ],
    credentials: true,
    transports: ["websocket", "polling"],
    optionsSuccessStatus: 200,
  }
});
// Socket.io connection
io.on("connection", (socket) => {
  console.log("New client connected", socket.id);

  socket.on("join", (room) => {
    socket.join(room);
    console.log(`${socket.id} joined room: ${room}`);
  });

  // socket.on("send", (message) => {
  //   io.to(message.room).emit("receive_message", message);
  //   console.log(`${socket.id} sent message: ${message.content}`);
  // });

  // Socket.io event handler
  // socket.on("send", async (messageData) => {
  //   try {
  //     const { content, senderId, receiverId, roleId } = messageData;
  //     const newMessage = await Message.create({ content, senderId, receiverId, roleId });

  //     const room = `${senderId}-${receiverId}`;
  //     io.to(room).emit("receive_message", newMessage);
  //     console.log(`${socket.id} sent message: ${newMessage.content}`);
  //   } catch (error) {
  //     console.error("Error creating message:", error);
  //   }
  // });

  // Socket.io event handler
  socket.on("send", async (messageData) => {
    try {
      const { content, senderId, receiverId, roleId } = messageData;
      const newMessage = await Message.create({ content, senderId, receiverId, roleId });

      const room1 = `${senderId}-${receiverId}`;
      const room2 = `${receiverId}-${senderId}`;
      io.to(room1).to(room2).emit("receive_message", newMessage);
      console.log(`${socket.id} sent message: ${newMessage.content}`);
    } catch (error) {
      console.error("Error creating message:", error);
    }
  });


  socket.on("leave", (room) => {
    socket.leave(room);
    console.log(`${socket.id} left room: ${room}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
  });
});
// Server Status Connection Check
// database.sync({ force: true })
database.sync()
  .then(() => {
    httpServer.listen(process.env.PORT, () => {
      console.log(`server started on ${process.env.PORT} port.`);
    });
  })
  .catch((error) => {
    console.log(`server connection error - ${error}`);
  });
  PORT = "8000"
  DATABASE_NAME = "connectathlete"
  DB_USERNAME = "admin"
  DB_PASSWORD = "Connectadmin123" 
  HOST_URL = "connectathlete.cfg80ku6wdwp.us-east-1.rds.amazonaws.com"
  JWT_TOKEN_SECRET = "25ea1a31d02e1300d049292d0bdee5ac9bf9023292818bce1aab8b6b13af742fdb3f6f229efebfa50f8a4c7dd450c4b9ea32d5bbc2b0c06ea4a4ccd407c4f09b"
  IAM_USER_KEY = "AKIAZI2LCA2ENFR5RUVE"
  IAM_USER_SECRET = "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"
  BUCKET_NAME = "connectathlete"
  EMAIL_SERVICE = "gmail"
  EMAIL_USER = "support@connectathlete.com"
  EMAIL_PASSWORD = "uvbm dang ztmf qibk"
  ADMIN_EMAIL = "support@connectathlete.com"
  SANDBOX_APPLICATION_ID = "sandbox-sq0idb-sYPqdp-zyV8HO8_jiMNAWg"
  SANDBOX_ACCESS_TOKEN = "EAAAl7DPSK7Cb4Rlvw8xjZqQ-uVsLnRETFf2mfFab99ztNMJN_LC6LB5sXYF1-Ed"