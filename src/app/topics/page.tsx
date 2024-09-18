// src/app/topics/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Topic } from '../types/Topic';
import TopicForm from '../components/TopicForm';
import TopicEditForm from '../components/TopicEditForm';

const TopicManager: React.FC = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error('Error fetching user:', userError);
      setLoading(false);
      return;
    }

    if (!user) {
      console.log('User not authenticated');
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('topics')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching topics:', error);
    } else {
      setTopics(data || []);
    }
    setLoading(false);
  };

  const handleAddTopic = (topic: Topic) => {
    setTopics((prev) => [topic, ...prev]);
  };

  const handleUpdateTopic = (updatedTopic: Topic) => {
    setTopics((prev) =>
      prev.map((topic) => (topic.id === updatedTopic.id ? updatedTopic : topic))
    );
    setEditingTopicId(null);
  };

  const handleDeleteTopic = async (topicId: string) => {
    const { error } = await supabase.from('topics').delete().eq('id', topicId);

    if (error) {
      console.error('Error deleting topic:', error);
    } else {
      setTopics((prev) => prev.filter((topic) => topic.id !== topicId));
    }
  };

  const handleEditClick = (topicId: string) => {
    setEditingTopicId(topicId);
  };

  const handleCancelEdit = () => {
    setEditingTopicId(null);
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Topic Manager</h1>
      <TopicForm onTopicAdded={handleAddTopic} />
      {loading ? (
        <p>Loading topics...</p>
      ) : (
        <ul>
          {topics.map((topic) => (
            <li key={topic.id} className="border p-2 my-2">
              {editingTopicId === topic.id ? (
                <TopicEditForm
                  topic={topic}
                  onTopicUpdated={handleUpdateTopic}
                  onCancel={handleCancelEdit}
                />
              ) : (
                <>
                  <h2 className="text-xl font-semibold">{topic.title}</h2>
                  <p>{topic.description}</p>
                  <div className="flex space-x-2 mt-2">
                    <button
                      onClick={() => handleEditClick(topic.id)}
                      className="px-2 py-1 bg-blue-500 text-white rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTopic(topic.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TopicManager;
