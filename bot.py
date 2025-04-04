from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import Application, CommandHandler, CallbackContext

TOKEN = '7937703536:AAFe1yXdaPK5fmh5qnFXKKzMb3OCXIc_D1M'
WEB_APP_URL = 'https://lexxlibra.github.io/app_tick_sale_bot/'

async def start(update: Update, context: CallbackContext) -> None:
    keyboard = [
        [InlineKeyboardButton(
            "Открыть приложение",
            web_app=WebAppInfo(
                url=WEB_APP_URL,
                # Настройки для ярлыка
                android_icon="https://icons.iconarchive.com/icons/pictogrammers/material/256/ticket-confirmation-icon.png",  # Иконка 512x512px
                android_name="Ticket Sale"  # Название ярлыка
            )
        )]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.message.reply_text('Приложение', reply_markup=reply_markup)

def main() -> None:
    application = Application.builder().token(TOKEN).build()
    application.add_handler(CommandHandler("start", start))
    application.run_polling()

if __name__ == '__main__':
    main()