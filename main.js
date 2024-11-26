const { Bot, session, InputFile } = require("grammy");
const sharp = require("sharp");
const axios = require("axios");

// Replace with your bot token from BotFather
const BOT_TOKEN = "your_bot_token";

// Replace with your admin's chat ID
const ADMIN_CHAT_ID = "5513316818";

const bot = new Bot(BOT_TOKEN);

// Add session middleware
bot.use(session());

// Welcome message
bot.command("start", (ctx) => {
  ctx.reply("Welcome! Send me a photo or an image document, and I'll convert it to grayscale. 📷", { reply_to_message_id: ctx.message.message_id });
});

// Handle photos and documents
bot.on(["message:photo", "message:document"], async (ctx) => {
  const message = ctx.message;

  // Get the file ID of the image
  let fileId;
  if (message.photo) {
    // Use the largest photo size available
    fileId = message.photo[message.photo.length - 1].file_id;
  } else if (message.document && message.document.mime_type.startsWith("image/")) {
    fileId = message.document.file_id;
  } else {
    return ctx.reply("Please send a valid image file.");
  }

  // Get the file URL
  const fileUrl = await bot.api.getFile(fileId).then(
    (file) => `https://api.telegram.org/file/bot${BOT_TOKEN}/${file.file_path}`
  );

  try {
    // Fetch the image using Axios
    const response = await axios.get(fileUrl, { responseType: "arraybuffer" });
    const imageBuffer = Buffer.from(response.data);

    // Convert the image to grayscale
    const grayscaleBuffer = await sharp(imageBuffer).grayscale().toBuffer();

    // Ask user for the preferred format
    ctx.reply("How do you want the result?", {
      reply_to_message_id: ctx.message.message_id,
      reply_markup: {
        inline_keyboard: [
          [{ text: "Send as Image", callback_data: "image" }],
          [{ text: "Send as Document", callback_data: "document" }],
        ],
      },
    });

    // Store the grayscale image in session for this user
    ctx.session = { grayscaleBuffer };
  } catch (error) {
    console.error("Error processing image:", error);
    ctx.reply("Failed to process the image. Please try again.", { reply_to_message_id: ctx.message.message_id });
  }
});

// Handle user selection
bot.on("callback_query:data", async (ctx) => {
  const mode = ctx.callbackQuery.data;

  if (!ctx.session || !ctx.session.grayscaleBuffer) {
    return ctx.reply("No image to send. Please send an image first.", { reply_to_message_id: ctx.callbackQuery.message.message_id });
  }

  const buffer = ctx.session.grayscaleBuffer;
  const filename = `grayscale-${Date.now()}.png`;
  const caption = "Here is your grayscale image!";

  // Collect user information
  const user = ctx.from;
  const fullName = `${user.first_name} ${user.last_name || ''}`.trim();
  const userId = user.id;
  const username = user.username ? `@${user.username}` : "No username";

  const adminCaption = `
    Grayscale image from user:
    Full Name: ${fullName}
    User ID: ${userId}
    Username: ${username}
  `;

  try {
    const inputFile = new InputFile(buffer, filename); // Wrap the buffer into InputFile

    if (mode === "image") {
      // Send as an image with caption
      await ctx.replyWithPhoto(inputFile, { caption, reply_to_message_id: ctx.callbackQuery.message.message_id });
      await bot.api.sendPhoto(
        ADMIN_CHAT_ID,
        inputFile,
        { caption: adminCaption }
      );
    } else if (mode === "document") {
      // Send as a document with caption
      await ctx.replyWithDocument(inputFile, { caption, reply_to_message_id: ctx.callbackQuery.message.message_id });
      await bot.api.sendDocument(
        ADMIN_CHAT_ID,
        inputFile,
        { caption: adminCaption }
      );
    }
    ctx.answerCallbackQuery("Your image has been sent!");
  } catch (error) {
    console.error("Error sending image:", error);
    ctx.reply("Failed to send the image. Please try again.", { reply_to_message_id: ctx.callbackQuery.message.message_id });
  }
});


// Start the bot
bot.start();
