import type { Language } from "./constants"

type TranslationKeys = 
  | "latest_posts"
  | "popular_posts"
  | "popular_tags"
  | "latest_comments"
  | "no_posts"
  | "no_comments"
  | "no_tags"
  | "loading_posts"
  | "loading_comments"
  | "read_more"
  | "view_post"
  | "comments"
  | "likes"
  | "views"
  | "write_comment"
  | "submit_comment"
  | "update_comment"
  | "delete_comment"
  | "login_to_comment"
  | "comment_placeholder"
  | "create_post"
  | "edit_post"
  | "delete_post"
  | "post_title"
  | "post_content"
  | "post_tags"
  | "upload_image"
  | "delete_confirm"
  | "cancel"
  | "confirm"
  | "login"
  | "register"
  | "logout"
  | "n_likes"
  | "n_comments"
  | "n_views"
  | "days_ago"
  | "hours_ago"
  | "minutes_ago"
  | "just_now"
  | "menu"
  | "theme"
  | "language"
  | "actions"
  | "profile"
  | "new_post"
  | "theme_light"
  | "theme_dark"
  | "theme_system"
  | "email"
  | "password"
  | "fullname"
  | "forgot_password"
  | "no_account"
  | "have_account"
  | "sign_up"
  | "sign_in"
  | "welcome_back"
  | "create_account"

type Translations = {
  [K in Language]: {
    [T in TranslationKeys]: string | ((n: number) => string)
  }
}

