// src/Chatbot.js
import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css'; // Sẽ tạo file này sau

function Chatbot() {
  const [messages, setMessages] = useState([]); // Lưu trữ các tin nhắn (người dùng và AI)
  const [inputMessage, setInputMessage] = useState(''); // Tin nhắn người dùng đang nhập
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const messagesEndRef = useRef(null); // Để cuộn xuống cuối cuộc trò chuyện

  // Cuộn xuống cuối tin nhắn mỗi khi messages thay đổi
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputMessage.trim() === '') return;

    const newUserMessage = { text: inputMessage, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      // Gửi tin nhắn đến backend PHP
      const response = await fetch('http://localhost/gmail-project/back-end/chatbot_api.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputMessage }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      let aiReply;
      if (data.error) {
        aiReply = { text: `Lỗi: ${data.error}`, sender: 'ai-error' };
        console.error('Backend Error:', data.error);
      } else {
        aiReply = { text: data.reply, sender: 'ai' };
      }

      setMessages((prevMessages) => [...prevMessages, aiReply]);

    } catch (error) {
      console.error('Lỗi khi gửi tin nhắn:', error);
      setMessages((prevMessages) => [...prevMessages, { text: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.', sender: 'ai-error' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chat-header">
        <h2>Chatbot AI (Gemini)</h2>
      </div>
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="welcome-message">
            Chào mừng bạn! Hãy hỏi tôi bất cứ điều gì.
          </div>
        )}
        {messages.map((msg, index) => (
          <div key={index} className={`message-bubble ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="message-bubble ai-loading">
            <span>...</span>
          </div>
        )}
        <div ref={messagesEndRef} /> {/* Dùng để cuộn */}
      </div>
      <form onSubmit={handleSendMessage} className="chat-input-form">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Nhập tin nhắn của bạn..."
          disabled={loading}
        />
        <button type="submit" disabled={loading}>Gửi</button>
      </form>
    </div>
  );
}

export default Chatbot;