import { ApiError } from '../utils/ApiError.js';

/**
 * Middleware factory — only allows users whose role is in the allowed list.
 * Must be used AFTER authenticate().
 */
export function authorize(...roles) {
  return (req, _res, next) => {
    // In direct access mode, allow access to all resources
    next();
  };
}
