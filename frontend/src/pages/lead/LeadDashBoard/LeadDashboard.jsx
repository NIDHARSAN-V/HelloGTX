import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import NewQuery from '../Query/NewQuery';

const LeadDashboard = () => {
  const location = useLocation();
  const { leadId, customer } = location.state || {};
  const { user } = useSelector((state) => state.auth);

  const [activeSection, setActiveSection] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // for mobile toggle

  useEffect(() => {
    console.log('User Info:', user);
    console.log('Lead ID from state:', leadId);
    console.log('Customer Info from state:', customer);

    if (leadId) {
      const fetchLeadDetails = async () => {
        try {


          const response = await axios.get(`http://localhost:8000/api/employee/get-lead-details/${leadId}`);
          console.log(response.data);
          


        } catch (error) {
          console.error('Failed to fetch lead details:', error);
        }
      };

      fetchLeadDetails();
    }
  }, [leadId]);







  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 bg-gray-800 text-white p-6 md:min-h-screen transition-all duration-300`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Menu</h2>
          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setIsSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        <ul className="space-y-4">
          <li
            className={`hover:bg-gray-700 p-2 rounded cursor-pointer ${
              activeSection === 'query' ? 'bg-gray-700' : ''
            }`}
            onClick={() => setActiveSection('query')}
          >
            Query
          </li>
          <li
            className={`hover:bg-gray-700 p-2 rounded cursor-pointer ${
              activeSection === 'cccc1' ? 'bg-gray-700' : ''
            }`}
            onClick={() => setActiveSection('cccc1')}
          >
            CCCCC 1
          </li>
          <li
            className={`hover:bg-gray-700 p-2 rounded cursor-pointer ${
              activeSection === 'cccc2' ? 'bg-gray-700' : ''
            }`}
            onClick={() => setActiveSection('cccc2')}
          >
            CCCCC 2
          </li>
          <li
            className={`hover:bg-gray-700 p-2 rounded cursor-pointer ${
              activeSection === 'cccc3' ? 'bg-gray-700' : ''
            }`}
            onClick={() => setActiveSection('cccc3')}
          >
            CCCCC 3
          </li>
        </ul>
      </aside>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden bg-gray-800 text-white px-4 py-2 fixed top-4 left-4 rounded z-50"
        onClick={() => setIsSidebarOpen(true)}
      >
        ☰
      </button>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {/* Dashboard info (always visible at top) */}
        <div className="mb-6 border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Lead Dashboard</h1>
          {leadId ? (
            <p className="text-lg text-gray-700">
              Loaded lead ID: <span className="font-semibold">{leadId}</span>
            </p>
          ) : (
            <p className="text-lg text-red-500">No lead ID provided.</p>
          )}
        </div>

        {/* Dynamic Sections */}
       {/* Dynamic Sections */}
{activeSection === 'query' && (
  <NewQuery leadId={leadId} user={user} customer={customer} />
)}

        {activeSection === 'cccc1' && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Section CCCCC 1</h2>
            <p className="text-gray-600">This is content for CCCCC 1.</p>
          </div>
        )}
        {activeSection === 'cccc2' && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Section CCCCC 2</h2>
            <p className="text-gray-600">This is content for CCCCC 2.</p>
          </div>
        )}
        {activeSection === 'cccc3' && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Section CCCCC 3</h2>
            <p className="text-gray-600">This is content for CCCCC 3.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default LeadDashboard;
