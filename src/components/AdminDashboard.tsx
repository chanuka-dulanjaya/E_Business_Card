import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, QrCode, X } from 'lucide-react';
import { employeeApi } from '../lib/api';
import type { Employee } from '../contexts/AuthContext';
import EmployeeForm from './EmployeeForm';
import QRCodeDisplay from './QRCodeDisplay';

export default function AdminDashboard() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [showQR, setShowQR] = useState<Employee | null>(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const data = await employeeApi.getAll();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;

    try {
      await employeeApi.delete(id);
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('Failed to delete employee');
    }
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingEmployee(null);
    fetchEmployees();
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Employees</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Employee
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map((employee) => (
          <div
            key={employee.id}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                {employee.profilePicture ? (
                  <img
                    src={employee.profilePicture}
                    alt={employee.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-slate-400">
                    {employee.fullName.charAt(0)}
                  </span>
                )}
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  employee.role === 'admin'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {employee.role}
              </span>
            </div>

            <h3 className="font-semibold text-lg text-slate-900 mb-1">
              {employee.fullName}
            </h3>
            <p className="text-sm text-slate-600 mb-1">{employee.email}</p>
            {employee.position && (
              <p className="text-sm text-slate-500 mb-1">{employee.position}</p>
            )}
            {employee.department && (
              <p className="text-xs text-slate-400">{employee.department}</p>
            )}

            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
              <button
                onClick={() => setShowQR(employee)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm"
              >
                <QrCode className="w-4 h-4" />
                QR Code
              </button>
              <button
                onClick={() => handleEdit(employee)}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(employee.id)}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <EmployeeForm
          employee={editingEmployee}
          onClose={handleCloseForm}
        />
      )}

      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full relative">
            <button
              onClick={() => setShowQR(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-6 h-6" />
            </button>
            <QRCodeDisplay employee={showQR} />
          </div>
        </div>
      )}
    </div>
  );
}
