import backgroundImage from '../img/gym.jpg';

export default function AuthLayout({ children }) {
    return (
        <div 
            className="min-h-screen bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <div className="min-h-screen bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white bg-opacity-10 p-8 rounded-lg backdrop-blur-sm w-full max-w-md">
                    {children}
                </div>
            </div>
        </div>
    );
} 