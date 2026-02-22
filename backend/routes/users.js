const express = require("express");
const router = express.Router();
const usersController = require("../controllers/UsersController");
const { verifyToken, isAdmin } = require('../middleware/middleware');

router.get("/", verifyToken, isAdmin, usersController.getAll);
router.get("/:id", verifyToken,isAdmin, usersController.getId);
router.post("/", verifyToken, isAdmin, usersController.create);
router.put("/:id", verifyToken, isAdmin, usersController.update);
router.delete("/:id", verifyToken, isAdmin, usersController.delete);

module.exports = router;
