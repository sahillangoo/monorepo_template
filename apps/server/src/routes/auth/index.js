// Export all Better Auth route handlers
export {
  betterAuthRoute,
  betterAuthHandler,
  betterAuthGetRoute,
  betterAuthGetHandler
} from './better-auth.js';

export {
  loginRoute,
  loginHandler,
  loginSchema,
  loginResponseSchema
} from './login.js';

export {
  registerRoute,
  registerHandler,
  registerSchema,
  registerResponseSchema
} from './register.js';

export {
  passwordResetRequestRoute,
  passwordResetRoute,
  passwordResetRequestHandler,
  passwordResetHandler,
  passwordResetRequestSchema,
  passwordResetSchema
} from './password-reset.js';

export {
  emailVerificationRoute,
  emailVerificationHandler,
  resendVerificationRoute,
  resendVerificationHandler,
  emailVerificationSchema,
  resendVerificationSchema
} from './verify-email.js';

export {
  getUserProfileRoute,
  updateRoleRoute,
  getAllUsersRoute,
  getUserProfileHandler,
  updateRoleHandler,
  getAllUsersHandler,
  updateRoleSchema,
  userProfileSchema,
  usersListSchema
} from './roles.js';
