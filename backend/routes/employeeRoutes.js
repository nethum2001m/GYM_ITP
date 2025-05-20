const express = require("express");
const router = express.Router();
const employeeController = require("../controller/Employee/employeeController");

router.post("/", employeeController.addEmployee);
router.get("/", employeeController.getEmployee);
router.get("/:id", employeeController.getEmployeeById);
router.put("/:id", employeeController.updateEmployee);
router.delete("/:id", employeeController.deleteEmployee);


module.exports = router;
