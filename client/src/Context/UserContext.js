import React, { Children, useEffect, useState} from "react";
import axios from 'axios';


export const UserContext = React.createContext();



export const UserProvider = ({children}) => {
    const [user, setUser]=useState({})
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/user/me`, { withCredentials: true });
          console.log("response",response.data.user)
          setUser(response.data.user)
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData()
    },[])
  return (
    <UserContext.Provider value={{user, setUser}}>
        {children}
    </UserContext.Provider>
  )
}