import React, { useState } from 'react';
import { User, Activity, MessageSquare, Clock, BookOpen, AlertCircle, Bot } from 'lucide-react';

export default function EvaluationForm({ onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    aptitude_score: '',
    technical_score: '',
    interview_score: '',
    communication_feedback: '',
    time_taken: '',
    strong_topics: '',
    weak_topics: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="glass-panel animate-fade-in delay-1">
      <div className="mb-8 text-center">
        <h2 className="text-gradient" style={{ fontSize: '1.75rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <Bot size={28} color="#3b82f6" />
          Candidate Evaluator
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>Enter the student data below to generate an AI evaluation</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Column 1 */}
          <div>
            <div className="form-group">
              <label><User size={16} /> Candidate Name</label>
              <input
                type="text"
                name="name"
                required
                className="form-control"
                placeholder="e.g. Jane Doe"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label><Activity size={16} /> Aptitude Score (0-100)</label>
              <input
                type="number"
                name="aptitude_score"
                min="0"
                max="100"
                required
                className="form-control"
                placeholder="e.g. 85"
                value={formData.aptitude_score}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label><User size={16} /> Technical Score (0-100)</label>
              <input
                type="number"
                name="technical_score"
                min="0"
                max="100"
                required
                className="form-control"
                placeholder="e.g. 92"
                value={formData.technical_score}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label><MessageSquare size={16} /> Interview Score (0-100)</label>
              <input
                type="number"
                name="interview_score"
                min="0"
                max="100"
                required
                className="form-control"
                placeholder="e.g. 88"
                value={formData.interview_score}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label><Clock size={16} /> Time Taken (mins)</label>
              <input
                type="text"
                name="time_taken"
                required
                className="form-control"
                placeholder="e.g. 45"
                value={formData.time_taken}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Column 2 */}
          <div>
            <div className="form-group">
              <label><BookOpen size={16} /> Target Role</label>
              <input
                type="text"
                name="role"
                required
                className="form-control"
                placeholder="e.g. Frontend Engineer"
                value={formData.role}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label><BookOpen size={16} /> Strong Topics</label>
              <input
                type="text"
                name="strong_topics"
                required
                className="form-control"
                placeholder="e.g. React, Data Structures, Git"
                value={formData.strong_topics}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label><AlertCircle size={16} /> Weak Topics</label>
              <input
                type="text"
                name="weak_topics"
                required
                className="form-control"
                placeholder="e.g. System Design, AWS"
                value={formData.weak_topics}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label><MessageSquare size={16} /> Communication Feedback</label>
              <textarea
                name="communication_feedback"
                required
                className="form-control"
                placeholder="Describe the candidate's communication style..."
                value={formData.communication_feedback}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ width: '100%', maxWidth: '300px' }}>
            {isSubmitting ? 'Analyzing Data...' : 'Generate AI Report'}
          </button>
        </div>
      </form>
    </div>
  );
}
