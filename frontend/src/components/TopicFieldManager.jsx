import { useState, useEffect } from 'react';
import api from '../config/api';

const FIELD_TYPES = [
    { value: 'text', label: 'Văn bản' },
    { value: 'number', label: 'Số' },
    { value: 'date', label: 'Ngày tháng' },
    { value: 'image', label: 'Hình ảnh' },
    { value: 'video', label: 'Video' },
    { value: 'array', label: 'Danh sách' }
];

export default function TopicFieldManager({ topic, onClose }) {
    const [fields, setFields] = useState([]);
    const [newField, setNewField] = useState({
        name: '',
        key: '',
        type: 'text',
        required: false,
        description: '',
        order: 0
    });
    const [error, setError] = useState('');

    useEffect(() => {
        if (topic) {
            fetchFields();
        }
    }, [topic]);

    const fetchFields = async () => {
        try {
            const response = await api.get(`/api/topic-fields/topic/${topic.id}`);
            setFields(response.data);
        } catch (error) {
            console.error('Error fetching fields:', error);
            setError('Không thể tải danh sách trường');
        }
    };

    const handleCreateField = async (e) => {
        e.preventDefault();
        try {
            const fieldData = {
                ...newField,
                topicId: topic.id
            };
            await api.post('/api/topic-fields', fieldData);
            setNewField({
                name: '',
                key: '',
                type: 'text',
                required: false,
                description: '',
                order: fields.length
            });
            await fetchFields();
        } catch (error) {
            setError('Không thể tạo trường mới');
        }
    };

    const handleDeleteField = async (fieldId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa trường này?')) {
            try {
                await api.delete(`/api/topic-fields/${fieldId}`);
                await fetchFields();
            } catch (error) {
                setError('Không thể xóa trường');
            }
        }
    };

    const handleClose = () => {
        if (onClose) {
            onClose(fields);
        }
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Quản lý trường cho chủ đề: {topic?.name}</h3>
                <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
                    Đóng
                </button>
            </div>

            {/* Form thêm trường mới */}
            <form onSubmit={handleCreateField} className="mb-6 p-4 border rounded-lg">
                <h4 className="font-medium mb-3">Thêm trường mới</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tên trường</label>
                        <input
                            type="text"
                            value={newField.name}
                            onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                            className="mt-1 block w-full border rounded-md shadow-sm p-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Key</label>
                        <input
                            type="text"
                            value={newField.key}
                            onChange={(e) => setNewField({ ...newField, key: e.target.value })}
                            className="mt-1 block w-full border rounded-md shadow-sm p-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Loại dữ liệu</label>
                        <select
                            value={newField.type}
                            onChange={(e) => setNewField({ ...newField, type: e.target.value })}
                            className="mt-1 block w-full border rounded-md shadow-sm p-2"
                        >
                            {FIELD_TYPES.map(type => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                        <input
                            type="text"
                            value={newField.description}
                            onChange={(e) => setNewField({ ...newField, description: e.target.value })}
                            className="mt-1 block w-full border rounded-md shadow-sm p-2"
                        />
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={newField.required}
                            onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                            className="h-4 w-4 text-blue-600"
                        />
                        <label className="ml-2 text-sm text-gray-700">Bắt buộc</label>
                    </div>
                </div>
                <div className="mt-4">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Thêm trường
                    </button>
                </div>
            </form>

            {/* Danh sách các trường */}
            <div className="border rounded-lg">
                <h4 className="font-medium p-4 border-b">Danh sách trường</h4>
                {fields.map((field) => (
                    <div key={field.id} className="p-4 border-b last:border-b-0">
                        <div className="flex justify-between items-center">
                            <div>
                                <h5 className="font-medium">{field.name}</h5>
                                <p className="text-sm text-gray-500">
                                    Key: {field.key} | Type: {field.type} | 
                                    {field.required ? ' Bắt buộc' : ' Không bắt buộc'}
                                </p>
                                {field.description && (
                                    <p className="text-sm text-gray-600 mt-1">{field.description}</p>
                                )}
                            </div>
                            <button
                                onClick={() => handleDeleteField(field.id)}
                                className="text-red-600 hover:text-red-800"
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {error && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}
        </div>
    );
} 