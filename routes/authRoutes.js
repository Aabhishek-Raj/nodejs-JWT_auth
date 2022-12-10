const Router = require("express")
const { signup_get, signup_post, login_get, login_post } = require("../controllers/authControllers")
const router = Router()
const authControllers = require("../controllers/authControllers")
const { requireAuth } = require("../middlewares/authMiddleware")

router.get("/signup", authControllers.signup_get)
router.post("/signup", authControllers.signup_post)
router.get("/login", authControllers.login_get)
router.post("/login", authControllers.login_post)  
router.get("/logout", authControllers.logout_get) 

module.exports = router          