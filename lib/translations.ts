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
  | "page_not_found"
  | "back_to_home"
  | "new_password"
  | "password_placeholder"
  | "saving"
  | "save_changes"
  | "delete_account"
  | "delete_warning"
  | "deleting"
  | "no_changes"
  | "profile_updated"
  | "update_failed"
  | "account_deleted"
  | "delete_failed"
  | "update_profile"
  | "profile_info"
  | "post_anonymously"
  | "deleted_user"
  | "anonymous_user"
  | "title_placeholder"
  | "content_placeholder"
  | "tags_placeholder"
  | "edit_tab"
  | "preview_tab"
  | "uploading"
  | "upload_button"
  | "saving_post"
  | "creating_post"
  | "updating_post"
  | "update_button"
  | "create_button"
  | "auth_required"
  | "login_to_create_post"
  | "image_uploaded"
  | "image_upload_success"
  | "upload_failed"
  | "image_upload_error"
  | "missing_fields"
  | "fill_required_fields"
  | "success"
  | "post_updated"
  | "post_created"
  | "general_error"
  | "error"
  | "delete_post_title"
  | "delete_post_description"
  | "auth_like_required"
  | "auth_like_message"
  | "like_failed"
  | "like_error"
  | "delete_post_error"
  | "delete_post_success"
  | "edit_button"
  | "delete_button"
  | "deleting_post"
  | "fetch_posts_error"
  | "retry"
  | "max_retries_reached"
  | "login_failed"
  | "registration_failed"
  | "registration_successful"  // Yangi qo'shildi
  | "login_redirect"           // Yangi qo'shildi

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
    comment_placeholder: "Komment qoldiring...",
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
    page_not_found: "Sahifa topilmadi",
    back_to_home: "Bosh sahifaga qaytish",
    new_password: "Yangi parol",
    password_placeholder: "Yangi parol kiriting",
    saving: "Saqlanmoqda...",
    save_changes: "O'zgarishlarni saqlash",
    delete_account: "Akkauntni o'chirish",
    delete_warning: "Bu amalni qaytarib bo'lmaydi. Akkauntingiz va barcha ma'lumotlaringiz butunlay o'chiriladi.",
    deleting: "O'chirilmoqda...",
    no_changes: "O'zgarishlar topilmadi",
    profile_updated: "Profil yangilandi",
    update_failed: "Profilni yangilashda xatolik yuz berdi",
    account_deleted: "Akkaunt o'chirildi",
    delete_failed: "Akkauntni o'chirishda xatolik yuz berdi",
    update_profile: "Profil ma'lumotlarini yangilash",
    profile_info: "Profil ma'lumotlari",
    post_anonymously: "Anonim ravishda nashr qilish",
    deleted_user: "O'chirilgan foydalanuvchi",
    anonymous_user: "Anonim foydalanuvchi",
    title_placeholder: "Sarlavhani kiriting",
    content_placeholder: "Post matnini kiriting... (Markdown formati qo'llaniladi)",
    tags_placeholder: "Teglarni vergul bilan ajrating. Masalan: #texnologiya, #dasturlash, #veb",
    edit_tab: "Tahrirlash",
    preview_tab: "Ko'rib chiqish",
    uploading: "Yuklanmoqda...",
    upload_button: "Rasm yuklash",
    saving_post: "Saqlanmoqda...",
    creating_post: "Yaratilmoqda...",
    updating_post: "Yangilanmoqda...",
    update_button: "Yangilash",
    create_button: "Yaratish",
    auth_required: "Avtorizatsiya talab qilinadi",
    login_to_create_post: "Maqola yaratish uchun tizimga kiring",
    image_uploaded: "Rasm yuklandi",
    image_upload_success: "Rasm muvaffaqiyatli yuklandi",
    upload_failed: "Yuklash xatosi",
    image_upload_error: "Rasmni yuklashda xatolik yuz berdi",
    missing_fields: "Ma'lumotlar to'liq emas",
    fill_required_fields: "Barcha majburiy maydonlarni to'ldiring",
    success: "Muvaffaqiyatli",
    post_updated: "Maqola muvaffaqiyatli yangilandi",
    post_created: "Maqola muvaffaqiyatli yaratildi",
    general_error: "Xatolik yuz berdi",
    error: "Xatolik",
    delete_post_title: "Ishonchingiz komilmi?",
    delete_post_description: "Bu amalni qaytarib bo'lmaydi. Post butunlay o'chiriladi.",
    auth_like_required: "Avtorizatsiya zarur",
    auth_like_message: "Postni yoqtirish uchun tizimga kiring",
    like_failed: "Xatolik",
    like_error: "Postni yoqtirishda xatolik yuz berdi",
    delete_post_error: "Postni o'chirishda xatolik yuz berdi",
    delete_post_success: "Post muvaffaqiyatli o'chirildi",
    edit_button: "Tahrirlash",
    delete_button: "O'chirish",
    deleting_post: "O'chirilmoqda...",
    fetch_posts_error: "Maqolalarni yuklashda xatolik yuz berdi",
    retry: "Qayta urinish",
    max_retries_reached: "Maksimal urinishlar soniga yetildi",
    login_failed: "Tizimga kirishda xatolik yuz berdi",
    registration_failed: "Ro'yxatdan o'tishda xatolik yuz berdi",
    registration_successful: "Ro'yxatdan o'tish muvaffaqiyatli yakunlandi",
    login_redirect: "Tizimga kirish sahifasiga yo'naltirilmoqdasiz..."
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
    page_not_found: "Page not found",
    back_to_home: "Back to home",
    new_password: "New Password",
    password_placeholder: "Enter new password",
    saving: "Saving...",
    save_changes: "Save Changes",
    delete_account: "Delete Account",
    delete_warning: "This action cannot be undone. Your account and all your data will be permanently deleted.",
    deleting: "Deleting...",
    no_changes: "No changes found",
    profile_updated: "Profile updated",
    update_failed: "Failed to update profile",
    account_deleted: "Account deleted",
    delete_failed: "Failed to delete account",
    update_profile: "Update your profile information",
    profile_info: "Profile Information",
    post_anonymously: "Post anonymously",
    deleted_user: "Deleted user",
    anonymous_user: "Anonymous user",
    title_placeholder: "Enter post title",
    content_placeholder: "Write your post content here... (Markdown supported)",
    tags_placeholder: "Add tags separated by commas. Example: #technology, #programming, #web",
    edit_tab: "Edit",
    preview_tab: "Preview",
    uploading: "Uploading...",
    upload_button: "Upload Image",
    saving_post: "Saving...",
    creating_post: "Creating...",
    updating_post: "Updating...",
    update_button: "Update",
    create_button: "Create",
    auth_required: "Authentication required",
    login_to_create_post: "Please log in to create a post",
    image_uploaded: "Image uploaded",
    image_upload_success: "Image has been uploaded successfully",
    upload_failed: "Upload failed",
    image_upload_error: "Failed to upload image",
    missing_fields: "Missing fields",
    fill_required_fields: "Please fill in all required fields",
    success: "Success",
    post_updated: "Post has been updated successfully",
    post_created: "Post has been created successfully",
    general_error: "An error occurred",
    error: "Error",
    delete_post_title: "Are you sure?",
    delete_post_description: "This action cannot be undone. This will permanently delete your post.",
    auth_like_required: "Authentication required",
    auth_like_message: "Please log in to like posts",
    like_failed: "Error",
    like_error: "Failed to like the post",
    delete_post_error: "Failed to delete the post",
    delete_post_success: "Post deleted successfully",
    edit_button: "Edit",
    delete_button: "Delete",
    deleting_post: "Deleting...",
    fetch_posts_error: "Failed to fetch posts",
    retry: "Retry",
    max_retries_reached: "Maximum retries reached",
    login_failed: "Failed to login",
    registration_failed: "Failed to register",
    registration_successful: "Registration successful",
    login_redirect: "Redirecting to login page..."
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
    page_not_found: "Страница не найдена",
    back_to_home: "Вернуться на главную",
    new_password: "Новый пароль",
    password_placeholder: "Введите новый пароль",
    saving: "Сохранение...",
    save_changes: "Сохранить изменения",
    delete_account: "Удалить аккаунт",
    delete_warning: "Это действие нельзя отменить. Ваш аккаунт и все данные будут удалены безвозвратно.",
    deleting: "Удаление...",
    no_changes: "Изменения не найдены",
    profile_updated: "Профиль обновлен",
    update_failed: "Не удалось обновить профиль",
    account_deleted: "Аккаунт удален",
    delete_failed: "Не удалось удалить аккаунт",
    update_profile: "Обновить информацию профиля",
    profile_info: "Информация профиля",
    post_anonymously: "Опубликовать анонимно",
    deleted_user: "Удаленный пользователь",
    anonymous_user: "Анонимный пользователь",
    title_placeholder: "Введите заголовок поста",
    content_placeholder: "Напишите содержание поста... (Поддерживается Markdown)",
    tags_placeholder: "Добавьте теги через запятую. Пример: #технологии, #программирование, #веб",
    edit_tab: "Редактировать",
    preview_tab: "Предпросмотр",
    uploading: "Загрузка...",
    upload_button: "Загрузить изображение",
    saving_post: "Сохранение...",
    creating_post: "Создание...",
    updating_post: "Обновление...",
    update_button: "Обновить",
    create_button: "Создать",
    auth_required: "Требуется авторизация",
    login_to_create_post: "Войдите, чтобы создать статью",
    image_uploaded: "Изображение загружено",
    image_upload_success: "Изображение успешно загружено",
    upload_failed: "Ошибка загрузки",
    image_upload_error: "Не удалось загрузить изображение",
    missing_fields: "Не все поля заполнены",
    fill_required_fields: "Пожалуйста, заполните все обязательные поля",
    success: "Успешно",
    post_updated: "Статья успешно обновлена",
    post_created: "Статья успешно создана",
    general_error: "Произошла ошибка",
    error: "Ошибка",
    delete_post_title: "Вы уверены?",
    delete_post_description: "Это действие нельзя отменить. Ваш пост будет удален навсегда.",
    auth_like_required: "Требуется авторизация",
    auth_like_message: "Войдите, чтобы ставить лайки",
    like_failed: "Ошибка",
    like_error: "Не удалось поставить лайк",
    delete_post_error: "Не удалось удалить пост",
    delete_post_success: "Пост успешно удален",
    edit_button: "Редактировать",
    delete_button: "Удалить",
    deleting_post: "Удаление...",
    fetch_posts_error: "Не удалось загрузить публикации",
    retry: "Повторить",
    max_retries_reached: "Достигнуто максимальное количество попыток",
    login_failed: "Не удалось войти в систему",
    registration_failed: "Ошибка при регистрации",
    registration_successful: "Регистрация успешна",
    login_redirect: "Перенаправление на страницу входа..."
  }
}