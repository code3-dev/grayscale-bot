# Grayscale Telegram Bot

This is a simple Telegram bot that converts photos and images to grayscale. Just send a photo or image document to the bot, and it will process and return the image in grayscale. You can choose to receive the result as an image or a document.

## Features

- Convert images to grayscale
- Choose the result format: image or document
- Sends processed images to the admin for monitoring
- User-friendly interface with inline keyboard for format selection

## Requirements

- Node.js (v16+ recommended)
- Telegram Bot Token (from [BotFather](https://core.telegram.org/bots#botfather))

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/code3-dev/grayscale-bot.git
   cd grayscale-bot
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Update your bot token and admin chat ID:
   - Replace `"your_bot_token"` with your actual bot token from BotFather in `main.js`.
   - Replace `"5513316818"` with your admin's chat ID.

4. Start the bot:
   ```bash
   npm start
   ```

## Usage

Once the bot is running, you can start interacting with it by sending a photo or image document to the bot. It will respond with the following options:

- **Send as Image**: Receive the grayscale image as a photo.
- **Send as Document**: Receive the grayscale image as a document.

The bot will also send a copy of the grayscale image to the admin.

## Commands

- `/start`: Send a welcome message with instructions on how to use the bot.
- Send any image or photo to start the grayscale conversion process.

## Example Workflow

1. Send a photo to the bot.
2. The bot will process the image and present options to send it as an image or document.
3. Choose the format you prefer, and the bot will send the result.

## Dependencies

- `axios`: For making HTTP requests to download images.
- `grammy`: A framework for building Telegram bots in Node.js.
- `sharp`: Image processing library for converting images to grayscale.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any queries or issues, please contact:

- **Name:** Hossein Pira
- **Email:** [h3dev.pira@gmail.com](mailto:h3dev.pira@gmail.com)
- **Instagram**: [@h3dev.pira](https://instagram.com/h3dev.pira)
- **Telegram:** [@h3dev](https://t.me/h3dev)
