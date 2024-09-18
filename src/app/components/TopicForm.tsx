// src/components/TopicForm.tsx
'use client';

import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Topic } from '../types/Topic';

interface TopicFormProps {
  onTopicAdded: (topic: Topic) => void;
}

const TopicForm: React.FC<TopicFormProps> = ({ onTopicAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      // Handle unauthenticated user
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.from('topics').insert([
      {
        title,
        description,
        user_id: user.id,
      },
    ]).select();

    if (error) {
      console.error('Error adding topic:', error);
    } else if (data) {
      onTopicAdded(data[0]);
      setTitle('');
      setDescription('');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleAddTopic} className="mb-4">
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
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        {loading ? 'Adding...' : 'Add Topic'}
      </button>
    </form>
  );
};

export default TopicForm;
