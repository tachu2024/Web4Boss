import React, { useState, useEffect } from 'react';
import { useTopics } from '../context/TopicContext';
import api from '../config/api';

const ICON_OPTIONS = [
    { value: '📚', label: '📚 Sách' },
    { value: '🎮', label: '🎮 Game' },
    { value: '🎵', label: '🎵 Âm nhạc' },
    { value: '🎬', label: '🎬 Phim ảnh' },
    { value: '🏃', label: '🏃 Thể thao' },
    { value: '📷', label: '📷 Nhiếp ảnh' },
    { value: '💻', label: '💻 Công nghệ' },
    { value: '🎨', label: '🎨 Nghệ thuật' },
    { value: '👨‍👩‍👧‍👦', label: '👨‍👩‍👧‍👦 Gia đình' },
    { value: '📁', label: '📁 Folder' }
];

export default function Topics() {
    const [topics, setTopics] = useState([]);
    const [childTopics, setChildTopics] = useState({});
    const [expandedTopics, setExpandedTopics] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [editingTopic, setEditingTopic] = useState(null);
    const [newTopic, setNewTopic] = useState({ 
        name: '', 
        description: '', 
        icon: '📚',
        parentId: null 
    });
    const [error, setError] = useState('');
    const [customIcon, setCustomIcon] = useState(null);
    const { refreshTopics } = useTopics();

    useEffect(() => {
        fetchTopics();
    }, []);

    const fetchTopics = async () => {
        try {
            const response = await api.get('/api/topics/main');
            setTopics(response.data);
            // Fetch child topics for each main topic
            const childTopicsMap = {};
            for (const topic of response.data) {
                try {
                    const childResponse = await api.get(`/api/topics/${topic.id}/children`);
                    childTopicsMap[topic.id] = childResponse.data;
                } catch (error) {
                    console.error(`Error fetching children for topic ${topic.id}:`, error);
                    childTopicsMap[topic.id] = [];
                }
            }
            setChildTopics(childTopicsMap);
        } catch (error) {
            console.error('Error fetching topics:', error);
            setError('Không thể tải danh sách chủ đề');
        }
    };

    const toggleExpand = (topicId) => {
        setExpandedTopics(prev => ({
            ...prev,
            [topicId]: !prev[topicId]
        }));
    };

    const handleCreateTopic = async (e) => {
        e.preventDefault();
        try {
            const topicData = {
                name: newTopic.name,
                description: newTopic.description,
                icon: newTopic.icon
            };
            
            if (newTopic.parentId) {
                topicData.parentId = newTopic.parentId;
            }

            if (editingTopic) {
                await api.put(`/api/topics/${editingTopic.id}`, topicData);
            } else {
                await api.post('/api/topics', topicData);
            }
            
            setNewTopic({ name: '', description: '', icon: '📚', parentId: null });
            setCustomIcon(null);
            setEditingTopic(null);
            setShowModal(false);
            setError('');
            refreshTopics();
            fetchTopics();
        } catch (error) {
            console.error('Error saving topic:', error);
            setError('Không thể lưu chủ đề. Vui lòng thử lại.');
        }
    };

    const handleDeleteTopic = async (topicId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa chủ đề này?')) {
            try {
                await api.delete(`/api/topics/${topicId}`);
                refreshTopics();
                fetchTopics();
            } catch (error) {
                setError('Không thể xóa chủ đề. Vui lòng thử lại.');
            }
        }
    };

    const handleEditTopic = (topic) => {
        setEditingTopic(topic);
        setNewTopic({
            name: topic.name,
            description: topic.description || '',
            icon: topic.icon,
            parentId: topic.parentId || null
        });
        setShowModal(true);
    };

    const handleIconChange = (e) => {
        setNewTopic({ ...newTopic, icon: e.target.value });
        setCustomIcon(null);
    };

    const handleCustomIconChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCustomIcon(file);
            setNewTopic({ ...newTopic, icon: 'custom' });
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingTopic(null);
        setNewTopic({ name: '', description: '', icon: '📚', parentId: null });
        setCustomIcon(null);
    };

    const renderTopicRow = (topic, isChild = false) => (
        <tr key={topic.id} className={isChild ? 'bg-gray-50' : ''}>
            <td className="px-6 py-4 whitespace-nowrap text-2xl">
                {topic.icon}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    {!isChild && childTopics[topic.id]?.length > 0 && (
                        <button
                            onClick={() => toggleExpand(topic.id)}
                            className="mr-2 text-gray-500 hover:text-gray-700"
                        >
                            {expandedTopics[topic.id] ? '▼' : '▶'}
                        </button>
                    )}
                    <div className="text-sm font-medium text-gray-900">
                        {topic.name}
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="text-sm text-gray-500">
                    {topic.description}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                    onClick={() => handleEditTopic(topic)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                    ✏️ Sửa
                </button>
                <button
                    onClick={() => handleDeleteTopic(topic.id)}
                    className="text-red-600 hover:text-red-900"
                >
                    🗑️ Xóa
                </button>
            </td>
        </tr>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Quản lý chủ đề</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Tạo chủ đề mới
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {/* Topics List */}
            <div className="bg-white rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Icon
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tên chủ đề
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Mô tả
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {topics.map((topic) => (
                                <>
                                    {renderTopicRow(topic)}
                                    {expandedTopics[topic.id] && childTopics[topic.id]?.map(childTopic => (
                                        <React.Fragment key={childTopic.id}>
                                            {renderTopicRow(childTopic, true)}
                                        </React.Fragment>
                                    ))}
                                </>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                                {editingTopic ? 'Sửa chủ đề' : 'Tạo chủ đề mới'}
                            </h3>
                            <form onSubmit={handleCreateTopic}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Tên chủ đề
                                    </label>
                                    <input
                                        type="text"
                                        value={newTopic.name}
                                        onChange={(e) => setNewTopic({ ...newTopic, name: e.target.value })}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Mô tả
                                    </label>
                                    <textarea
                                        value={newTopic.description}
                                        onChange={(e) => setNewTopic({ ...newTopic, description: e.target.value })}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Chủ đề cha
                                    </label>
                                    <select
                                        value={newTopic.parentId || ''}
                                        onChange={(e) => setNewTopic({ ...newTopic, parentId: e.target.value || null })}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    >
                                        <option value="">Chủ đề chính (không có chủ đề cha)</option>
                                        {topics.map(topic => (
                                            <option key={topic.id} value={topic.id}>
                                                {topic.icon} {topic.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Icon
                                    </label>
                                    <div className="flex gap-4">
                                        <select
                                            value={newTopic.icon}
                                            onChange={handleIconChange}
                                            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline flex-grow"
                                        >
                                            {ICON_OPTIONS.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="flex items-center">
                                            <label className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer">
                                                Chọn ảnh
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleCustomIconChange}
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>
                                    </div>
                                    {customIcon && (
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-600">Đã chọn: {customIcon.name}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-end gap-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        {editingTopic ? 'Lưu' : 'Tạo'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 