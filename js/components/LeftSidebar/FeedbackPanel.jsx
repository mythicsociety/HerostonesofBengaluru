import React, { useState } from 'react';

function FeedbackPanel() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the feedback data to your backend
    console.log('Feedback submitted:', { name, email, message });
    
    // For now, just show a success message
    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
      setSubmitted(false);
    }, 3000);
  };
  
  return (
    <div style={{padding: '0.5em 0.5em 0.5em 0'}}>
      <p>We welcome your feedback to improve this heritage mapping application.</p>
      
      {submitted ? (
        <div className="alert alert-success" role="alert">
          Thank you for your feedback! We'll review it shortly.
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom: '15px'}}>
            <label htmlFor="feedback-name" style={{display: 'block', marginBottom: '5px', color: '#72383d', fontWeight: 500}}>Name</label>
            <input 
              type="text" 
              id="feedback-name" 
              className="form-control" 
              placeholder="Your name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div style={{marginBottom: '15px'}}>
            <label htmlFor="feedback-email" style={{display: 'block', marginBottom: '5px', color: '#72383d', fontWeight: 500}}>Email</label>
            <input 
              type="email" 
              id="feedback-email" 
              className="form-control" 
              placeholder="Your email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div style={{marginBottom: '15px'}}>
            <label htmlFor="feedback-message" style={{display: 'block', marginBottom: '5px', color: '#72383d', fontWeight: 500}}>Feedback</label>
            <textarea 
              id="feedback-message" 
              className="form-control" 
              rows="4" 
              placeholder="Share your thoughts or report an issue"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
          </div>
          
          <div style={{marginBottom: '15px'}}>
            <label htmlFor="feedback-type" style={{display: 'block', marginBottom: '5px', color: '#72383d', fontWeight: 500}}>Feedback Type</label>
            <select id="feedback-type" className="form-control">
              <option value="general">General Feedback</option>
              <option value="bug">Bug Report</option>
              <option value="feature">Feature Request</option>
              <option value="content">Content Correction</option>
            </select>
          </div>
          
          <button type="submit" className="btn btn-primary" style={{background: '#72383d', border: 'none'}}>Submit Feedback</button>
        </form>
      )}
    </div>
  );
}

export default FeedbackPanel;
