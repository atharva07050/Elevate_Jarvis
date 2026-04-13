// Simulated AI Service to provide a recruiter evaluation

const MOCK_DELAY = 1500;

export const generateEvaluation = async (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Calculate basic scores
      const aptitude = Number(data.aptitude_score) || 0;
      const technical = Number(data.technical_score) || 0;
      const interview = Number(data.interview_score) || 0;

      // Skill Score Calculation (Aptitude + Technical + Interview weighted)
      const skillScore = Math.round((aptitude * 0.3) + (technical * 0.5) + (interview * 0.2));
      
      // Rough problem solving based on tech + aptitude
      const problemSolvingScore = Math.round((aptitude + technical) / 2);
      
      // Communication score heuristic
      let commScore = interview;
      if (data.communication_feedback.toLowerCase().includes('good') || data.communication_feedback.toLowerCase().includes('clear')) {
          commScore = Math.min(100, commScore + 10);
      } else if (data.communication_feedback.toLowerCase().includes('poor') || data.communication_feedback.toLowerCase().includes('fast')) {
          commScore = Math.max(0, commScore - 10);
      }

      // Determine hiring status
      let status = "Ready for Placement";
      if (skillScore < 60 || problemSolvingScore < 60) {
          status = "High Risk Candidate";
      } else if (skillScore < 75) {
          status = "Needs Improvement";
      }

      // Format strengths & weaknesses nicely
      const strengths = data.strong_topics.split(',').map(s => s.trim()).filter(Boolean);
      const weaknesses = data.weak_topics.split(',').map(s => s.trim()).filter(Boolean);

      // Construct dynamic summary
      let summary = `The candidate has achieved an overall technical and aptitude skill score of ${skillScore}/100. `;
      if (status === "Ready for Placement") {
          summary += "They demonstrate a strong command of foundational concepts and are extremely capable problem solvers. They communicate effectively and show great promise for immediate deployment in mid-to-senior technical roles.";
      } else if (status === "Needs Improvement") {
          summary += "While they have demonstrated some capability, there are specific areas regarding technical execution and concept mastery that need further refinement before they are fully placement-ready.";
      } else {
          summary += "The candidate struggles with core technical concepts. Considerable remedial effort is necessary before they can be considered for placement opportunities.";
      }

      resolve({
          skillScore,
          communicationScore: commScore,
          problemSolvingScore: problemSolvingScore,
          summary,
          strengths: strengths.length ? strengths : ["General Technical Fundamentals"],
          weaknesses: weaknesses.length ? weaknesses : ["Advanced System Architecture"],
          hiringStatus: status
      });
    }, MOCK_DELAY);
  });
};

export const generateMentorPlan = async (weakTopicsString) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Split weak topics from comma-separated string
      const topics = weakTopicsString ? weakTopicsString.split(',').map(s => s.trim()).filter(Boolean) : [];
      
      const plans = topics.map((topic) => {
        return {
          topic: topic,
          explanation: `A highly critical area in most modern software engineering technical interviews. Getting comfortable with ${topic} is paramount for placement success.`,
          keyConcepts: ["Data Structures & Operations", "Algorithmic Efficiency", "Real-world System Applications"],
          youtubeLink: `https://www.youtube.com/results?search_query=${encodeURIComponent(topic + ' interview prep tutorial')}`,
          notes: [
            "Review the foundational theory carefully.",
            "Write code on paper or a whiteboard without relying on an IDE.",
            "Analyze time and space complexity automatically for every approach."
          ],
          practiceQuestions: [
            `Implement the most standard algorithm related to ${topic}.`,
            `Solve an easy-level leetcode problem concerning ${topic}.`,
            `Explain the worst-case scenario failures for ${topic}.`
          ]
        };
      });

      resolve(plans);
    }, MOCK_DELAY);
  });
};