export const translations: Translations = {
  uz: {
    latest_posts: "So'nggi maqolalar",
    popular_posts: "Mashhur maqolalar",
    popular_tags: "Mashhur teglar",
    latest_comments: "So'nggi izohlar",
    no_posts: "Maqolalar topilmadi",
    no_comments: "Izohlar yo'q. Birinchi bo'lib izoh qoldiring!",
    no_tags: "Teglar topilmadi",
    loading_posts: "Maqolalar yuklanmoqda...",
    loading_comments: "Izohlar yuklanmoqda...",
    read_more: "Batafsil",
    view_post: "Maqolani ko'rish",
    comments: "Izohlar",
    likes: "Yoqdi",
    views: "Ko'rildi",
    write_comment: "Izoh yozing...",
    submit_comment: "Yuborish",
    update_comment: "Yangilash",
    delete_comment: "O'chirish",
    login_to_comment: "Izoh qoldirish uchun tizimga kiring",
    comment_placeholder: "Fikringizni yozing...",
    create_post: "Maqola yaratish",
    edit_post: "Maqolani tahrirlash",
    delete_post: "Maqolani o'chirish",
    post_title: "Maqola sarlavhasi",
    post_content: "Maqola matni",
    post_tags: "Teglar (vergul bilan ajrating)",
    upload_image: "Rasm yuklash",
    delete_confirm: "Haqiqatan ham o'chirmoqchimisiz?",
    cancel: "Bekor qilish",
    confirm: "Tasdiqlash",
    login: "Kirish",
    register: "Ro'yxatdan o'tish",
    logout: "Chiqish",
    n_likes: (n: number) => `${n} ta yoqdi`,
    n_comments: (n: number) => `${n} ta izoh`,
    n_views: (n: number) => `${n} marta ko'rildi`,
    days_ago: (n: number) => `${n} kun oldin`,
    hours_ago: (n: number) => `${n} soat oldin`,
    minutes_ago: (n: number) => `${n} daqiqa oldin`,
    just_now: "hozirgina",
    menu: "Menyu",
    theme: "Mavzu",
    language: "Til",
    actions: "Amallar",
    profile: "Profil",
    new_post: "Yangi maqola",
    theme_light: "Yorug'",
    theme_dark: "Qorong'i",
    theme_system: "Tizim",
    email: "Elektron pochta",
    password: "Parol",
    fullname: "To'liq ism",
    forgot_password: "Parolingizni unutdingizmi?",
    no_account: "Hisobingiz yo'qmi?",
    have_account: "Hisobingiz bormi?",
    sign_up: "Ro'yxatdan o'tish",
    sign_in: "Kirish",
    welcome_back: "Qaytganingiz bilan!",
    create_account: "Yangi hisob yarating",
  },
  en: {
    latest_posts: "Latest Posts",
    popular_posts: "Popular Posts",
    popular_tags: "Popular Tags",
    latest_comments: "Latest Comments",
    no_posts: "No posts found",
    no_comments: "No comments yet. Be the first to comment!",
    no_tags: "No tags found",
    loading_posts: "Loading posts...",
    loading_comments: "Loading comments...",
    read_more: "Read more",
    view_post: "View post",
    comments: "Comments",
    likes: "Likes",
    views: "Views",
    write_comment: "Write a comment...",
    submit_comment: "Submit",
    update_comment: "Update",
    delete_comment: "Delete",
    login_to_comment: "Please login to comment",
    comment_placeholder: "Write your thoughts...",
    create_post: "Create Post",
    edit_post: "Edit Post",
    delete_post: "Delete Post",
    post_title: "Post title",
    post_content: "Post content",
    post_tags: "Tags (comma separated)",
    upload_image: "Upload image",
    delete_confirm: "Are you sure you want to delete?",
    cancel: "Cancel",
    confirm: "Confirm",
    login: "Login",
    register: "Register",
    logout: "Logout",
    n_likes: (n: number) => `${n} ${n === 1 ? 'Like' : 'Likes'}`,
    n_comments: (n: number) => `${n} ${n === 1 ? 'Comment' : 'Comments'}`,
    n_views: (n: number) => `${n} ${n === 1 ? 'View' : 'Views'}`,
    days_ago: (n: number) => `${n} ${n === 1 ? 'day' : 'days'} ago`,
    hours_ago: (n: number) => `${n} ${n === 1 ? 'hour' : 'hours'} ago`,
    minutes_ago: (n: number) => `${n} ${n === 1 ? 'minute' : 'minutes'} ago`,
    just_now: "just now",
    menu: "Menu",
    theme: "Theme",
    language: "Language",
    actions: "Actions",
    profile: "Profile",
    new_post: "New Post",
    theme_light: "Light",
    theme_dark: "Dark",
    theme_system: "System",
    email: "Email",
    password: "Password",
    fullname: "Full name",
    forgot_password: "Forgot password?",
    no_account: "Don't have an account?",
    have_account: "Already have an account?",
    sign_up: "Sign up",
    sign_in: "Sign in",
    welcome_back: "Welcome back!",
    create_account: "Create a new account",
  },
  ru: {
    latest_posts: "Последние статьи",
    popular_posts: "Популярные статьи",
    popular_tags: "Популярные теги",
    latest_comments: "Последние комментарии",
    no_posts: "Статьи не найдены",
    no_comments: "Комментариев пока нет. Будьте первым!",
    no_tags: "Теги не найдены",
    loading_posts: "Загрузка статей...",
    loading_comments: "Загрузка комментариев...",
    read_more: "Подробнее",
    view_post: "Просмотр статьи",
    comments: "Комментарии",
    likes: "Нравится",
    views: "Просмотры",
    write_comment: "Написать комментарий...",
    submit_comment: "Отправить",
    update_comment: "Обновить",
    delete_comment: "Удалить",
    login_to_comment: "Войдите, чтобы комментировать",
    comment_placeholder: "Напишите ваши мысли...",
    create_post: "Создать статью",
    edit_post: "Редактировать статью",
    delete_post: "Удалить статью",
    post_title: "Заголовок статьи",
    post_content: "Содержание статьи",
    post_tags: "Теги (через запятую)",
    upload_image: "Загрузить изображение",
    delete_confirm: "Вы уверены, что хотите удалить?",
    cancel: "Отмена",
    confirm: "Подтвердить",
    login: "Вход",
    register: "Регистрация",
    logout: "Выход",
    n_likes: (n: number) => `${n} ${n === 1 ? 'лайк' : n < 5 ? 'лайка' : 'лайков'}`,
    n_comments: (n: number) => `${n} ${n === 1 ? 'комментарий' : n < 5 ? 'комментария' : 'комментариев'}`,
    n_views: (n: number) => `${n} ${n === 1 ? 'просмотр' : n < 5 ? 'просмотра' : 'просмотров'}`,
    days_ago: (n: number) => `${n} ${n === 1 ? 'день' : n < 5 ? 'дня' : 'дней'} назад`,
    hours_ago: (n: number) => `${n} ${n === 1 ? 'час' : n < 5 ? 'часа' : 'часов'} назад`,
    minutes_ago: (n: number) => `${n} ${n === 1 ? 'минуту' : n < 5 ? 'минуты' : 'минут'} назад`,
    just_now: "только что",
    menu: "Меню",
    theme: "Тема",
    language: "Язык",
    actions: "Действия",
    profile: "Профиль",
    new_post: "Новая статья",
    theme_light: "Светлая",
    theme_dark: "Темная",
    theme_system: "Системная",
    email: "Электронная почта",
    password: "Пароль",
    fullname: "Полное имя",
    forgot_password: "Забыли пароль?",
    no_account: "Нет аккаунта?",
    have_account: "Уже есть аккаунт?",
    sign_up: "Зарегистрироваться",
    sign_in: "Войти",
    welcome_back: "С возвращением!",
    create_account: "Создать новый аккаунт",
  }
}