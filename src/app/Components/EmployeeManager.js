// File: components/EmployeeManager.js (Main component)
'use client';

import { useState, useEffect } from 'react';
import EmployeeForm from './EmployeeForm';
import EmployeeList from './EmployeeList';

export default function EmployeeManager() {
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees');
      if (response.ok) {
        const data = await response.json();
        setEmployees(data);
      } else {
        setError('Failed to fetch employees');
      }
    } catch (err) {
      setError('Error fetching employees');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = async (employeeData) => {
    try {
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
      });

      if (response.ok) {
        fetchEmployees();
        setError('');
        return { success: true };
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to add employee');
        return { success: false, error: errorData.message };
      }
    } catch (err) {
      setError('Error adding employee');
      return { success: false, error: 'Error adding employee' };
    }
  };

  const handleUpdateEmployee = async (employeeData) => {
    try {
      const response = await fetch('/api/employees', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
      });

      if (response.ok) {
        fetchEmployees();
        setEditingEmployee(null);
        setError('');
        return { success: true };
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update employee');
        return { success: false, error: errorData.message };
      }
    } catch (err) {
      setError('Error updating employee');
      return { success: false, error: 'Error updating employee' };
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const response = await fetch('/api/employees', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        });

        if (response.ok) {
          fetchEmployees();
          setError('');
        } else {
          setError('Failed to delete employee');
        }
      } catch (err) {
        setError('Error deleting employee');
      }
    }
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
  };

  const handleCancelEdit = () => {
    setEditingEmployee(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg text-gray-600">Loading employees...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        <div>
          <EmployeeForm
            onSubmit={editingEmployee ? handleUpdateEmployee : handleAddEmployee}
            employee={editingEmployee}
            onCancel={handleCancelEdit}
          />
        </div>
        
        <div>
          <EmployeeList
            employees={employees}
            onEdit={handleEditEmployee}
            onDelete={handleDeleteEmployee}
          />
        </div>
      </div>
    </div>
  );
}