import React from 'react';
import { BookOpen, PlayCircle, ChevronRight, PenTool, ClipboardList, ArrowLeft } from 'lucide-react';

export default function MentorPlan({ planData, onBack }) {
  if (!planData || planData.length === 0) {
    return (
      <div className="glass-panel text-center">
        <h3 className="text-gradient">No Weak Topics Identified!</h3>
        <p style={{ color: 'var(--text-secondary)' }}>This candidate has an excellent technical profile.</p>
        <button onClick={onBack} className="btn btn-secondary mt-4">
          <ArrowLeft size={18} /> Back to Report
        </button>
      </div>
    );
  }

  return (
    <div className="glass-panel animate-fade-in delay-2" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 className="text-gradient" style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
          <BookOpen size={32} color="#f472b6" />
          Personalized Mentor Plan
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Strategic study guide focusing on identified weak areas</p>
      </div>

      <div style={{ display: 'grid', gap: '2rem' }}>
        {planData.map((plan, index) => (
          <div key={index} style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--surface-border)' }}>
            <h3 style={{ fontSize: '1.4rem', color: '#818cf8', marginBottom: '0.5rem' }}>{index + 1}. {plan.topic}</h3>
            <p style={{ color: 'var(--text-primary)', marginBottom: '1.25rem', fontSize: '0.95rem' }}>{plan.explanation}</p>
            
            <div className="mb-4">
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#c084fc', marginBottom: '0.5rem' }}>
                <ChevronRight size={16} /> Key Concepts
              </h4>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {plan.keyConcepts.map((concept, cIdx) => (
                  <span key={cIdx} className="badge badge-neutral" style={{ textTransform: 'none' }}>{concept}</span>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f472b6', marginBottom: '0.5rem' }}>
                <PenTool size={16} /> Quick Revision Notes
              </h4>
              <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                {plan.notes.map((note, nIdx) => (
                  <li key={nIdx} style={{ marginBottom: '0.25rem' }}>{note}</li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', marginBottom: '0.5rem' }}>
                <ClipboardList size={16} /> Practice Questions
              </h4>
              <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                {plan.practiceQuestions.map((q, qIdx) => (
                  <li key={qIdx} style={{ marginBottom: '0.25rem' }}>{q}</li>
                ))}
              </ul>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <a href={plan.youtubeLink} target="_blank" rel="noopener noreferrer" className="btn" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                <PlayCircle size={16} /> Suggested Video Tutorial
              </a>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
        <button onClick={onBack} className="btn btn-secondary">
          <ArrowLeft size={18} /> Return to Evaluation Card
        </button>
      </div>
    </div>
  );
}
