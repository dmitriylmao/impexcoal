# Admin auth

Админ-панель защищена cookie-сессией.

По умолчанию (если переменные не заданы):
- логин: `admin`
- пароль: `admin`

Обязательно поменяйте это перед продом в `.env`:

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change_me_strong_password
ADMIN_SESSION_SECRET=change_me_long_random_secret_at_least_32_chars
```

`ADMIN_SESSION_SECRET` должен быть не короче 32 символов.