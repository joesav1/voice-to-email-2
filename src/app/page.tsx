// src/app/page.tsx

'use client';

import { useState, useRef, useEffect } from 'react';
import TopicForm from '../app/components/TopicForm';
import TopicList from '../app/components/TopicList';
import { supabase } from '../app/lib/supabaseClient';
import { Topic } from '../app/types/Topic';

export default function AudioTranscriber() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loadingTopics, setLoadingTopics] = useState<boolean>(true);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    setLoadingTopics(true);

    // If you have authentication implemented
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.log('User not authenticated');
      setLoadingTopics(false);
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
    setLoadingTopics(false);
  };

  const handleTopicAdded = (topic: Topic) => {
    setTopics((prev) => [topic, ...prev]);
  };

  const handleTopicUpdated = (updatedTopic: Topic) => {
    setTopics((prev) =>
      prev.map((topic) => (topic.id === updatedTopic.id ? updatedTopic : topic))
    );
  };

  const handleTopicDeleted = (deletedTopicId: string) => {
    setTopics((prev) => prev.filter((topic) => topic.id !== deletedTopicId));
  };

  // Your existing recording functions remain unchanged
  const startRecording = async () => {
    // ... existing code ...
  };

  const stopRecording = () => {
    // ... existing code ...
  };

  const handleStop = async () => {
    // ... existing code ...
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Audio Transcriber</h1>
      <div className="mb-4">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`px-4 py-2 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isRecording
              ? 'bg-red-500 hover:bg-red-600 focus:ring-red-500'
              : 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500'
          }`}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
      </div>
      {error && (
        <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      <textarea
        value={transcript}
        readOnly
        placeholder="Transcript will appear here..."
        className="w-full h-64 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-8"
      />

      {/* Topic Manager Section */}
      <h2 className="text-xl font-bold mb-4">Manage Topics</h2>
      <TopicForm onTopicAdded={handleTopicAdded} />
      {loadingTopics ? (
        <p>Loading topics...</p>
      ) : (
        <TopicList
          topics={topics}
          onTopicUpdated={handleTopicUpdated}
          onTopicDeleted={handleTopicDeleted}
        />
      )}
    </div>
  );
}
