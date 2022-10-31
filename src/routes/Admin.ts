// routes/admin
import Router from '@koa/router'
import { authenticate, authorize } from '../controllers/AuthController'
import AdminValidator from '../validators/AdminValidator'
import { registerAdmin, loginAdmin, updateAdmin, updateAdminProfile, updateAdminPassword, 
  deleteAdmin, getAdmin, getAdminProfile, listAdmins } from '../controllers/AdminController'

const router = new Router()

// /admin/registerAdmin
router.post('/registerAdmin', authenticate, authorize('spradmin'), ...AdminValidator.registerAdmin, registerAdmin)

router.post('/loginAdmin', ...AdminValidator.loginAdmin, loginAdmin)

router.put('/updateAdmin/:adminId', authenticate, authorize('spradmin'), ...AdminValidator.updateAdmin, updateAdmin)

router.put('/updateAdminProfile', authenticate, authorize('admin'), ...AdminValidator.updateAdminProfile, updateAdminProfile)

router.put('/updateAdminPassword', authenticate, authorize('admin'), ...AdminValidator.updateAdminPassword, updateAdminPassword)

router.delete('/deleteAdmin/:adminId', authenticate, authorize('spradmin'), ...AdminValidator.deleteAdmin, deleteAdmin)

router.get('/getAdmin/:adminId', authenticate, authorize('spradmin'), ...AdminValidator.getAdmin, getAdmin)

router.get('/getAdminProfile', authenticate, authorize('admin'), getAdminProfile)

router.get('/listAdmins', authenticate, authorize('admin'), ...AdminValidator.listAdmins, listAdmins)

export default router.routes()
