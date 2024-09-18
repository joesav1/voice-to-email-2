// src/components/TopicList.tsx

'use client';

import React, { useState } from 'react';
import { Topic } from '../types/Topic';
import TopicEditForm from '../components/TopicEditForm';
import { supabase } from '../lib/supabaseClient';

interface TopicListProps {
  topics: Topic[];
  onTopicUpdated: (topic: Topic) => void;
  onTopicDeleted: (topicId: string) => void;
}

const TopicList: React.FC<TopicListProps> = ({
  topics,
  onTopicUpdated,
  onTopicDeleted,
}) => {
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);

  const handleEditClick = (topicId: string) => {
    setEditingTopicId(topicId);
  };

  const handleCancelEdit = () => {
    setEditingTopicId(null);
  };

  const handleDeleteTopic = async (topicId: string) => {
    const { error } = await supabase.from('topics').delete().eq('id', topicId);

    if (error) {
      console.error('Error deleting topic:', error);
    } else {
      onTopicDeleted(topicId);
    }
  };

  return (
    <ul>
      {topics.map((topic) => (
        <li key={topic.id} className="border p-2 my-2">
          {editingTopicId === topic.id ? (
            <TopicEditForm
              topic={topic}
              onTopicUpdated={onTopicUpdated}
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
  );
};

export default TopicList;
