import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../Context/UserContext';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const { setUser } = useContext(UserContext);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/user/login', formData, {
        withCredentials: true 
      });
      console.log('Success:', response.data);
      alert(response.data.message)
      setUser(response.data.user)
      navigate("/home")
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-xl italic font-semibold text-gray-900 dark:text-white">
        <form className="max-w-sm mx-auto bg-gray-800 p-8 rounded-lg shadow-md" onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-300 dark:text-white">
              Your username
            </label>
            <input
              type="text"
              id="username"
              className="bg-gray-700 border border-gray-600 text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Your username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-5">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-300 dark:text-white">
              Your password
            </label>
            <input
              type="password"
              id="password"
              className="bg-gray-700 border border-gray-600 text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;