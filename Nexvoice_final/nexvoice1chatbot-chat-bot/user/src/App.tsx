import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { RaiseIssue } from './pages/RaiseIssue';
import { ExploreIssues } from './pages/ExploreIssues';
import { IssueDetail } from './pages/IssueDetail';
import { About, Contact } from './pages/StaticPages';
import { Terms } from './pages/Terms';
import { Privacy } from './pages/Privacy';
import { AgePolicy } from './pages/AgePolicy';
import { HowItWorks } from './pages/HowItWorks';
import { NexVoiceChatbot } from './components/NexVoiceChatbot';

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#1A1A1A] font-sans antialiased">
        <Navbar />
        <main className="flex-1 animate-fade-in">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/raise-issue" element={<RaiseIssue />} />
            <Route path="/issues" element={<ExploreIssues />} />
            <Route path="/issues/:id" element={<IssueDetail />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/about" element={<About />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/age-policy" element={<AgePolicy />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
        <NexVoiceChatbot />
      </div>
    </BrowserRouter>
  );
}

export default App;
