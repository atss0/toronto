export const createSuccessResponse = (data: any, message = 'OK') => ({
  data: {
    success: true,
    data,
    message,
  },
});

export const createErrorResponse = (
  code: string,
  message: string,
  status = 400,
  details?: Record<string, string[]>,
) => ({
  response: {
    status,
    data: {
      success: false,
      error: { code, message, ...(details && { details }) },
    },
  },
});

export const createPaginatedResponse = (
  data: any[],
  page = 1,
  total = 100,
  limit = 20,
) => ({
  data: {
    success: true,
    data,
    message: 'OK',
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  },
});
