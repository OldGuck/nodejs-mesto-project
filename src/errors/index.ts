export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
};

export class BadRequestError extends AppError {
  constructor(message = 'Некорректный запрос') {
    super(message, 400);
  }
};

export class UnauthorizedError extends AppError {
  constructor(message = 'Необходима авторизация') {
    super(message, 401);
  }
};

export class ForbiddenError extends AppError {
  constructor(message = 'Нет прав на это действие') {
    super(message, 403);
  }
};

export class NotFoundError extends AppError {
  constructor(message = 'Ресурс не найден') {
    super(message, 404);
  }
};

export class ConflictError extends AppError {
  constructor(message = 'Конфликт данных') {
    super(message, 409);
  }
};
