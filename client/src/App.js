import './App.css';
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import { Route, Routes } from "react-router-dom";
import Navbar from './Components/Navbar';
import Home from './Pages/Home';
import GameBoard from './Components/GameBoard';

function App() {
  return (
    <>
    <Navbar />
    <Routes>
    <Route path="/signup" exact element={<Signup />} />
    <Route path="/login" exact element={<Login />} />
    <Route path="/home" exact element={<Home />} />
    <Route path='/gameboard' exact element={<GameBoard />} />
    </Routes>
    </>
  );
}

export default App;