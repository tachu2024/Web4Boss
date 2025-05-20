// File: src/components/Navbar.jsx
import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav className="bg-gray-800 text-white p-4 flex gap-4">
            <Link to="/home">Home</Link>
            <Link to="/posts">Posts</Link>
            <Link to="/topics">Chủ đề</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
        </nav>
    );
}