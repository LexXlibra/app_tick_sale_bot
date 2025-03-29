// Configuration settings for the app
const config = {
    // Simplified and more flexible configuration
    app: {
        title: "Sale Ticket",
        subtitle: "Тивет",
        timeIndicator: "В.46"
    },
    
    sections: [
        {
            title: "Хранители",
            tabs: ["Постеры", "Создатели", "Локации"]
        }
    ],
    
    navigation: [
        { icon: "home", label: "Главная", active: true },
        { icon: "search", label: "Поиск" },
        { icon: "plus-circle", label: "Добавить" },
        { icon: "heart", label: "Избранное" },
        { icon: "user", label: "Профиль" }
    ],
    
    cardTemplates: {
        backgroundColors: ["blue", "orange", "pink", "white", "purple"],
        defaultStyles: {
            timePosition: "top-left",
            pricePosition: "top-right",
            profilePosition: "bottom-right"
        }
    },
    
    cardData: [
        {
            title: "Виндал Порье",
            subtitle: "Ул. Жуга",
            background: "blue-bg",
            badge: "Завтра",
            price: "₽45",
            profileInitial: "В"
        },
        {
            title: "Фандари Дискей",
            subtitle: "Ул. Алтавес",
            background: "orange-bg",
            hasGraphic: true,
            badge: "Сегодня",
            price: "Бесплатно",
            profileInitial: "Ф"
        },
        {
            title: "Вер Фор",
            subtitle: "Ул. Федорова",
            background: "pink-bg",
            badge: "Послезавтра",
            price: "₽25",
            hasProfileImage: true
        },
        {
            title: "Лаггинг Файты",
            subtitle: "Детали события",
            background: "white-bg",
            badge: "Завтра",
            price: "₽50",
            profileInitial: "Л"
        },
        {
            title: "ТАЙМУФ ТИВЕ",
            subtitle: "Выступление",
            background: "purple-bg",
            badge: "Сегодня",
            price: "₽35",
            profileInitial: "Т"
        },
        {
            title: "Мизера Паунды",
            subtitle: "Художественная выставка",
            background: "orange-bg",
            badge: "Завтра",
            price: "₽25",
            profileInitial: "М"
        },
        {
            title: "Новая Афиша 1",
            subtitle: "Описание события 1",
            background: "blue-bg",
            badge: "10.05.2024",
            price: "₽30",
            profileInitial: "Н1"
        },
        {
            title: "Новая Афиша 2",
            subtitle: "Описание события 2",
            background: "pink-bg",
            badge: "11.05.2024",
            price: "₽40",
            profileInitial: "Н2"
        },
        {
            title: "Новая Афиша 3",
            subtitle: "Описание события 3",
            background: "purple-bg",
            badge: "12.05.2024",
            price: "Бесплатно",
            profileInitial: "Н3"
        }
    ],
    fonts: {
        primary: "NauryzRedKeds",
        version: "1.0",
        details: "Red;NauryzRedKeds;2024;FL720"
    }
};

// You can modify the values above to customize the app