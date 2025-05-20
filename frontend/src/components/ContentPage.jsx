import backgroundImage from '../img/denthuong.jpg';

export default function ContentPage({ title }) {
    return (
        <div 
            className="min-h-screen bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <div className="p-8 min-h-screen bg-black bg-opacity-50">
                <h1 className="text-3xl font-bold mb-4 text-white">{title}</h1>
                <div className="bg-white bg-opacity-10 p-6 rounded-lg">
                    <p className="text-white text-lg">
                        Đang chờ anh Tuấn Anh thiết kế CMS và DB. Nội dung sẽ được cập nhật sau.
                    </p>
                </div>
            </div>
        </div>
    );
} 