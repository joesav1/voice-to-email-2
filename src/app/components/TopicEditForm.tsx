// src/components/TopicEditForm.tsx
'use client';

import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Topic } from '../types/Topic';

interface TopicEditFormProps {
  topic: Topic;
  onTopicUpdated: (topic: Topic) => void;
  onCancel: () => void;
}

const TopicEditForm: React.FC<TopicEditFormProps> = ({ topic, onTopicUpdated, onCancel }) => {
  const [title, setTitle] = useState(topic.title);
  const [description, setDescription] = useState(topic.description || '');
  const [loading, setLoading] = useState(false);

  const handleUpdateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase
      .from('topics')
      .update({ title, description })
      .eq('id', topic.id)
      .select();

    if (error) {
      console.error('Error updating topic:', error);
    } else if (data) {
      onTopicUpdated(data[0]);
      onCancel();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleUpdateTopic} className="mb-4">
      <div className="mb-2">
        <label className="block font-semibold">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
      </div>
      <div className="mb-2">
        <label className="block font-semibold">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>
      <div className="flex space-x-2">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {loading ? 'Updating...' : 'Update Topic'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default TopicEditForm;
