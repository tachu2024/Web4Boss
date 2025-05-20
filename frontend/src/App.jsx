// File: src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import Posts from './pages/Posts';
import ContentPage from './components/ContentPage';
import MainLayout from './components/MainLayout';

export default function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Navigate to="/home" />} />
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/posts" element={<Posts />} />
                
                {/* Main menu routes */}
                <Route path="/family" element={
                    <MainLayout>
                        <ContentPage title="Family" />
                    </MainLayout>
                } />
                <Route path="/technical" element={
                    <MainLayout>
                        <ContentPage title="Technical" />
                    </MainLayout>
                } />
                <Route path="/car" element={
                    <MainLayout>
                        <ContentPage title="Car" />
                    </MainLayout>
                } />
                <Route path="/english" element={
                    <MainLayout>
                        <ContentPage title="English" />
                    </MainLayout>
                } />
                <Route path="/friend" element={
                    <MainLayout>
                        <ContentPage title="Friend" />
                    </MainLayout>
                } />
                
                {/* Sport submenu routes */}
                <Route path="/sport/gym" element={
                    <MainLayout>
                        <ContentPage title="Gym" />
                    </MainLayout>
                } />
                <Route path="/sport/yoga" element={
                    <MainLayout>
                        <ContentPage title="Yoga" />
                    </MainLayout>
                } />
                <Route path="/sport/burn" element={
                    <MainLayout>
                        <ContentPage title="Burn" />
                    </MainLayout>
                } />
                <Route path="/sport/swim" element={
                    <MainLayout>
                        <ContentPage title="Swim" />
                    </MainLayout>
                } />
                <Route path="/sport/run" element={
                    <MainLayout>
                        <ContentPage title="Run" />
                    </MainLayout>
                } />
                <Route path="/sport/cycle" element={
                    <MainLayout>
                        <ContentPage title="Cycle" />
                    </MainLayout>
                } />
                <Route path="/sport/guitar" element={
                    <MainLayout>
                        <ContentPage title="Đàn" />
                    </MainLayout>
                } />
                <Route path="/commic" element={
                    <MainLayout>
                        <ContentPage title="Truyện Tranh" />
                    </MainLayout>
                } />
                <Route path="/camera" element={
                    <MainLayout>
                        <ContentPage title="Camera Thông minh" />
                    </MainLayout>
                } />
            </Routes>
        </Router>
    );
}