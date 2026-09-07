import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { RaiseIssue } from './pages/RaiseIssue';
import { ExploreIssues } from './pages/ExploreIssues';
import { IssueDetail } from './pages/IssueDetail';
import { HowItWorks, About, Privacy, Terms, Contact } from './pages/StaticPages';

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#1E293B] font-sans antialiased selection:bg-[#4F46E5]/20 selection:text-[#4F46E5]">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/raise-issue" element={<RaiseIssue />} />
            <Route path="/issues" element={<ExploreIssues />} />
            <Route path="/issues/:id" element={<IssueDetail />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
