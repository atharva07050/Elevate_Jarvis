import React, { useState } from 'react';
import EvaluationForm from './components/EvaluationForm';
import ReportCard from './components/ReportCard';
import MentorPlan from './components/MentorPlan';
import { generateEvaluation, generateMentorPlan } from './services/aiService';

function App() {
  const [report, setReport] = useState(null);
  const [mentorPlan, setMentorPlan] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  const handleSubmitForm = async (data) => {
    setIsSubmitting(true);
    try {
      const aiResponse = await generateEvaluation(data);
      setReport(aiResponse);
    } catch (error) {
      console.error("Evaluation failed", error);
      alert("Failed to generate AI evaluation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGeneratePlan = async (weakTopicsString) => {
    setIsGeneratingPlan(true);
    try {
      const planResponse = await generateMentorPlan(weakTopicsString);
      setMentorPlan(planResponse);
    } catch (error) {
      console.error("Mentor plan failed", error);
      alert("Failed to generate Mentor Plan.");
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const resetForm = () => {
    setReport(null);
    setMentorPlan(null);
  };

  return (
    <>
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 className="text-gradient hover:scale-105 transition" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
          AI Tech Recruiter
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Automated Candidate Evaluation System
        </p>
      </header>

      <main>
        {!report ? (
          <EvaluationForm onSubmit={handleSubmitForm} isSubmitting={isSubmitting} />
        ) : mentorPlan ? (
          <MentorPlan planData={mentorPlan} onBack={() => setMentorPlan(null)} />
        ) : (
          <div style={{ position: 'relative' }}>
             {isGeneratingPlan && (
               <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '24px', backdropFilter: 'blur(4px)' }}>
                 <h2 className="text-gradient">Generating Mentor Plan...</h2>
               </div>
             )}
             <ReportCard report={report} onReset={resetForm} onGeneratePlan={handleGeneratePlan} />
          </div>
        )}
      </main>
    </>
  );
}

export default App;
