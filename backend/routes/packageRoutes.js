const express = require("express");
const router = express.Router();
const packageController = require("../controller/member_package/packageController");

router.post("/", packageController.addPackage);
router.get("/", packageController.getPackages);
router.get("/:id", packageController.getPackageById);
router.put("/:id", packageController.updatePackage);
router.delete("/:id", packageController.deletePackage);

module.exports = router;
