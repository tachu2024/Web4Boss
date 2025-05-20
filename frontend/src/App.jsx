// File: src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Posts from './pages/Posts';
import Topics from './pages/Topics';
import ContentPage from './components/ContentPage';
import MainLayout from './components/MainLayout';
import { TopicProvider } from './context/TopicContext';

function App() {
    return (
        <TopicProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<MainLayout><Home /></MainLayout>} />
                    <Route path="/home" element={<MainLayout><Home /></MainLayout>} />
                    <Route path="/posts" element={<MainLayout><Posts /></MainLayout>} />
                    <Route path="/topics" element={<MainLayout><Topics /></MainLayout>} />
                    <Route path="/topic/:topicId" element={<MainLayout><ContentPage /></MainLayout>} />
                </Routes>
            </Router>
        </TopicProvider>
    );
}

export default App;