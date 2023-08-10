const OK = 200; // Запрос пользователя успешно выполнен

const CreateSmt = 201; // Успешно, ресурс создан

const BadRequest = 400; // Некорректный запрос
const badRequestMessage = 'Некорректный запрос';

const Unauthorized = 401; // Используйте действительную почту и пароль
const unauthorizedMessage = 'Неправильная почта или пароль';

const Forbidden = 403; // Сервер понял запрос, но отказывается его авторизовать
const forbiddenMessage = 'У вас нет прав для удаления этого фильма';

const NotFound = 404; // Не найдено
const notFoundMessage = 'Такого фильма не существует';

const Conflict = 409; // Пользователь с таким email уже существует
const conflictMessage = 'Пользователь с таким email уже существует';

const InternalServerError = 500; // Внутренняя ошибка сервера
const internalServerErrorMessage = 'Ошибка сервера';

module.exports = {
  OK,
  CreateSmt,
  BadRequest,
  Unauthorized,
  Forbidden,
  NotFound,
  Conflict,
  InternalServerError,
  badRequestMessage,
  unauthorizedMessage,
  forbiddenMessage,
  notFoundMessage,
  conflictMessage,
  internalServerErrorMessage,
};
