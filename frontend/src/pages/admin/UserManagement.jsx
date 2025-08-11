// import React, { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { 
//   fetchUsers, 
//   fetchUserById, 
//   updateUserRole, 
//   clearCurrentUser,
//   searchUsers,
//   clearUsersError
// } from '../../Store/Admin/User/userSlice';
// import { toast } from 'react-toastify';

// const UserManagement = () => {
//   const dispatch = useDispatch();
//   const {
//     users,
//     filteredUsers,
//     currentUser,
//     loading,
//     error
//   } = useSelector((state) => state.users);

//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedRole, setSelectedRole] = useState('');

//   useEffect(() => {
//     dispatch(fetchUsers());
//   }, [dispatch]);

//   useEffect(() => {
//     if (error) {
//       toast.error(error.message || 'Something went wrong');
//       dispatch(clearUsersError());
//     }
//   }, [error, dispatch]);

//   const handleSearch = (e) => {
//     const value = e.target.value;
//     setSearchTerm(value);
//     dispatch(searchUsers(value));
//   };

//   const handleUserClick = (userId) => {
//     dispatch(fetchUserById(userId)).then((action) => {
//       if (action.payload) {
//         setSelectedRole(action.payload.role);
//       }
//     });
//   };

//   const handleRoleUpdate = () => {
//     if (!currentUser) return;
    
//     dispatch(updateUserRole({
//       id: currentUser._id,
//       role: selectedRole
//     })).then((action) => {
//       if (!action.error) {
//         toast.success('User role updated successfully');
//         dispatch(clearCurrentUser());
//       }
//     });
//   };

//   const roleOptions = [
//     { value: 'super_admin', label: 'Super Admin' },
//     { value: 'admin', label: 'Admin' },
//     { value: 'employee', label: 'Employee' },
//     { value: 'customer', label: 'Customer' }
//   ];

//   if (loading && !users.length) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold text-gray-800 mb-6">User Management</h1>
      
//       {/* Search Bar */}
//       <div className="mb-6">
//         <input
//           type="text"
//           placeholder="Search users..."
//           value={searchTerm}
//           onChange={handleSearch}
//           className="w-full md:w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           disabled={loading}
//         />
//       </div>

//       {/* User List */}
//       <div className="bg-white shadow-md rounded-lg overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredUsers.map((user) => (
//                 <tr 
//                   key={user._id} 
//                   onClick={() => handleUserClick(user._id)}
//                   className={`cursor-pointer hover:bg-gray-50 ${
//                     currentUser?._id === user._id ? 'bg-blue-50' : ''
//                   }`}
//                 >
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <div className="ml-4">
//                         <div className="text-sm font-medium text-gray-900">
//                           {user.firstName} {user.lastName}
//                         </div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm text-gray-900">{user.email}</div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
//                       ${user.role === 'super_admin' ? 'bg-purple-100 text-purple-800' : 
//                         user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 
//                         user.role === 'employee' ? 'bg-green-100 text-green-800' : 
//                         'bg-gray-100 text-gray-800'}`}>
//                       {user.role}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Role Edit Section */}
//       {currentUser && (
//         <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
//           <h2 className="text-xl font-semibold mb-4">
//             Edit Role for {currentUser.firstName} {currentUser.lastName}
//           </h2>
//           <div className="flex flex-col md:flex-row md:items-center gap-4">
//             <select
//               value={selectedRole}
//               onChange={(e) => setSelectedRole(e.target.value)}
//               className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               disabled={loading}
//             >
//               {roleOptions.map((option) => (
//                 <option key={option.value} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//             <button
//               onClick={handleRoleUpdate}
//               disabled={loading}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
//             >
//               {loading ? 'Updating...' : 'Update Role'}
//             </button>
//             <button
//               onClick={() => dispatch(clearCurrentUser())}
//               disabled={loading}
//               className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserManagement;









import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  registerEmployee,
  fetchAllEmployees,
  fetchEmployeeById,
  updateEmployeeDetails,
  deactivateEmployee,
  resetEmployeeState,
  clearCurrentEmployee,
} from '../../Store/Admin/User/userSlice copy';

const EmployeeManagement = () => {
  const dispatch = useDispatch();
  const {
    employees,
    currentEmployee,
    loading,
    error,
    success,
    registerStatus,
    fetchStatus,
    updateStatus,
  } = useSelector((state) => state.employees);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: 'Sales',
    role:'employee' // default department
  });

  const [isEditMode, setIsEditMode] = useState(false);

  // Form field handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Load all employees on component mount
  useEffect(() => {
    dispatch(fetchAllEmployees());
    return () => {
      dispatch(resetEmployeeState());
    };
  }, [dispatch]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isEditMode && currentEmployee) {
      dispatch(updateEmployeeDetails({ 
        id: currentEmployee._id, 
        employeeData: formData 
      }));
    } else {
      dispatch(registerEmployee(formData));
    }
  };

  // Handle employee selection for editing
  const handleEdit = (employeeId) => {
    dispatch(fetchEmployeeById(employeeId)).then((action) => {
      if (action.payload) {
        const emp = action.payload.data;
        setFormData({
          firstName: emp.userRef.firstName,
          lastName: emp.userRef.lastName,
          email: emp.userRef.email,
          phone: emp.userRef.phone,
          department: emp.department,
          role:'employee'
        });
        setIsEditMode(true);
      }
    });
  };

  // Handle employee deactivation
  const handleDeactivate = (employeeId) => {
    if (window.confirm('Are you sure you want to deactivate this employee?')) {
      dispatch(deactivateEmployee(employeeId));
    }
  };

  // Reset form and state
  const handleReset = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      department: 'Sales',
      role:'employee'
    });
    setIsEditMode(false);
    dispatch(clearCurrentEmployee());
    dispatch(resetEmployeeState());
  };

  // Departments for dropdown
  const departments = ['Sales', 'Support', 'Admin', 'Operations'];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Employee Management</h1>
      
      {/* Success Message */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Operation completed successfully!
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Employee Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            {isEditMode ? 'Edit Employee' : 'Register New Employee'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
                disabled={isEditMode}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                disabled={loading}
              >
                {loading ? 'Processing...' : isEditMode ? 'Update' : 'Register'}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Employee List */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Employee List</h2>
          
          {fetchStatus === 'loading' ? (
            <div className="text-center py-4">Loading employees...</div>
          ) : 1 ? (
            <div className="text-center py-4">No employees found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employees.map((emp) => (
                    <tr key={emp._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {emp.userRef?.firstName} {emp.userRef?.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {emp.userRef?.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {emp.department}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(emp._id)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeactivate(emp._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Deactivate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeManagement;