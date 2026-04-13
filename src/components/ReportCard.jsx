import React from 'react';
import { CheckCircle, ArrowLeft, Star, TrendingUp, AlertTriangle, MessageCircle, BarChart2, BookOpen, Printer, User, Briefcase, Lightbulb, Target } from 'lucide-react';

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
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0f172a', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid #3b82f6' }}>
        <div>
          <h2 className="print-dark" style={{ fontSize: '1.6rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, textTransform: 'uppercase' }}>
            AI Recruiter Evaluation Report
          </h2>
          <p className="print-dark" style={{ color: '#93c5fd', fontSize: '1rem', marginTop: '0.25rem', fontWeight: 600 }}>{report.subtitle}</p>
          <p className="print-dark" style={{ color: 'white', fontSize: '0.85rem', marginTop: '0.5rem', opacity: 0.8 }}>{report.tagline}</p>
        </div>
      </div>

      <div className="candidate-info" style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div className="print-dark" style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
           <User size={18} className="no-print" color="var(--accent-primary)" /> <strong>Name:</strong> {report.name}
        </div>
        <div className="print-dark" style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
           <Briefcase size={18} className="no-print" color="var(--accent-primary)" /> <strong>Role:</strong> {report.role}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap', justifyContent: 'space-around' }}>
        <div style={{ textAlign: 'center', flex: 1, minWidth: '200px' }}>
          <div className={`score-circle ${getScoreClass(report.skillScore)} mx-auto mb-2`} style={{ margin: '0 auto 0.5rem' }}>
            {report.skillScore}
          </div>
          <div style={{ color: 'var(--text-primary)', fontSize: '0.95rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <Star size={16}/> Skill Score
          </div>
          <p className="print-dark" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>{report.scoreInterpretations.skill}</p>
        </div>

        <div style={{ textAlign: 'center', flex: 1, minWidth: '200px' }}>
          <div className={`score-circle ${getScoreClass(report.communicationScore)} mx-auto mb-2`} style={{ margin: '0 auto 0.5rem' }}>
            {report.communicationScore}
          </div>
          <div style={{ color: 'var(--text-primary)', fontSize: '0.95rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <MessageCircle size={16}/> Communication
          </div>
          <p className="print-dark" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>{report.scoreInterpretations.communication}</p>
        </div>

        <div style={{ textAlign: 'center', flex: 1, minWidth: '200px' }}>
          <div className={`score-circle ${getScoreClass(report.problemSolvingScore)} mx-auto mb-2`} style={{ margin: '0 auto 0.5rem' }}>
            {report.problemSolvingScore}
          </div>
          <div style={{ color: 'var(--text-primary)', fontSize: '0.95rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <TrendingUp size={16}/> Problem Solving
          </div>
          <p className="print-dark" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>{report.scoreInterpretations.problemSolving}</p>
        </div>
      </div>

      <div className="print-panel" style={{ background: 'rgba(0,0,0,0.15)', padding: '1rem 1.5rem', borderRadius: '8px', marginBottom: '1.5rem', borderLeft: '4px solid var(--accent-primary)' }}>
        <h4 className="print-dark" style={{ color: 'white', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BarChart2 className="no-print" size={18} /> Candidate Overview
        </h4>
        <p className="print-dark" style={{ color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: 1.6 }}>{report.summary}</p>
      </div>

      <div className="form-grid" style={{ marginBottom: '2rem' }}>
        <div className="print-panel" style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '1.25rem', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          <h4 className="print-dark" style={{ color: 'var(--success)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase' }}>
            <CheckCircle className="no-print" size={18} /> Strengths
          </h4>
          <ul className="print-dark" style={{ paddingLeft: '1.5rem', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
            {report.strengths.map((str, idx) => (
              <li key={idx} style={{ marginBottom: '0.5rem' }}>{str}</li>
            ))}
          </ul>
        </div>
        <div className="print-panel" style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '1.25rem', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          <h4 className="print-dark" style={{ color: 'var(--danger)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase' }}>
            <AlertTriangle className="no-print" size={18} /> Areas For Improvement
          </h4>
          <ul className="print-dark" style={{ paddingLeft: '1.5rem', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
            {report.weaknesses.map((weak, idx) => (
              <li key={idx} style={{ marginBottom: '0.5rem' }}>{weak}</li>
            ))}
          </ul>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h4 className="print-dark" style={{ color: 'var(--accent-primary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem' }}>
          Detailed Analysis
        </h4>
        <div className="print-panel" style={{ background: 'rgba(0,0,0,0.15)', padding: '1.5rem', borderRadius: '8px', display: 'grid', gap: '1rem', borderTop: '4px solid var(--accent-primary)' }}>
           <div><strong className="print-dark" style={{ color: 'white' }}>Technical Performance:</strong> <span className="print-dark" style={{ color: 'var(--text-secondary)' }}>{report.detailedAnalysis.technical}</span></div>
           <div><strong className="print-dark" style={{ color: 'white' }}>Communication Style:</strong> <span className="print-dark" style={{ color: 'var(--text-secondary)' }}>{report.detailedAnalysis.communication}</span></div>
           <div><strong className="print-dark" style={{ color: 'white' }}>Problem-Solving Approach:</strong> <span className="print-dark" style={{ color: 'var(--text-secondary)' }}>{report.detailedAnalysis.problemSolving}</span></div>
        </div>
      </div>

      <div style={{ marginBottom: '2rem', display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) minmax(250px, 1fr)', gap: '1.5rem' }} className="form-grid">
        <div className="print-panel" style={{ borderTop: '4px solid #f472b6', padding: '1rem', background: 'rgba(0,0,0,0.15)', borderRadius: '8px' }}>
          <h4 className="print-dark" style={{ color: '#f472b6', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase', fontSize: '0.85rem' }}>
             Short-Term Recommendations
          </h4>
          <ul className="print-dark" style={{ paddingLeft: '1.5rem', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
            {report.recommendations.shortTerm.map((sug, idx) => (
              <li key={idx} style={{ marginBottom: '0.5rem' }}>{sug}</li>
            ))}
          </ul>
        </div>
        <div className="print-panel" style={{ borderTop: '4px solid #c084fc', padding: '1rem', background: 'rgba(0,0,0,0.15)', borderRadius: '8px' }}>
          <h4 className="print-dark" style={{ color: '#c084fc', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase', fontSize: '0.85rem' }}>
             Long-Term Recommendations
          </h4>
          <ul className="print-dark" style={{ paddingLeft: '1.5rem', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
            {report.recommendations.longTerm.map((sug, idx) => (
              <li key={idx} style={{ marginBottom: '0.5rem' }}>{sug}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="print-panel" style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem 1.5rem', borderRadius: '12px', marginBottom: '2rem', textAlign: 'center', border: `2px solid var(--${report.hiringStatus==='Ready for Placement'?'success':'warning'})` }}>
        <h3 className="print-dark" style={{ color: 'white', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Final Hiring Decision</h3>
        <span className={`badge ${getStatusBadge(report.hiringStatus)} print-badge`} style={{ fontSize: '1.25rem', padding: '0.75rem 1.5rem', marginBottom: '1.5rem', display: 'inline-block' }}>{report.hiringStatus}</span>
        <p className="print-dark" style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', fontStyle: 'italic', maxWidth: '600px', margin: '0 auto' }}>"{report.hiringDecisionJustification}"</p>
      </div>

      <div className="no-print" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button onClick={onReset} className="btn btn-secondary">
          <ArrowLeft size={18} /> Evaluate Another Candidate
        </button>
        <button onClick={() => window.print()} className="btn btn-secondary">
          <Printer size={18} /> Export PDF Report
        </button>
        <button onClick={() => onGeneratePlan(report.weaknesses.join(', '))} className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #f472b6, #c084fc)' }}>
          <BookOpen size={18} /> Generate Mentor Plan
        </button>
      </div>

    </div>
  );
}
