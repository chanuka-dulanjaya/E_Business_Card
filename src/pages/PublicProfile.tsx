import { useEffect, useState } from 'react';
import { Mail, Phone, Briefcase, Building2, User } from 'lucide-react';
import { employeeApi } from '../lib/api';

interface Employee {
  id: string;
  email: string;
  fullName: string;
  mobileNumber: string | null;
  profilePicture: string | null;
  department: string | null;
  position: string | null;
}

export default function PublicProfile({ employeeId }: { employeeId: string }) {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployee();
  }, [employeeId]);

  const fetchEmployee = async () => {
    try {
      const data = await employeeApi.getById(employeeId);
      setEmployee(data);
    } catch (error) {
      console.error('Error fetching employee:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Employee not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-8 py-12 text-center">
            <div className="w-32 h-32 mx-auto mb-4 rounded-full border-4 border-white overflow-hidden bg-white">
              {employee.profilePicture ? (
                <img
                  src={employee.profilePicture}
                  alt={employee.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-100">
                  <User className="w-16 h-16 text-slate-400" />
                </div>
              )}
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {employee.fullName}
            </h1>
            {employee.position && (
              <p className="text-slate-300 text-lg">{employee.position}</p>
            )}
          </div>

          <div className="px-8 py-8 space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-slate-100 p-3 rounded-lg">
                <Mail className="w-5 h-5 text-slate-700" />
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">Email</p>
                <p className="text-slate-900">{employee.email}</p>
              </div>
            </div>

            {employee.mobileNumber && (
              <div className="flex items-start gap-4">
                <div className="bg-slate-100 p-3 rounded-lg">
                  <Phone className="w-5 h-5 text-slate-700" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 font-medium">Mobile</p>
                  <p className="text-slate-900">{employee.mobileNumber}</p>
                </div>
              </div>
            )}

            {employee.department && (
              <div className="flex items-start gap-4">
                <div className="bg-slate-100 p-3 rounded-lg">
                  <Building2 className="w-5 h-5 text-slate-700" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 font-medium">Department</p>
                  <p className="text-slate-900">{employee.department}</p>
                </div>
              </div>
            )}

            {employee.position && (
              <div className="flex items-start gap-4">
                <div className="bg-slate-100 p-3 rounded-lg">
                  <Briefcase className="w-5 h-5 text-slate-700" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 font-medium">Position</p>
                  <p className="text-slate-900">{employee.position}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
