import { useState, useEffect } from "react";

const EmployeePage = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    NIC: "",
    phone: "",
    category: "",
    salary: "",
  });

  // Fetch all employees
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch("/api/employees");
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  // Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (selectedEmployee) {
        // Update employee
        const response = await fetch(`/api/employees/${selectedEmployee._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        await response.json();
      } else {
        // Add new employee
        const response = await fetch("/api/employees", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        await response.json();
      }

      fetchEmployees(); // Refresh list
      setShowForm(false); // Close form
      setSelectedEmployee(null);
      setFormData({ name: "", email: "", NIC: "", phone: "", category: "", salary: "" });
    } catch (error) {
      console.error("Error saving employee:", error);
    }
  };

  // Delete employee
  const deleteEmployee = async (id) => {
    try {
      await fetch(`/api/employees/${id}`, { method: "DELETE" });
      fetchEmployees(); // Refresh list
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  return (
    <div className="employee-page">
      <h1>Employee Management</h1>
      <button onClick={() => { setShowForm(true); setSelectedEmployee(null); }}>Add Employee</button>

      {showForm && (
        <div className="form-container">
          <h2>{selectedEmployee ? "Edit Employee" : "Add Employee"}</h2>
          <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            <input type="text" name="NIC" placeholder="NIC Number" value={formData.NIC} onChange={handleChange} required />
            <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
            <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} required />
            <input type="number" name="salary" placeholder="Salary" value={formData.salary} onChange={handleChange} required />
            <button type="submit">{selectedEmployee ? "Update" : "Add"} Employee</button>
            <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
          </form>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>NIC</th>
            <th>Phone</th>
            <th>Category</th>
            <th>Salary</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee._id}>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.NIC}</td>
              <td>{employee.phone}</td>
              <td>{employee.category}</td>
              <td>Rs. {employee.salary}</td>
              <td>
                <button onClick={() => { setSelectedEmployee(employee); setFormData(employee); setShowForm(true); }}>Edit</button>
                <button onClick={() => deleteEmployee(employee._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeePage;
