'use client'

import { useState, useEffect } from 'react'
import { useChat } from 'ai/react'

export default function ChatComponent() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat()
  const [additionalData, setAdditionalData] = useState<any[]>([])

  useEffect(() => {
    const eventSource = new EventSource('/api/chat')

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.test || data.finalMessage) {
        setAdditionalData((prevData) => [...prevData, data])
      }
    }

    return () => {
      eventSource.close()
    }
  }, [])

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AI Chat with StreamData</h1>
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs p-3 rounded-lg ${
                m.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
              }`}
            >
              <p className="text-sm">{m.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-xs p-3 rounded-lg bg-gray-100">
              <p className="text-sm">AI is typing...</p>
            </div>
          </div>
        )}
      </div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Additional Data:</h2>
        <pre className="bg-gray-100 p-2 rounded-lg text-sm overflow-x-auto">
          {JSON.stringify(additionalData, null, 2)}
        </pre>
      </div>
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          className="flex-1 p-2 border border-gray-300 rounded"
          value={input}
          onChange={handleInputChange}
          placeholder="Say something..."
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          disabled={isLoading}
        >
          Send
        </button>
      </form>
    </div>
  )
}