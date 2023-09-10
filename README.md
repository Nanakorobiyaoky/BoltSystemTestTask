## Описание

Тестовое задание

## Установка пакетов

```
npm install
```

## Базы данных

```
Отредактируйте файл .production.env и .development.env в соответствии с вашей конфигурацией MySQL;

Подключитесь к вашему серверу MySQL и создайте необходимы базы данных при помощи следующих команд:
- mysql -u root -p
- password
- create database publications;
- create database users;
- \q

где {root} - имя пользователя, а {password} - пароль

Проверьте созданы ли базы данных:
- mysql -u root -p
- password
- show databases;
- \q

+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| publications       | <===
| sys                |
| users              | <===
+--------------------+

Затем запустите следующие скрипты:
- npm run publications:migrate
- npm run users:migrate

При выполнении этих команд буду созданы необходимые таблицы, а так же несколько пользователей:
админ:
    "email": "admin",
    "password": "admin",
редактор:
    "email": "editor@gmail.com"
    "password": "editor@gmail.com"
автор:
    "email": "author@gmail.com",
    "password": "author@gmail.com",
```

## Старт приложения

```
Для запуска приложение введите следующие команды:
-npm run start
-npm run start auth
-npm run start publications
-npm run start users

Каждая команда должна быть запущена в отдельном окне терминала;
Приложение принимает запросы по адресу: localhost:5000;
Порт можно изменить в файлах конфигшурации

Для запуска приложения в режиме разработчика введите следующие команды:
-npm run start:dev
-npm run start:dev auth
-npm run start:dev publications
-npm run start:dev users
```

## Тесты

```
Для запуска модульных тестов выполните команду:

npm run test
```
