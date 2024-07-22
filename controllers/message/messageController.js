
const Message = require("../../models/message/messageModel");
const User = require("../../models/user/userModel");
const Gallery = require("../../models/gallery/galleryModel");
// exports.createMessage = async (req, res) => {
//   try {
//     const { content, senderId, receiverId, roleId } = req.body;
//     const newMessage = await messageModel.create({ content, senderId, receiverId, roleId });
//     res.status(201).json(newMessage);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.deleteMessage = async (req, res) => {
//   try {
//     const { messageId } = req.params;
//     await messageModel.destroy({ where: { id: messageId } });
//     res.status(200).json({ message: "Message deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.getMessages = async (req, res) => {
//   try {
//     const { senderId, receiverId } = req.params;
//     const messages = await messageModel.findAll({
//       where: {
//         senderId,
//         receiverId,
//       },
//       order: [["createdAt", "ASC"]]
//     });
//     res.status(200).json(messages);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.getConnectedReceivers = async (req, res) => {
//   try {
//     const { senderId } = req.params;
//     console.log("senderId", senderId);
//     const receivers = await messageModel.findAll({
//       where: { senderId },
//       attributes: ["receiverId"],
//       group: ["receiverId"]
//     });
//     res.status(200).json(receivers);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
exports.createMessage = async (req, res) => {
  try {
    const { content, senderId, receiverId, roleId } = req.body;
    const newMessage = await Message.create({ content, senderId, receiverId, roleId });
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Function to delete a message
exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    await Message.destroy({ where: { id: messageId } });
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Function to get messages between sender and receiver
exports.getMessages = async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "email"],
          include: [
            {
              model: Gallery,
              where: { fileType: "Profile Image" },
              attributes: ["fileLocation"],
              required: false,
            },
          ],
        },
      ],
      order: [["createdAt", "ASC"]],
    });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Function to get receivers connected to the sender
exports.getConnectedReceivers = async (req, res) => {
  try {
    const { senderId } = req.params;
    const receivers = await Message.findAll({
      where: { senderId },
      attributes: ["receiverId"],
      group: ["receiverId"],
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "email"],
          include: [
            {
              model: Gallery,
              where: { fileType: "Profile Image" },
              attributes: ["fileLocation"],
              required: false,
            },
          ],
        },
      ],
    });
    res.status(200).json(receivers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// // Function to get users connected to the specified user
// exports.getConnectedUsers = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const sentMessages = await Message.findAll({
//       where: { senderId: userId },
//       attributes: ["receiverId"],
//       group: ["receiverId"],
//       include: [
//         {
//           model: User,
//           attributes: ["id", "firstName", "lastName", "email"],
//           include: [
//             {
//               model: Gallery,
//               where: { fileType: "Profile Image" },
//               attributes: ["fileLocation"],
//               required: false,
//             },
//           ],
//         },
//       ],
//     });
//     const receivedMessages = await Message.findAll({
//       where: { receiverId: userId },
//       attributes: ["senderId"],
//       group: ["senderId"],
//       include: [
//         {
//           model: User,
//           attributes: ["id", "firstName", "lastName", "email"],
//           include: [
//             {
//               model: Gallery,
//               where: { fileType: "Profile Image" },
//               attributes: ["fileLocation"],
//               required: false,
//             },
//           ],
//         },
//       ],
//     });
//     const connectedUsers = [
//       ...sentMessages.map((message) => ({ userId: message.receiverId })),
//       ...receivedMessages.map((message) => ({ userId: message.senderId })),
//     ];
//     const uniqueUsers = connectedUsers.filter((user, index, self) =>
//       index === self.findIndex((u) => u.userId === user.userId)
//     );
//     res.status(200).json(uniqueUsers);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
const { Op } = require("sequelize"); // Ensure Op is imported

// Function to get users connected to the specified user
exports.getConnectedUsers = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch sent messages
    const sentMessages = await Message.findAll({
      where: { senderId: userId },
      attributes: ["receiverId"],
      group: ["receiverId"]
    });

    // Fetch received messages
    const receivedMessages = await Message.findAll({
      where: { receiverId: userId },
      attributes: ["senderId"],
      group: ["senderId"]
    });

    // Combine and deduplicate user IDs
    const connectedUserIds = [
      ...sentMessages.map((message) => message.receiverId),
      ...receivedMessages.map((message) => message.senderId)
    ];

    const uniqueUserIds = [...new Set(connectedUserIds)];

    // Fetch user details for unique user IDs
    const users = await User.findAll({
      where: {
        id: { [Op.in]: uniqueUserIds }
      },
      attributes: ["id", "firstName", "lastName", "email"],
      include: [
        {
          model: Gallery,
          where: { fileType: "Profile Image" },
          attributes: ["fileLocation"],
          required: false
        }
      ]
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
