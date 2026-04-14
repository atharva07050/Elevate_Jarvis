# 🎓 Saarthi: The AI-Powered Placement Preparation Hub

Saarthi is a next-generation Career Readiness platform designed to bridge the gap between academic learning and industry expectations. Powered by multi-tier AI models (Gemini, Groq, Sarvam), Saarthi provides a personalized, interactive, and high-performance environment for students to master the recruitment process.

---

## Video Link

https://drive.google.com/file/d/1CPjq7TqTQ8NCL30FqkLVkX2xZdFPySeE/view?usp=drivesdk

## 🚀 Key Features

### 1. 🎙️ AI Video Mock Interview (with Emotion Tracking)
Face-to-face practice with professional AI avatars.
- **Emotion Analysis**: Uses **Gemini Vision** to track facial expressions (stress, confidence, anxiety) in real-time.
- **Choose Your Interviewer**: Select between male/female AI characters with specific voice profiles.
- **Personalized Context**: Tell Saarthi your target company and role for a tailored set of questions.
- **Complete Report**: Get a 0-100 score on communication, confidence, and content, and download a detailed PDF analysis.

### 2. 📄 Resume AI Analyzer
- Upload or paste your resume to get instant feedback.
- Compare against a specific Job Description (JD).
- Detect missing keywords and get specific "Action-Result" wording suggestions.

### 3. 🗓️ 7-Day Precision Plan
- Enter your weaknesses or target company, and Saarthi generates a day-by-day crash course to get you interview-ready in a week.

### 4. 🧠 Pressure Test & STAR Builder
- Practice high-stakes questions in a timed environment.
- Use the **STAR Builder** to frame your experiences perfectly using the Situation-Task-Action-Result methodology.

### 5. 🤖 PlacementBot
- An always-on AI assistant to answer your career, placement, and professional development queries 24/7.

---

## 🎨 Design Aesthetics
- **Premium Deep Blue Theme**: A sleek, modern UI built on a palette of Deep Space Navy and Vibrant Indigo.
- **Glassmorphic UI**: High-gloss cards and blurred backdrops for a professional feel.
- **Micro-Animations**: Fluid transitions and hover effects for an engaging user experience.

---

## 🛠️ Technology Stack
- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Framer Motion, Lucide Icons
- **AI Backend**:
  - **Gemini 1.5 Flash** (Primary Vision & Chat)
  - **Groq LLaMA 3** (High-speed Fallback)
  - **Sarvam AI** (Secondary Fallback)
- **Utilities**: `face-api`, `jspdf`, `recharts`

---

## ⚙️ Setup & Installation

**Prerequisites:** Node.js (v18+)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/atharva07050/Elevate_Jarvis.git
   cd Elevate_Jarvis
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add your API keys:
   ```env
   VITE_GEMINI_API_KEY=your_key_here
   VITE_GROQ_API_KEY=your_key_here
   VITE_SARVAM_API_KEY=your_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

---

## 🛡️ Security Note
All API keys are handled via environment variables. Ensure `.env` is never committed to version control. Reference `.env.example` for the required structure.

---

<div align="center">
  <b>Built for Jarvis Hackathon 2026</b>
</div>
