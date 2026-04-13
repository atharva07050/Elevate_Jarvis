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

      // Extract improvements
      const improvements = weaknesses.length 
        ? weaknesses.map(w => `Focus heavily on mastering ${w} concepts and edge cases.`)
        : ["Continue exploring advanced system scaling paradigms"];

      resolve({
          name: data.name || "Candidate",
          role: data.role || "Software Engineer",
          subtitle: "Placement Readiness Assessment",
          tagline: "This report provides an AI-driven evaluation of the candidate's placement readiness.",
          
          skillScore,
          communicationScore: commScore,
          problemSolvingScore: problemSolvingScore,
          
          scoreInterpretations: {
            skill: skillScore >= 80 ? "Exceptional grasp of core competencies." : skillScore >= 60 ? "Solid foundation, requires minor polish." : "Needs substantial technical foundation work.",
            communication: commScore >= 80 ? "Articulate and structured." : commScore >= 60 ? "Clear, but lacks advanced presentation skills." : "Often unclear or disjointed.",
            problemSolving: problemSolvingScore >= 80 ? "Rapid and highly optimized logic." : problemSolvingScore >= 60 ? "Capable, but relies on brute force." : "Struggles with algorithmic logic."
          },

          summary,
          strengths: strengths.length ? strengths : ["Algorithm Execution", "System Logic"],
          weaknesses: weaknesses.length ? weaknesses : ["Architectural Design", "Advanced Tooling"],
          improvementSuggestions: improvements,
          
          detailedAnalysis: {
            technical: `The candidate performed with a technical score of ${data.technical_score||0}, showing proficiency in expected syntaxes but demonstrating gaps in deep conceptual abstraction.`,
            communication: `Feedback indicates the candidate is '${data.communication_feedback || "communicative"}'. They should focus on structuring extended technical explanations more securely.`,
            problemSolving: `Achieved an aptitude evaluation of ${data.aptitude_score||0}, which points to an adequate baseline for analytical challenges, though optimizations could be faster.`
          },

          recommendations: {
            shortTerm: ["Complete 3 mock interviews prioritizing structured communication.", "Review the fundamental theory for identified weak topics.", "Attempt 5 easy-level architectural design problems."],
            longTerm: ["Build a full-stack side project implementing CI/CD pipelines.", "Contribute to an open source project to understand large codebases.", "Consistently practice medium-level algorithmic questions."]
          },

          hiringStatus: status,
          hiringDecisionJustification: status === "Ready for Placement" ? "Strong aggregate performance across all vital engineering requirements." : "Significant technical and conceptual gaps prevent operational deployment at this level."
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
