import Home from './JavaScript/Home'
import NavBar from './JavaScript/NavBar'
import Send from './JavaScript/Send'
import Login from './JavaScript/login'
import Receive from './JavaScript/Recieve'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <Router>
            <div className="App">
                <NavBar />
                <Routes>
                    <Route path="/" exact element={<Home />} />
                    <Route path="/send/:itemId" element={<Send />} />
                    <Route path="/download" element={<Receive />} />
                    <Route path="/Login" element={<Login />} />
                </Routes>
            </div>
        </Router>
    )
}

export default App
