"use client";

import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  User,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Calendar,
  DollarSign,
  Search,
  Edit,
  Trash2,
  Plus,
  X,
} from "lucide-react";

// Validation Schema
const EmployeeSchema = Yup.object().shape({
  first_name: Yup.string()
    .test(
      "is-not-a-number",
      "Name cannot be a number",
      (value) => isNaN(value) // Returns false if value is a number
    )
    .matches(/^[a-zA-Z\s]+$/, "Name must contain only alphabets and spaces")
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("First name is required"),
  last_name: Yup.string()
    .test(
      "is-not-a-number",
      "Name cannot be a number",
      (value) => isNaN(value) // Returns false if value is a number
    )
    .matches(/^[a-zA-Z\s]+$/, "Name must contain only alphabets and spaces")
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("First name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  department: Yup.string().required("Department is required"),
  position: Yup.string().required("Position is required"),
  hire_date: Yup.date()
    .max(new Date(), "Hire date can't be in the future")
    .required("Hire date is required"),
  salary: Yup.number()
    .positive("Salary must be positive")
    .required("Salary is required"),
});

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [searchType, setSearchType] = useState("email");
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [positionFilter, setPositionFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const initialValues = {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    hire_date: "",
    salary: "",
  };

  const departments = [...new Set(employees.map((emp) => emp.department))];
  const positions = [...new Set(employees.map((emp) => emp.position))];

  const fetchEmployees = async () => {
    try {
      const response = await fetch("/api/employees");
      const data = await response.json();
      setEmployees(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      const url = "/api/employees";
      const method = editingId ? "PUT" : "POST";
      const submitData = editingId ? { ...values, id: editingId } : values;

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      await fetchEmployees();
      resetForm();
      setEditingId(null);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setSubmitting(false);
    }
  };
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      await fetch("/api/employees", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchEmployees();
    }
  };

  const handleEdit = (employee) => {
    setFormData(employee);
    setEditingId(employee.id);
  };

  const resetForm = () => {
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      department: "",
      position: "",
      hire_date: "",
      salary: "",
    });
    setEditingId(null);
  };

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      searchQuery === "" ||
      employee[searchType].toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment =
      departmentFilter === "" || employee.department === departmentFilter;
    const matchesPosition =
      positionFilter === "" || employee.position === positionFilter;
    return matchesSearch && matchesDepartment && matchesPosition;
  });

  if (loading) {
    return <div>Loading...</div>; // Show loading message while data is being fetched
  }

  const FormField = ({
    name,
    type = "text",
    icon: Icon,
    placeholder,
    as,
    children,
  }) => (
    <div className="relative">
      <Icon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
      <Field name={name}>
        {({ field, meta }) => (
          <div>
            {as === "select" ? (
              <select
                {...field}
                className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                  meta.touched && meta.error ? "border-red-500" : ""
                }`}
              >
                {children}
              </select>
            ) : (
              <input
                {...field}
                type={type}
                placeholder={placeholder}
                className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                  meta.touched && meta.error ? "border-red-500" : ""
                }`}
              />
            )}
            {meta.touched && meta.error && (
              <div className="text-red-500 text-sm mt-1">{meta.error}</div>
            )}
          </div>
        )}
      </Field>
    </div>
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <nav className="bg-sky-600 text-white p-4 mb-8 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-center">
            Employee Management System
          </h1>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">
            {editingId ? "Edit Employee" : "Add Employee"}
          </h2>
          <Formik
            initialValues={
              editingId
                ? employees.find((emp) => emp.id === editingId)
                : initialValues
            }
            validationSchema={EmployeeSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    name="first_name"
                    icon={User}
                    placeholder="First Name"
                  />
                  <FormField
                    name="last_name"
                    icon={User}
                    placeholder="Last Name"
                  />
                  <FormField
                    name="email"
                    type="email"
                    icon={Mail}
                    placeholder="Email"
                  />
                  <FormField name="phone" icon={Phone} placeholder="Phone" />
                  <FormField name="department" icon={Building2} as="select">
                    <option value="">Select Department</option>
                    <option value="IT">IT</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                  </FormField>
                  <FormField name="position" icon={Briefcase} as="select">
                    <option value="">Select Position</option>
                    <option value="Manager">Manager</option>
                    <option value="Senior Developer">Senior Developer</option>
                    <option value="Junior Developer">Junior Developer</option>
                    <option value="HR Manager">HR Manager</option>
                    <option value="HR Executive">HR Executive</option>
                    <option value="Financial Analyst">Financial Analyst</option>
                    <option value="Marketing Manager">Marketing Manager</option>
                    <option value="Sales Executive">Sales Executive</option>
                  </FormField>
                  <FormField name="hire_date" type="date" icon={Calendar} />
                  <FormField
                    name="salary"
                    type="number"
                    icon={DollarSign}
                    placeholder="Salary in LPA"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors disabled:opacity-50"
                  >
                    {editingId ? (
                      <Edit className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                    {editingId ? "Update" : "Add"} Employee
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </button>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Search & Filter Employees</h2>
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search by ${searchType}...`}
                  className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
              >
                <option value="email">Email</option>
                <option value="phone">Phone</option>
              </select>
            </div>

            <select
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            <select
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={positionFilter}
              onChange={(e) => setPositionFilter(e.target.value)}
            >
              <option value="">All Positions</option>
              {positions.map((pos) => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
            </select>
          </div>

          <h2 className="text-2xl font-bold mb-6">Employees List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Hire Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Salary
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{`${employee.first_name} ${employee.last_name}`}</td>
                    <td className="px-6 py-4">{employee.email}</td>
                    <td className="px-6 py-4">{employee.phone}</td>
                    <td className="px-6 py-4">{employee.department}</td>
                    <td className="px-6 py-4">{employee.position}</td>
                    <td className="px-6 py-4">
                      {new Date(employee.hire_date).toLocaleDateString("en-GB")}
                    </td>
                    <td className="px-6 py-4">{employee.salary} LPA</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleEdit(employee)}
                        className="text-sky-600 hover:text-sky-700"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(employee.id)}
                        className="ml-2 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeManagement;
