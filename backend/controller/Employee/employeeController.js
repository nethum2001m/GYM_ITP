const Employee = require("../../models/Employee/Employee");

// Add Employee
exports.addEmployee = async (req, res) => {
  try {
    const { name, email, salary, phone, category, status } = req.body;

    // Get the count of employees to generate the next ID
    const count = await Employee.countDocuments();
    const nextIdNumber = count + 1;
    const employeeId = `EMP${String(nextIdNumber).padStart(3, '0')}`; // e.g., EMP001

    const newEmployee = new Employee({
      employeeId,
      name,
      email,
      salary,
      phone,
      category,
      status
    });

    await newEmployee.save();
    res.status(201).json({ message: "Employee added successfully", newEmployee });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Employee
exports.getEmployee = async (req, res) => {
  try {
    const employee = await Employee.find();
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Single Employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Employee
exports.updateEmployee = async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedEmployee) return res.status(404).json({ message: "Employee not found" });
    res.status(200).json({ message: "Employee updated", updatedEmployee });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Employee
exports.deleteEmployee = async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) return res.status(404).json({ message: "Employee not found" });
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
