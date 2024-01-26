// EmployeeTable.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';


const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [offlineEmployees, setOfflineEmployees] = useState([]);
  
    useEffect(() => {
      const storedEmployees = localStorage.getItem('employees');
      if (storedEmployees) {
        setEmployees(JSON.parse(storedEmployees));
      } else {
        fetchEmployeesAPI();
      }
    }, []);
  
    const fetchEmployeesAPI = () => {
      // Use Axios to fetch data
      axios.get('https://dummy.restapiexample.com/api/v1/employees', {
        headers: {
          'Content-Type': 'application/json',
        },
        crossdomain: true,
      })
        .then((response) => {
          const data = response.data;
          console.log(data, 'data');
          setEmployees(data);
          localStorage.setItem('employees', JSON.stringify(data));
        })
        .catch((error) => {
          console.error('Error fetching employees:', error);
        });
    };
    return (
        <div className="h-screen">
      <div className="flex justify-between items-center p-3 border-b">
        <h2 className="text-2xl font-bold">Employees List</h2>
       
      </div>
      <div>
      {employees.length > 0 && (
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Employee Name</th>
              <th className="px-4 py-2">Salary</th>
              <th className="px-4 py-2">Update Data</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td className="border px-4 py-2">{employee.id}</td>
                <td className="border px-4 py-2">{employee.employee_name}</td>
                <td className="border px-4 py-2">{employee.employee_salary}</td>
                <td className="border px-4 py-2">
                <Link to={`/update-employee ${employee.id}`}>
                <button className="px-4 py-1.5 text-center text-[15px] font-bold font-mono rounded-md bg-amber-300">
                    Edit Employee
                </button>
                </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </div>
  
  );
};

export default Employees;
