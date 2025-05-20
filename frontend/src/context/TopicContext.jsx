import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../config/api';

const TopicContext = createContext();

export function TopicProvider({ children }) {
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTopics = async () => {
        try {
            setLoading(true);
            // Fetch main topics (parent topics)
            const mainResponse = await api.get('/api/topics/main');
            const mainTopics = mainResponse.data;

            // Fetch children for each main topic
            const topicsWithChildren = await Promise.all(
                mainTopics.map(async (topic) => {
                    try {
                        const childrenResponse = await api.get(`/api/topics/${topic.id}/children`);
                        return {
                            ...topic,
                            children: childrenResponse.data
                        };
                    } catch (error) {
                        console.error(`Error fetching children for topic ${topic.id}:`, error);
                        return {
                            ...topic,
                            children: []
                        };
                    }
                })
            );

            setTopics(topicsWithChildren);
        } catch (error) {
            console.error('Error fetching topics:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchTopics();
        }
    }, []);

    const refreshTopics = async () => {
        await fetchTopics();
    };

    const clearTopics = () => {
        setTopics([]);
        setLoading(false);
    };

    return (
        <TopicContext.Provider value={{ topics, loading, refreshTopics, clearTopics }}>
            {children}
        </TopicContext.Provider>
    );
}

export function useTopics() {
    const context = useContext(TopicContext);
    if (!context) {
        throw new Error('useTopics must be used within a TopicProvider');
    }
    return context;
} 