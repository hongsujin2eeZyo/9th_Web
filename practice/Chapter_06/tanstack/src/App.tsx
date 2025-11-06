import { useEffect, useState } from 'react'
import './App.css'

interface User{ 
  id: number;
  name: string;
  email: string;
 }


function App() {
  const [data,setData] = useState<User | null>(null);

  useEffect(() :void =>{
    const fetchData = async() : Promise<void> =>{
    const response = await fetch('https://jsonplaceholder.typicode.com/users/1');
    const data = await response.json() as User;
    setData(data);
  }


    fetchData();
  },[]); 

  return (
    <>
    <h1>Tanstack Query</h1>
    {data?.name}
    </>
  )
}

export default App
