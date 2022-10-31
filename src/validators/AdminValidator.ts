import { body, param, query } from 'koa-req-validation'

const registerAdmin = [
  body('name').trim().isLength({ min: 4, max: 20 }).build(),
  body('email').isEmail().normalizeEmail().build(),
  body('password').isLength({ min: 8 }).withMessage('Password must not be less than (8) characters').build(),
  body('confirmPassword').isLength({ min: 8 }).withMessage('Password must not be less than (8) characters').build()
]

const loginAdmin = [
  body('email').isEmail().normalizeEmail().build(),
  body('password').isLength({ min: 1 }).build()
]

const updateAdmin = [
  param('adminId').trim().isLength({ min: 1 }).build(),
  body('name').optional({ allowNull: true }).trim().isLength({ min: 4, max: 20 }).build(),
  body('email').optional({ allowNull: true }).isEmail().normalizeEmail().build()
]

const updateAdminProfile = [
  body('name').optional({ allowNull: true }).trim().isLength({ min: 4, max: 20 }).build(),
  body('email').optional({ allowNull: true }).isEmail().normalizeEmail().build()
]

const updateAdminPassword = [
  body('currentPassword').isLength({ min: 1 }).build(),
  body('newPassword').isLength({ min: 8 }).withMessage('Password must not be less than (8) characters').build(),
  body('confirmNewPassword').isLength({ min: 8 }).withMessage('Password must not be less than (8) characters').build()
]

const deleteAdmin = [
  param('adminId').trim().isLength({ min: 1 }).build()
]

const getAdmin = [
  param('adminId').trim().isLength({ min: 1 }).build()
]

const listAdmins = [
  query("adminId").optional({ allowNull: true }).trim().isLength({ min: 1 }).build(),
  query("name").optional({ allowNull: true }).trim().isLength({ min: 1 }).build(),
  query("email").optional({ allowNull: true }).isEmail().normalizeEmail().build(),
  query("searchKeyword").optional({ allowNull: true }).trim().isLength({ min: 1 }).build(),
  query('page').isInt({ min: 1 }).build(),
  query('limit').isInt({ min: 1 }).build()
]

export default {
  registerAdmin,
  loginAdmin,
  updateAdmin,
  updateAdminProfile,
  updateAdminPassword,
  deleteAdmin,
  getAdmin,
  listAdmins
}
