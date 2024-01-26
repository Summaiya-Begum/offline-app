// EmployeeForm.js
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';


const EmployeeForm = () => {
    const { id } = useParams();
  const [employeeId, setEmployeeId] = useState('');
  const [newSalary, setNewSalary] = useState('');

    console.log(id , 'id');
  const handleUpdate = () => {
    // Implement the logic to update the employee details
    // using the provided API endpoint (https://dummy.restapiexample.com/api/v1/update/{id})
    // ...

    // Assuming the update is successful, trigger the callback
  };

  return (
    <div className='w-full'>
      <form className='w-1/2 m-auto'>
      <h2 className="text-2xl font-bold mb-4 w-[100%] my-10">Update Employee</h2>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="employeeId">
            Employee ID:
          </label>
          <input
            type="text"
            id="employeeId"
            className="border rounded w-full py-2 px-3"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="newSalary">
            New Salary:
          </label>
          <input
            type="text"
            id="newSalary"
            className="border rounded w-full py-2 px-3"
            value={newSalary}
            onChange={(e) => setNewSalary(e.target.value)}
          />
        </div>
        <button
          type="button"
          className="bg-blue-500 text-white py-2 px-4 rounded"
          onClick={handleUpdate}
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default EmployeeForm;
