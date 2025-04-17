import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie"; 
import { MessageCircle, User } from "lucide-react";
const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const messagesEndRef = useRef(null);
const [profilePhoto, setProfilePhoto] = useState("");
  useEffect(() => {
    setProfilePhoto(Cookies.get("profilePhoto"));
    if (showModal) {
      setMessages([
        { text: "Hi there! What can I assist you with today?", sender: "bot" },
        { text: "You can ask questions like:", sender: "bot" },
        { text: "Most recent event?", sender: "bot" },
        { text: "List events which are free?", sender: "bot" },
      ]);

      setSelectedEvent(null);

      const fetchEvents = async () => {
        try {
          const response = await axios.get("http://localhost:5000/getEvents");
          setEvents(response.data);
        } catch (error) {
          setMessages([{ text: "Error fetching events. Please try again later.", sender: "bot" }]);
        }
      };
      fetchEvents();
    }
  }, [showModal]);

  const sendMessage = async (message) => {
    if (!message.trim()) return;

    const userMessage = { text: message, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setInput("");

    try {
      const response = await axios.post("http://localhost:5000/chatbot", {
        message: message,
        event: selectedEvent, 
      });

      const botMessage = { text: response.data.response, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { text: "Error fetching response.", sender: "bot" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleEventSelection = (event) => {
    setSelectedEvent(event);
    const newMessage = { 
      text: `You've selected ${event.event_title}. What would you like to know about it?`, 
      sender: "bot" 
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handlePredefinedQuestion = async (question) => {
    const userMessage = { text: question, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/chatbot", {
        message: question,
        event: selectedEvent, 
      });

      const botMessage = { text: response.data.response, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { text: "Error fetching response.", sender: "bot" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleExitEvent = () => {
    setSelectedEvent(null); // Reset selected event
    setMessages((prev) => [
      ...prev,
      { text: "You have exited the event. How can I assist you?", sender: "bot" },
    ]);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("chatbot-modal-overlay")) {
      setShowModal(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && input.trim()) {
      sendMessage(input);
    }
  };

  return (
    <>
      <button className="query-btn" onClick={() => setShowModal(true)}>
  <MessageCircle size={20} />
  <span>Query</span>
</button>

      {showModal && (
        <div className="chatbot-modal-overlay" onClick={handleOverlayClick}>
          <div className="chatbot-modal">
            <div className="chatbot-header">
              <h3>Chatbot</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>

            <div className="chatbot-messages">
  {messages.map((msg, index) => (
    <div key={index} className={`message ${msg.sender}`}>
      <div className="message-icon">
        {msg.sender === "bot" ? (
          <MessageCircle size={20} /> 
        ) : profilePhoto ? (
          <img src={profilePhoto} alt="User" className="user-profile-pic" />
        ) : (
          <User size={20} /> 
        )}
      </div>
      <div className="message-text">
        {msg.text.split("\n").map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
    </div>
  ))}
  {loading && (
    <div className="message bot">
      <div className="message-icon">
        <MessageCircle size={20} />
      </div>
      <div className="message-text">Typing...</div>
    </div>
  )}
  <div ref={messagesEndRef}></div>
</div>

            {selectedEvent && (
              <div className="exit-event-btn-container">
                <button
                  className="exit-event-btn"
                  onClick={handleExitEvent}
                >
                  Exit Event
                </button>
              </div>
            )}

            {!selectedEvent && (
              <div className="predefined-questions">
                <button onClick={() => handlePredefinedQuestion("Most recent event?")}>
                  Most recent event?
                </button>
                <button onClick={() => handlePredefinedQuestion("List all events which are free?")}>
                  Which events are free?
                </button>
              </div>
            )}

            {events.length > 0 && !selectedEvent && messages[messages.length - 1]?.sender === "bot" && (
              <div className="event-buttons">
                {events.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => handleEventSelection(event)}
                    className="event-btn"
                  >
                    {event.event_title}
                  </button>
                ))}
              </div>
            )}

            <div className="chatbot-input">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about the event..."
              />
              <button onClick={() => input.trim() && sendMessage(input)} disabled={loading}>
                {loading ? "..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
