const express = require("express");
const router = express.Router();

const employee_controller = require("../controllers/employee.controller");

router.get("/test", employee_controller.test);

router.get("/add",  employee_controller.add);
router.post("/add",  employee_controller.create);

router.get("/all", employee_controller.all);
router.get("/:id", employee_controller.details);
router.get("/update/:id", employee_controller.update);
router.post("/update/:id", employee_controller.updateEmployee);
router.get("/delete/:id",  employee_controller.delete);

router.get("/report/all", employee_controller.allReport);

module.exports = router;
