import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

const fetchUsers = async () => {
  const response = await fetch('https://dummyjson.com/users');
  const data = await response.json();
  return data;
};

const Users = () => {
  const { data: data = [], isLoading, error, refetch } = useQuery('users', fetchUsers , {staleTime:300000});
  console.log(data.users, 'data');



  return (
    <div>

      <div className="h-screen">
        <div className="flex justify-between items-center p-3 border-b">
          <h2 className="text-2xl font-bold">User List</h2>
          <div className='flex gap-4'>
          <button className="px-4 py-1.5 text-center text-[15px] font-bold font-mono rounded-md bg-amber-300" onClick={refetch}>
          Refresh
        </button>
          <Link to={''}>
            <button className="px-4 py-1.5 text-center text-[15px] font-bold font-mono rounded-md bg-amber-300">
              Create
            </button>
          </Link>
          </div>
        </div>
        <div className="">
        {/* {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>} */}
          <table className="bg-white w-[100%] h-[100%]">
            <thead className="bg-white">
              <tr>
                <th className="py-2 px-4 border-b">ID</th>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Email </th>
                <th className="py-2 px-4 border-b">Gender </th>
                <th className="py-2 px-4 border-b">Address </th>
                <th className="py-2 px-4 border-b">DOB </th>
              </tr>
            </thead>
            {data?.users?.length > 0 && (
              <tbody className="h-full overflow-y-scroll">
                {data?.users?.map((user) => (
                  <tr
                    key={user.id}
                    className={`hover:bg-gray-100 text-center `}
                    style={{ cursor: 'pointer' }}
                  >
                    <td className="py-2 px-4 border-b">{user.id}</td>
                    <td className="py-2 px-4 border-b">{user.firstName}</td>
                    <td className="py-2 px-4 border-b">{user.email}</td>
                    <td className="py-2 px-4 border-b">{user.gender}</td>
                    <td className="py-2 px-4 border-b">{user.address.address}</td>
                    <td className="py-2 px-4 border-b">{user.birthDate}</td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
      
      </div>
    </div>
  );
};

export default Users;
