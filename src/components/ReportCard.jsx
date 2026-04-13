import React from 'react';
import { CheckCircle, ArrowLeft, Star, TrendingUp, AlertTriangle, MessageCircle, BarChart2, BookOpen } from 'lucide-react';

export default function ReportCard({ report, onReset, onGeneratePlan }) {
  if (!report) return null;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Ready for Placement': return 'badge-success';
      case 'Needs Improvement': return 'badge-warning';
      case 'High Risk Candidate': return 'badge-danger';
      default: return 'badge-neutral';
    }
  };

  const getScoreClass = (score) => {
    if (score >= 80) return 'score-excellent';
    if (score >= 60) return 'score-good';
    if (score >= 40) return 'score-average';
    return 'score-poor';
  };

  return (
    <div className="glass-panel animate-fade-in delay-2" style={{ maxWidth: '800px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--surface-border)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle color="var(--success)" />
            Recruiter Evaluation Report
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>AI Generated Candidate Analysis</p>
        </div>
        <div className={`badge ${getStatusBadge(report.hiringStatus)}`} style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
          {report.hiringStatus}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap', justifyContent: 'space-around' }}>
        <div style={{ textAlign: 'center' }}>
          <div className={`score-circle ${getScoreClass(report.skillScore)} mx-auto mb-2`} style={{ margin: '0 auto 0.5rem' }}>
            {report.skillScore}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Star size={14}/> Skill Score
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div className={`score-circle ${getScoreClass(report.communicationScore)} mx-auto mb-2`} style={{ margin: '0 auto 0.5rem' }}>
            {report.communicationScore}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MessageCircle size={14}/> Communication
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div className={`score-circle ${getScoreClass(report.problemSolvingScore)} mx-auto mb-2`} style={{ margin: '0 auto 0.5rem' }}>
            {report.problemSolvingScore}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={14}/> Problem Solving
          </div>
        </div>
      </div>

      <div style={{ background: 'rgba(0,0,0,0.15)', padding: '1rem 1.5rem', borderRadius: '8px', marginBottom: '1.5rem', borderLeft: '4px solid var(--accent-primary)' }}>
        <h4 style={{ color: 'white', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BarChart2 size={18} /> Professional Summary
        </h4>
        <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: 1.6 }}>{report.summary}</p>
      </div>

      <div className="form-grid" style={{ marginBottom: '2rem' }}>
        <div>
          <h4 style={{ color: 'var(--success)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={18} /> Top Strengths
          </h4>
          <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
            {report.strengths.map((str, idx) => (
              <li key={idx} style={{ marginBottom: '0.5rem' }}>{str}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 style={{ color: 'var(--danger)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={18} /> Key Weaknesses
          </h4>
          <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
            {report.weaknesses.map((weak, idx) => (
              <li key={idx} style={{ marginBottom: '0.5rem' }}>{weak}</li>
            ))}
          </ul>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button onClick={onReset} className="btn btn-secondary">
          <ArrowLeft size={18} /> Evaluate Another Candidate
        </button>
        <button onClick={() => onGeneratePlan(report.weaknesses.join(', '))} className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #f472b6, #c084fc)' }}>
          <BookOpen size={18} /> Generate Mentor Plan
        </button>
      </div>

    </div>
  );
}
