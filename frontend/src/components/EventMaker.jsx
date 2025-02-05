import React, { useState, useEffect } from "react";
import './EventMaker.css';
import { useNavigate } from "react-router-dom"; 

const EventMaker = () => {
  const [formData, setFormData] = useState({
    event_title: "",
    event_category: "",
    event_description: "",
    event_date: "",
    event_time: "",
    event_venue: "",
    expected_participants: "",
    organizer_name: "",
    organizer_email: "",
    organizer_phone: "",
    sponsorship_info: "",
    event_website: "",
    additional_notes: "",
    organization_name: "",
    target_audience: "", // New field for target audience
  });

  const [imageFile, setImageFile] = useState(null);
  const [events, setEvents] = useState([]);
  const [step, setStep] = useState(1); // Track current step

  const navigate = useNavigate(); 

  useEffect(() => {
    // Fetch event manager ID and experience from cookies
    const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
      const [name, value] = cookie.split("=");
      acc[name] = value;
      return acc;
    }, {});

    setFormData((prevFormData) => ({
      ...prevFormData,
      event_manager_id: cookies.eventManagerId || "",
      experience: cookies.experience || "",
    }));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file); // Store the selected file if it's an image
    } else {
      alert("Please upload a valid image file.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const formDataToSend = new FormData();
      
      // Append form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value) formDataToSend.append(key, value);
      });
  
      // Append image file if present
      if (imageFile) {
        formDataToSend.append("event_image", imageFile);
      }
  
      // Send POST request
      const response = await fetch("http://localhost:5000/createEvent", {
        method: "POST",
        credentials: "include", // Ensures cookies are sent
        body: formDataToSend,
      });
  
      console.log("Response:", response);
  
      // Handle errors
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create event");
      }
  
      const newEvent = await response.json();
      console.log("Event created successfully:", newEvent);
  
      // Update event list
      setEvents((prevEvents) => [...prevEvents, newEvent.event]);
  
      // Reset form
      setFormData({
        event_title: "",
        event_category: "",
        event_description: "",
        event_date: "",
        event_time: "",
        event_venue: "",
        expected_participants: "",
        organizer_name: "",
        organizer_email: "",
        organizer_phone: "",
        sponsorship_info: "",
        event_website: "",
        additional_notes: "",
        organization_name: "",
        target_audience: "", // Reset target audience
      });
  
      setImageFile(null); // Reset image state
      setStep(5); // Move to success step
  
    } catch (error) {
      console.error("Error creating event:", error.message);
    }
  };

  return (
    <div className="EventDiv">
      <div className="dashboard-button">
        <button onClick={() => navigate("/event/dashboard")}>
          Go to Dashboard
        </button>
      </div>
      <h2>Create New Event</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {step === 1 && (
          <div className="step1 EventDiv">
            <h3>Step 1: Event Basic Information</h3>
            <input
              type="text"
              name="event_title"
              placeholder="Event Title"
              value={formData.event_title}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="event_category"
              placeholder="Event Category"
              value={formData.event_category}
              onChange={handleChange}
              required
            />
            <textarea
              name="event_description"
              placeholder="Event Description"
              value={formData.event_description}
              onChange={handleChange}
              required
            />
            
            {/* Target Audience Field (Select dropdown for Student/Faculty/Both) */}
            <div className="target-audience">
              <h4>Target Audience:</h4>
              <select 
                name="target_audience" 
                value={formData.target_audience} 
                onChange={handleChange} 
                required
              >
                <option value="Student">Student</option>
                <option value="Faculty">Faculty</option>
                <option value="both">Both</option>
              </select>
            </div>

            <button type="button" onClick={() => setStep(2)}>
              Next Step
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="step2 EventDiv">
            <h3>Step 2: Event Details</h3>
            <input
              type="date"
              name="event_date"
              value={formData.event_date}
              onChange={handleChange}
              required
            />
            <input
              type="time"
              name="event_time"
              value={formData.event_time}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="event_venue"
              placeholder="Event Venue"
              value={formData.event_venue}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="expected_participants"
              placeholder="Expected Participants"
              value={formData.expected_participants}
              onChange={handleChange}
              required
            />
            <button type="button" onClick={() => setStep(3)}>
              Next Step
            </button>
            <button type="button" onClick={() => setStep(1)}>
              Previous Step
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="step3 EventDiv">
            <h3>Step 3: Organizer & Additional Info</h3>
            <input
              type="text"
              name="organizer_name"
              placeholder="Organizer Name"
              value={formData.organizer_name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="organizer_email"
              placeholder="Organizer Email"
              value={formData.organizer_email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="organizer_phone"
              placeholder="Organizer Phone"
              value={formData.organizer_phone}
              onChange={handleChange}
              required
            />
            <textarea
              name="sponsorship_info"
              placeholder="Sponsorship Info"
              value={formData.sponsorship_info}
              onChange={handleChange}
            />
            <input
              type="url"
              name="event_website"
              placeholder="Event Website"
              value={formData.event_website}
              onChange={handleChange}
            />
            <textarea
              name="additional_notes"
              placeholder="Additional Notes"
              value={formData.additional_notes}
              onChange={handleChange}
            />
            <input
              type="text"
              name="organization_name"
              placeholder="Organization Name"
              value={formData.organization_name}
              onChange={handleChange}
              required
            />

            {/* Image Upload */}
            <label>Upload Event Image:</label>
            <input
              type="file"
              name="event_image"
              accept="image/*"
              onChange={handleFileChange}
              required
            />

            <button type="button" onClick={() => setStep(4)}>
              Next Step
            </button>
            <button type="button" onClick={() => setStep(2)}>
              Previous Step
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="step4 EventDiv">
            <h3>Step 4: Review & Submit</h3>
            <div className="EventDiv">
              <h4>Event Title:</h4>
              <p>{formData.event_title}</p>
              <h4>Event Category:</h4>
              <p>{formData.event_category}</p>
              <h4>Target Audience:</h4>
              <p>{formData.target_audience}</p>
              {/* Add other fields here for review */}
            </div>
            <button type="submit">Create Event</button>
            <button type="button" onClick={() => setStep(3)}>
              Previous Step
            </button>
          </div>
        )}

        {step === 5 && (
          <div className="step5 EventDiv">
            <h3>Success! Event Created</h3>
            <p>Your event has been successfully created.</p>
            <button type="button" onClick={() => setStep(1)}>
              Create Another Event
            </button>
            <button type="button" onClick={() => window.location.href = "/event/dashboard"}>
              Go to Dashboard
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default EventMaker;
