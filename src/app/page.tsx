'use client'

import { useState, useRef } from 'react'

export default function AudioTranscriber() {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const startRecording = async () => {
    try {
      // Request screen capture
      const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
      
      // Request microphone access
      const userStream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      // Create a new AudioContext
      const audioContext = new AudioContext()

      // Create sources for both streams
      const displaySource = audioContext.createMediaStreamSource(displayStream)
      const userSource = audioContext.createMediaStreamSource(userStream)

      // Create a gain node for each source to control volume
      const displayGain = audioContext.createGain()
      const userGain = audioContext.createGain()

      // Connect sources to gain nodes
      displaySource.connect(displayGain)
      userSource.connect(userGain)

      // Create a destination for the combined audio
      const destination = audioContext.createMediaStreamDestination()

      // Connect both gain nodes to the destination
      displayGain.connect(destination)
      userGain.connect(destination)

      // Create a new MediaRecorder with the combined audio
      mediaRecorderRef.current = new MediaRecorder(destination.stream)
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }
      mediaRecorderRef.current.onstop = handleStop
      mediaRecorderRef.current.start()
      setIsRecording(true)
      setError(null)

      // Stop all tracks when screen sharing stops
      displayStream.getVideoTracks()[0].onended = () => {
        stopRecording()
      }
    } catch (error) {
      console.error('Error starting recording:', error)
      setError('Failed to start recording. Please ensure you have granted necessary permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const handleStop = async () => {
    const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })
    chunksRef.current = []

    const formData = new FormData()
    formData.append('audio', audioBlob, 'recording.webm')

    try {
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setTranscript(data.transcript)
      } else {
        console.error('Transcription failed')
        setError('Transcription failed. Please try again.')
      }
    } catch (error) {
      console.error('Error during transcription:', error)
      setError('Error during transcription. Please check your connection and try again.')
    }
  }

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
        className="w-full h-64 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  )
}