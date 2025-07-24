
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

const About = () => {
  useEffect(() => {
    AOS.init({ once: true });
  }, []);

  return (
  <div className="min-h-screen w-full bg-gradient-to-br from-cyan-900 to-indigo-950 bg-fixed">
    <div className="max-w-6xl mx-auto px-6 py-16 space-y-16">
      {/* Gradient Header */}
      <div className="rounded-2xl shadow-2xl bg-gradient-to-r from-cyan-900 to-indigo-950 text-white py-16 px-8 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-xl tracking-tight">About Us</h1>
        <p className="text-2xl md:text-3xl font-semibold mb-4">From Stardust to Solutions</p>
        <p className="italic text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
          We are a tiny spark of life in an endless universe——a once‑only shot to build something that outlives us.
          This platform exists so anyone, anywhere, with any skill can turn passion into verified, real‑world impact—at zero cost.
        </p>
      </div>
      <div className="h-2 w-full bg-gradient-to-r from-blue-400 via-green-400 to-purple-400 rounded-full" />
      {/* Why We Exist */}
      <div className="flex flex-col items-center justify-center py-8 px-0 w-full">

        {/* Main Why We Exist Heading & Introduction */}
        <Card className="w-full bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-100 border border-blue-200 shadow-2xl rounded-3xl mb-8 py-4 px-0 md:py-8" data-aos="zoom-in" data-aos-duration="500">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-blue-900 text-center">
              Why We Exist
            </CardTitle>
          </CardHeader>
          <CardContent className="text-lg text-blue-900 text-center">
            We built this platform because each one of us has experienced the frustration of disconnection, missed opportunities, and wasted potential. Our mission is clear: empower everyone—students, professionals, startups, NGOs, companies, and investors—to collaborate meaningfully, grow continuously, and create lasting positive impact.
          </CardContent>
        </Card>

        {/* Individual Stakeholder Cards */}
        <div className="flex flex-col gap-6 w-full">
          {/* Students */}
          <Card className="w-full bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 border border-blue-200 shadow-md rounded-3xl" data-aos="fade-up" data-aos-delay="100" data-aos-duration="500">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-blue-900">Students</CardTitle>
            </CardHeader>
            <CardContent className="text-blue-800 text-base">
            Theory alone won’t help you navigate real life. Grades can’t fully capture your potential. We understand it’s hard figuring out your path—so we offer clear guidance, mentorship, and meaningful projects. Here, you don’t just study; you build genuine skills and awareness to prepare for the real world.
            </CardContent>
          </Card>
          {/* Graduates & Professionals */}
          <Card className="w-full bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 border border-blue-200 shadow-md rounded-3xl" data-aos="fade-right" data-aos-delay="200" data-aos-duration="500">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-blue-900">Graduates & Professionals</CardTitle>
            </CardHeader>
            <CardContent className="text-blue-800 text-base">
            Passion often takes a back seat due to pressures from society—bills, limited opportunities, or simply lacking the right skills. We’ve been there, we hear you. That’s why we built this platform: a place where your talent, passion, and skill-building can merge to help you grow professionally and personally.
            </CardContent>
          </Card>
          {/* Startups & Founders */}
          <Card className="w-full bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 border border-blue-200 shadow-md rounded-3xl" data-aos="fade-left" data-aos-delay="300" data-aos-duration="500">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-blue-900">Startups & Founders</CardTitle>
            </CardHeader>
            <CardContent className="text-blue-800 text-base">
            We know the frustration when brilliant ideas never see daylight—whether due to lack of skilled people, funding gaps, or the struggle to find aligned co-founders. We want your ideas to thrive. Here, you’ll find the skills, teams, support, and funding visibility you need—built by founders, for founders.
            </CardContent>
          </Card>
          {/* NGOs & Social Impact Teams */}
          <Card className="w-full bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 border border-blue-200 shadow-md rounded-3xl" data-aos="flip-left" data-aos-delay="400" data-aos-duration="500">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-blue-900">NGOs & Social Impact Teams</CardTitle>
            </CardHeader>
            <CardContent className="text-blue-800 text-base">
            Your impact is often limited by resources, tech, and outreach. We believe your problems are perfect opportunities for future innovators. Give us your real-world challenges, and we’ll match them with people eager to learn, create, and make meaningful change.
            </CardContent>
          </Card>
          {/* Companies & CSR Teams */}
          <Card className="w-full bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 border border-blue-200 shadow-md rounded-3xl" data-aos="flip-right" data-aos-delay="500" data-aos-duration="500">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-blue-900">Companies & CSR Teams</CardTitle>
            </CardHeader>
            <CardContent className="text-blue-800 text-base">
            Talent today often stays hidden behind automated screening and ineffective recruiting tools. Genuine impact from CSR funds can feel vague. We’ve created a transparent space where you can directly see talent in action and channel your CSR funding into innovative projects that actually make a difference.
            </CardContent>
          </Card>
          {/* Investors & Philanthropists */}
          <Card className="w-full bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 border border-blue-200 shadow-md rounded-3xl" data-aos="zoom-in-up" data-aos-delay="600" data-aos-duration="500">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-blue-900">Investors & Philanthropists</CardTitle>
            </CardHeader>
            <CardContent className="text-blue-800 text-base">
            We know how confusing and noisy the investment space can be. There’s too much scattered information and not enough clarity. Here, you’ll find all project and startup updates, progress, and impact metrics clearly and transparently in one place—so you can invest confidently, without guesswork.
            </CardContent>
          </Card>
          {/* Cross-Collaboration */}
          <Card className="w-full bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 border border-blue-200 shadow-md rounded-3xl" data-aos="zoom-in-down" data-aos-delay="700" data-aos-duration="500">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-blue-900">Cross-Collaboration</CardTitle>
            </CardHeader>
            <CardContent className="text-blue-800 text-base">
            Too often, important insights and knowledge are lost because people work separately. We bring the entire ecosystem—students, professionals, startups, NGOs, companies, investors—onto a single collaborative platform. We eliminate barriers of geography and time zones, making global teamwork practical, meaningful, and efficient.
            </CardContent>
          </Card>
        </div>

        {/* Summary Mission Card */}
        <Card className="mt-10 w-full bg-gradient-to-br from-blue-100 to-cyan-100 border border-blue-200 shadow-xl rounded-3xl" data-aos="fade-up" data-aos-delay="800" data-aos-duration="500">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-blue-900 text-center">
              So We Built a Place Where:
            </CardTitle>
          </CardHeader>
          <CardContent className="text-blue-800 text-base">
            <ul className="list-disc pl-8 space-y-2">
              <li><strong>Everything is free, forever.</strong> No paywalls, subscriptions, or hidden fees.</li>
              <li><strong>Real-world impact leads the way.</strong> Climate tech, ethical AI, accessible healthcare—if it helps society, it belongs here.</li>
              <li><strong>Every perspective matters.</strong> Your background isn’t a barrier—it’s your greatest strength. Curiosity, passion, and action drive this community.</li>
            </ul>
            <blockquote className="mt-4 border-l-4 border-blue-500 pl-4 italic text-blue-700 bg-blue-100/60 rounded py-2">
              “Don’t walk behind me; walk with me. Either we change the world, or you’ll watch us changing it for you.”
            </blockquote>
          </CardContent>
        </Card>
      </div>

<div className="h-2 w-full bg-gradient-to-r from-blue-400 via-green-400 to-purple-400 rounded-full" />

      
      {/* What We Do */}
      <div className="min-h-screen w-full bg-gradient-to-br from-cyan-900 to-indigo-950 bg-fixed py-16 px-4">
    <Card className="bg-purple-50/90 border border-purple-100 shadow-xl rounded-3xl max-w-7xl mx-auto p-10" data-aos="zoom-in-up" data-aos-duration="500">
    
    <h2 className="text-4xl font-extrabold text-center text-green-900 mb-6">What We Do</h2>
    <p className="text-lg text-center text-green-800 max-w-3xl mx-auto mb-12 leading-relaxed">
      We connect the entire innovation ecosystem—students, graduates, professionals, startups, NGOs, companies, and investors—to co‑create solutions in the open (or in private when needed).
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Students & Graduates */}
      <div className="bg-gradient-to-br from-blue-100 to-blue-50 p-6 rounded-2xl shadow-md" data-aos="fade-right" data-aos-delay="100" data-aos-duration="500">
        <h3 className="text-xl font-bold text-blue-700 mb-3">For Students/Graduates/Professionals</h3>
        <ul className="list-disc pl-5 text-blue-900 space-y-2 text-base">
          <li>Join live projects & start-ups tackling real problems.</li>
          <li>Gain real-time skills, work in real teams, and earn feedback that enhances your profile—visible to recruiters and founders.</li>
          <li>Pitch your own problem statements and build your first team.</li>
          <li>Post surveys and collect data and feedback from the community.</li>
        </ul>
      </div>

      {/* Startups & Founders */}
      <div className="bg-gradient-to-br from-green-100 to-green-50 p-6 rounded-2xl shadow-md" data-aos="fade-left" data-aos-delay="200" data-aos-duration="500">
        <h3 className="text-xl font-bold text-green-700 mb-3">For Startups & Founders</h3>
        <ul className="list-disc pl-5 text-green-900 space-y-2 text-base">
          <li>Find mission-aligned talent—without burning runway.</li>
          <li>Build openly or operate under NDAs until launch.</li>
          <li>Test and evaluate your models with top-tier contributors and get feedback.</li>
          <li>Document progress transparently for investors and supporters.</li>
        </ul>
      </div>

      {/* Companies & NGOs */}
      <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 p-6 rounded-2xl shadow-md" data-aos="flip-left" data-aos-delay="300" data-aos-duration="500">
        <h3 className="text-xl font-bold text-yellow-700 mb-3">For Companies & NGOs</h3>
        <ul className="list-disc pl-5 text-yellow-900 space-y-2 text-base">
          <li>Post problem statements and crowdsource solutions—openly or privately.</li>
          <li>Discover talent through what they’ve built—not just resumes. Say goodbye to CVs and ATS filters.</li>
          <li>Direct CSR funds toward impactful, trackable projects.</li>
        </ul>
      </div>

      {/* Investors & Backers */}
      <div className="bg-gradient-to-br from-purple-100 to-purple-50 p-6 rounded-2xl shadow-md" data-aos="flip-right" data-aos-delay="400" data-aos-duration="500">
        <h3 className="text-xl font-bold text-purple-700 mb-3">For Investors & Backers</h3>
        <ul className="list-disc pl-5 text-purple-900 space-y-2 text-base">
          <li>Track multiple startups in one place—progress, traction, and timelines in real time.</li>
          <li>Spot high-potential teams early and support them with insight and transparency.</li>
        </ul>
      </div>
    </div>
  </Card>
</div>


      <div className="h-2 w-full bg-gradient-to-r from-blue-400 via-green-400 to-purple-400 rounded-full" />

      {/* How It Works */}
      <Card 
  className="bg-purple-50/90 border border-purple-100 shadow-xl rounded-3xl w-full mx-auto my-16 p-8"
  data-aos="zoom-in" data-aos-duration="500"
    data-aos-delay="1000"
>
  <CardHeader>
    <CardTitle className="text-4xl font-extrabold text-center text-purple-900 mb-2">
      How It Works
    </CardTitle>
    <p className="text-center text-purple-800 text-lg mb-8">A step-by-step journey to real-world impact, designed for clarity and collaboration.</p>
  </CardHeader>
  <CardContent className="flex flex-col gap-8 items-center px-2 md:px-8 py-6">
    {[
      { icon: '🎓', title: 'Learn ↔ Give Back', desc: 'Grow by doing. Build real solutions, receive meaningful reviews, and level up while helping others move faster too.' },
      { icon: '📌', title: 'Proof Over Paper', desc: 'Your contributions, feedback, and outcomes live on your profile—real signals that go far beyond résumés or ATS filters.' },
      { icon: '🤝', title: 'Team‑Up Fast', desc: 'Find co-founders or mission-driven teammates through smart matching and open contributor profiles.' },
      { icon: '📝', title: 'Post Updates & Progress', desc: 'Share milestones, blockers, and learnings as you go—keeping your team, supporters, and the community in the loop with transparent, real-time updates.' },
     
      { icon: '💡', title: 'CSR & Hiring Flywheel', desc: 'Companies fund impact through CSR and Projects gain resources, mentors, and momentum. Hire proven builders by looking at their true motivation, skills and passion and not just resumes which change for every job application.' },
      
      { icon: '📊', title: 'Investor & NGO Visibility', desc: 'Transparent progress dashboards and impact metrics help backers identify and support high-potential work in real time.' },
      { icon: '⚙️', title: 'Efficiency by Design', desc: 'Shared tools, clear templates, and lean workflows eliminate waste—so every hour creates real progress.' },
      { icon: '🔐', title: 'Open by Default, Private on Demand', desc: 'Openness fuels collaboration. NDAs, private repos, and secure spaces are there when needed.' },
      { icon: '🌍', title: 'Free Forever, Ethical Always', desc: 'No fees. No ads. No data selling. People, planet, and privacy always come first.' },
      { icon: '🔄', title: 'Stewardship Over Ownership', desc: 'Rotating leadership, strong documentation, and open licenses ensure solutions outlast individuals.' },
    ].map((step, idx) => (
      <div key={idx} className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-md px-6 py-5 flex items-start gap-4" data-aos="fade-up" data-aos-delay={idx * 80} data-aos-duration="400">
        <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-full bg-purple-100">
          <span className="text-purple-600 text-3xl">{step.icon}</span>
        </div>
        <div>
          <h3 className="text-xl font-bold text-purple-900 mb-1">{step.title}</h3>
          <p className="text-purple-800 text-base leading-relaxed">{step.desc}</p>
        </div>
      </div>
    ))}
  </CardContent>
</Card>

<div className="h-2 w-full bg-gradient-to-r from-blue-400 via-green-400 to-purple-400 rounded-full" />


      {/* What Success Looks Like */}
      <Card className="bg-green-50/80 border-green-100 shadow-lg rounded-xl" data-aos="fade-up" data-aos-duration="300" data-aos-delay="1200">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-green-900 text-center mb-2">What Success Looks Like</CardTitle>
          <p className="text-green-800 text-lg text-center mb-4">Here’s what real, measurable progress means in our ecosystem:</p>
        </CardHeader>
        <CardContent className="space-y-4 text-green-900 text-lg px-4 md:px-8 py-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
      <Card className="rounded-xl shadow-md p-4" data-aos="fade-up" data-aos-delay="0" data-aos-duration="400">
        <div className="flex items-start gap-3">
          <span className="text-green-600 text-2xl">🌱</span>
          <div><strong>Impact, Not Hype –</strong> Lives touched, CO₂ reduced, hours saved, access created—real numbers over glossy decks.</div>
        </div>
      </Card>
      <Card className="rounded-xl shadow-md p-4" data-aos="fade-up" data-aos-delay="100" data-aos-duration="400">
        <div className="flex items-start gap-3">
          <span className="text-green-600 text-2xl">🤝</span>
          <div><strong>Communities Thriving –</strong> Diverse, global teams solving local problems and mentoring the next wave.</div>
        </div>
      </Card>
      <Card className="rounded-xl shadow-md p-4" data-aos="fade-up" data-aos-delay="200" data-aos-duration="400">
        <div className="flex items-start gap-3">
          <span className="text-green-600 text-2xl">🎯</span>
          <div><strong>Skills → Careers –</strong> Verified feedback, credits, and recommendations translate into offers, co‑founder invites, and funding doors opening.</div>
        </div>
      </Card>
      <Card className="rounded-xl shadow-md p-4" data-aos="fade-up" data-aos-delay="300" data-aos-duration="400">
        <div className="flex items-start gap-3">
          <span className="text-green-600 text-2xl">🚀</span>
          <div><strong>Pilots to Products –</strong> Experiments become deployed solutions—maintained, documented, and stewarded beyond the MVP rush.</div>
        </div>
      </Card>
      <Card className="rounded-xl shadow-md p-4" data-aos="fade-up" data-aos-delay="400" data-aos-duration="400">
        <div className="flex items-start gap-3">
          <span className="text-green-600 text-2xl">💸</span>
          <div><strong>Value Circulated –</strong> CSR funds deployed, grants raised, contributors paid or equity‑shared—everyone sees where resources flow.</div>
        </div>
      </Card>
      <Card className="rounded-xl shadow-md p-4" data-aos="fade-up" data-aos-delay="500" data-aos-duration="400">
        <div className="flex items-start gap-3">
          <span className="text-green-600 text-2xl">🌍</span>
          <div><strong>Borderless Collaboration at Scale –</strong> Cross‑continent teams co‑create, hand off work 24/7, share playbooks openly, and remix breakthroughs globally.</div>
        </div>
      </Card>
      <Card className="rounded-xl shadow-md p-4" data-aos="fade-up" data-aos-delay="600" data-aos-duration="400">
        <div className="flex items-start gap-3">
          <span className="text-green-600 text-2xl">⚡</span>
          <div><strong>Seamless Acceleration –</strong> From learning new skills to launching MVPs, evolving MVPs into full products, recruiting top talent, and securing investment, we erase every bottleneck and inefficiency so you move from idea to impact at warp speed.</div>
        </div>
      </Card>
      <Card className="rounded-xl shadow-md p-4" data-aos="fade-up" data-aos-delay="700" data-aos-duration="400">
        <div className="flex items-start gap-3">
          <span className="text-green-600 text-2xl">📖</span>
          <div><strong>Open Knowledge –</strong> Playbooks, code, and learnings are shared openly, so every success story becomes a blueprint for others.</div>
        </div>
      </Card>
    </div>
    <p className="mt-6 text-gray-600 text-base text-center">You’ll see transparent dashboards and open datasets—not slogans—updated continuously so anyone can audit progress.</p>
  </CardContent>
</Card>
      <div className="h-2 w-full bg-gradient-to-r from-blue-400 via-green-400 to-purple-400 rounded-full" />


      {/* Our Story */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-100 via-green-100 to-purple-100 p-10 shadow-xl">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
        <p className="text-lg text-gray-800 leading-relaxed">We started as a small group frustrated by the gap between intent and impact. Brilliant people were stuck; big problems were ignored; great ideas died in closed inboxes. So we built the place we wished existed— a living commons where initiative meets opportunity and the question “Who’s with me?” gets answered in minutes, not months.</p>
      </div>

      {/* Walk With Us */}
      <div className="rounded-2xl bg-gradient-to-r from-cyan-900 to-indigo-950 text-white p-10 text-center shadow-xl">
        <h2 className="text-3xl font-bold mb-4">Walk With Us</h2>
        <p className="text-lg leading-relaxed max-w-2xl mx-auto">Your time on this planet is a fraction of a heartbeat in cosmic history. Spend it shaping technology—and communities—that make Earth a more comfortable home for all its residents.</p>
      </div>
    </div>
  </div>
);}

export default About;
