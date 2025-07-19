import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Users,
  Briefcase,
  Rocket,
  MessageSquare,
  UserPlus,
  Target,
  Star,
  TrendingUp,
  Heart,
  Zap,
  PlayCircleIcon,
  Volume2,
  VolumeX
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useRef, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const Index = () => {
  const { user } = useAuth();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [members, setMembers] = useState<any[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const { toast } = useToast();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchType, setSearchType] = useState<string>("");
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      setLoadingMembers(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, role, skills")
        .limit(6);
      if (!error && data) setMembers(data);
      setLoadingMembers(false);
    };
    fetchMembers();
  }, []);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleVideoClick = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };
  const steps = [
    {
      number: 1,
      title: "Students & Graduates: Build Real Skills",
      description: "Join impactful projects or startups solving real-world problems. Gain hands-on experience, mentorship, and profile-boosting feedback from project leads.",
      icon: UserPlus,
      color: "bg-blue-500"
    },
    {
      number: 2,
      title: "Startups: Collaborate & Scale",
      description: "Find passionate talent to help build your vision. Share your journey, attract co-founders, and showcase traction to investors in one place.",
      icon: Rocket,
      color: "bg-purple-600"
    },
    {
      number: 3,
      title: "Professionals: Mentor & Contribute",
      description: "Lend your expertise to early-stage projects, mentor teams, or contribute directly to mission-aligned work across sectors.",
      icon: Star,
      color: "bg-yellow-500"
    },
    {
      number: 4,
      title: "Companies: Hire Smart & Fund Impact",
      description: "Spot top talent through live project work, not static CVs. Support social innovation through CSR funding or challenge sponsorship.",
      icon: Briefcase,
      color: "bg-green-600"
    },
    {
      number: 5,
      title: "Investors: Track and Back Startups",
      description: "Follow startup progress and impact in real time. Support founders early and transparently with high-clarity profiles and updates.",
      icon: TrendingUp,
      color: "bg-pink-500"
    },
    {
      number: 6,
      title: "Matchmaking: Build Dream Teams",
      description: "Easily discover collaborators, co-founders, and experts based on profiles, feedback, and project history. Build with the right people.",
      icon: Users,
      color: "bg-indigo-500"
    }
  ];
  
  const navigate = useNavigate();
  // Optionally, you can use state, but here we'll use a ref for the input
  const searchInputRef = useRef<HTMLInputElement>(null);
  // Optionally, track selected filter (default to 'people')
  const [selectedFilter, setSelectedFilter] = useState<'people' | 'projects' | 'startups' | 'skills'>('people');

  const handleSearch = (filter?: 'people' | 'projects' | 'startups' | 'skills') => {
    const query = searchInputRef.current?.value.trim() || '';
    const target = filter || selectedFilter;
    if (!query) return;
    if (target === 'people') navigate(`/community?search=${encodeURIComponent(query)}`);
    else if (target === 'projects') navigate(`/projects?search=${encodeURIComponent(query)}`);
    else if (target === 'startups') navigate(`/startups?search=${encodeURIComponent(query)}`);
    else if (target === 'skills') navigate(`/community?search=${encodeURIComponent(query)}&filter=skills`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleGlobalSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    const query = searchInputRef.current?.value.trim();
    if (!query) return;

    // Build or filters without parentheses
    const userOr = "full_name.ilike.*" + query + "*,id.eq." + query;
    const projectOr = "title.ilike.*" + query + "*,id.eq." + query;
    const startupOr = "name.ilike.*" + query + "*,id.eq." + query;
    console.log('User OR filter:', userOr);
    console.log('Project OR filter:', projectOr);
    console.log('Startup OR filter:', startupOr);

    // Search users
    let { data: users, error: userError } = await supabase
      .from("profiles")
      .select("id, full_name")
      .or(userOr)
      .limit(10);

    // Search projects
    let { data: projects, error: projectError } = await supabase
      .from("projects")
      .select("id, title")
      .or(projectOr)
      .limit(10);

    // Search startups
    let { data: startups, error: startupError } = await supabase
      .from("startups")
      .select("id, name")
      .or(startupOr)
      .limit(10);

    // Combine results
    const results = [
      ...(users?.map(u => ({ ...u, _type: 'profile', label: u.full_name })) || []),
      ...(projects?.map(p => ({ ...p, _type: 'project', label: p.title })) || []),
      ...(startups?.map(s => ({ ...s, _type: 'startup', label: s.name })) || []),
    ];

    if (results.length === 1) {
      const r = results[0];
      if (r._type === 'profile') navigate(`/profile/${r.id}`);
      else if (r._type === 'project') navigate(`/projects/${r.id}`);
      else if (r._type === 'startup') navigate(`/startups/${r.id}`);
      return;
    } else if (results.length > 1) {
      setSearchResults(results);
      setShowResults(true);
      return;
    }

    toast({ title: "No match found", description: `No user, project, or startup found for '${query}'.`, variant: "destructive" });
  };

  return (
    <div className="min-h-screen">
    {/* Hero Section with Matching Background */}
    <section className="relative w-full h-[80vh] bg-gradient-to-r from-cyan-900 to-indigo-950 text-white">
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center px-4">
        <div className="bg-white/80 rounded-xl px-8 py-6 shadow-lg backdrop-blur-md">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-2">
            Build Your Future, Together
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-6">
            Connect. Collaborate. Create Impact.
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            From Stardust to Solutions
          </h2>
          <div className="flex flex-col md:flex-row justify-center gap-4 mt-4">
            {user ? (
              <Button size="lg" className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-3 text-lg shadow-md" asChild>
                <Link to="/dashboard">🚀 Go to Dashboard</Link>
              </Button>
            ) : (
              <Button size="lg" className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 text-lg shadow-md" asChild>
                <Link to="/auth">🌱 Join the Ecosystem</Link>
              </Button>
            )}
          </div>
        </div>
        <div className="mt-8 max-w-3xl mx-auto">
          <p className="text-lg md:text-xl text-blue-100 drop-shadow-md">
            Join the free, zero-barrier ecosystem where students, professionals, startups, and investors unite to solve real-world problems.
          </p>
        </div>
        {/* Navigation Buttons Below Dashboard */}
        <div className="flex flex-wrap gap-4 justify-center mt-10">
          <Button asChild variant="outline" size="lg" className="bg-white">
            <Link to="/community" className="text-gray-900 flex items-center">
              <Users className="w-5 h-5 mr-2 text-gray-900 fill-current" />
              People
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="bg-white">
            <Link to="/projects" className="text-gray-900 flex items-center">
              <Briefcase className="w-5 h-5 mr-2 text-gray-900 fill-current" />
              Projects
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="bg-white">
            <Link to="/startups" className="text-gray-900 flex items-center">
              <Rocket className="w-5 h-5 mr-2 text-gray-900 fill-current" />
              Startups
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="bg-white">
            <Link to="/feed" className="text-gray-900 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-gray-900 fill-current" />
              Feed
            </Link>
          </Button>
        </div>
      </div>
    </section>

    {/* Separated Video Section */}
    <section className="relative w-full h-[100vh] overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={isMuted}
          poster="/ae63709d-04b3-4040-9e05-7ed14f910653.png"
          className="w-full h-full object-cover rounded-xl shadow-xl"
          onClick={handleVideoClick}
        >
          <source src="MEDIA/AURA.mp4" type="video/mp4" />
        </video>

        {/* Stylish Volume Button */}
        <div className="absolute top-6 right-6 z-20">
          <button
            onClick={toggleMute}
            className="flex items-center gap-2 px-4 py-2 text-white bg-black/50 backdrop-blur-sm hover:bg-black/70 rounded-full shadow-md transition"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            <span className="text-sm font-medium">
              {isMuted ? "Sound Off" : "Sound On"}
            </span>
          </button>
        </div>
      </section>
      {/* 6-Step Guide Section */}
      <section className="py-20 bg-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900">How It All Connects</h2>
      <p className="mt-2 text-lg text-gray-600 max-w-3xl mx-auto">
        We bridge Students, Graduates, Professionals, Startups, NGOs, Companies, and Investors—creating a living ecosystem where everyone contributes and benefits.
      </p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Students & Graduates */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto flex items-center justify-center mb-4">
            <UserPlus className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Students & Graduates</h3>
          <p className="text-gray-600 text-sm">
            Enroll in real-time projects. Gain hands‑on experience, develop in‑demand skills, and earn feedback that boosts your profile and hiring prospects.
          </p>
        </CardContent>
      </Card>
      {/* Professionals */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Professionals</h3>
          <p className="text-gray-600 text-sm">
            Mentor teams or contribute directly. Share expertise, expand your network, and drive impact while learning from emerging talent.
          </p>
        </CardContent>
      </Card>
      {/* Startups & Projects */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6 text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto flex items-center justify-center mb-4">
            <Rocket className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Startups & Projects</h3>
          <p className="text-gray-600 text-sm">
            Post problem statements, form cross‑sector teams, and build MVPs. Showcase progress, attract co‑founders, and access CSR or investor support.
          </p>
        </CardContent>
      </Card>
      {/* NGOs & CSR */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full mx-auto flex items-center justify-center mb-4">
            <Heart className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">NGOs & CSR</h3>
          <p className="text-gray-600 text-sm">
            Sponsor social challenges or fund impact projects. Engage skilled volunteers and track measurable outcomes for community good.
          </p>
        </CardContent>
      </Card>
      {/* Companies & HR */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6 text-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-full mx-auto flex items-center justify-center mb-4">
            <Briefcase className="w-6 h-6 text-yellow-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Companies & HR</h3>
          <p className="text-gray-600 text-sm">
            Discover talent by live project contributions, not just CVs. Hire confidently, support innovation, and reduce recruitment bias.
          </p>
        </CardContent>
      </Card>
      {/* Investors */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6 text-center">
          <div className="w-12 h-12 bg-pink-100 rounded-full mx-auto flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6 text-pink-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Investors</h3>
          <p className="text-gray-600 text-sm">
            Monitor startup timelines, achievements, and impact in real-time. Back promising ventures early with clear, verifiable progress.
          </p>
        </CardContent>
      </Card>
    </div>
  </div>
</section>




      {/* Community Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Meet Our Community</h2>
            <p className="mt-2 text-lg text-gray-600 max-w-3xl mx-auto">
              Connect with talented individuals from diverse backgrounds and expertise
            </p>
          </div>
          {loadingMembers ? (
            <div className="text-center text-gray-400">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
              {members.map((member: any) => (
                <Link
                  to={`/profile/${member.id}`}
                  key={member.id}
                  className="block"
                  style={{ textDecoration: "none" }}
                >
                  <Card className="flex flex-col items-center p-6 hover:shadow-lg transition cursor-pointer">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 to-green-400 flex items-center justify-center text-white font-bold text-xl mb-3">
                      {member.full_name
                        ? member.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
                        : "?"}
                    </div>
                    <div className="font-semibold text-lg text-center">{member.full_name}</div>
                    <div className="text-gray-500 text-center mb-2">{member.role}</div>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {(member.skills || []).map((skill: string) => (
                        <Badge key={skill} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
          <div className="flex justify-center mt-4">
            <Link to="/community">
              <Button variant="outline" size="lg">View All Members</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Find What You're Looking For
            </h2>
            <p className="text-lg text-gray-600">
              Search for people, projects, startups, and skills across our ecosystem
            </p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-8">
            <div className="flex flex-wrap gap-3 justify-center mt-6">
              <Button asChild variant="outline" size="sm" className="bg-white">
                <Link to="/community"><Users className="w-4 h-4 mr-2" />People</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="bg-white">
                <Link to="/projects"><Briefcase className="w-4 h-4 mr-2" />Projects</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="bg-white">
                <Link to="/startups"><Rocket className="w-4 h-4 mr-2" />Startups</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="bg-white">
                <Link to="/feed"><MessageSquare className="w-4 h-4 mr-2" />Feed</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">E</span>
                </div>
                <span className="text-xl font-bold">EcoSystem</span>
              </div>
              <p className="text-gray-400 mb-4">
                Building the future through collaboration and innovation.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-0">
                  <Heart className="w-5 h-5" />
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/projects" className="hover:text-white transition-colors">Projects</Link></li>
                <li><Link to="/startups" className="hover:text-white transition-colors">Startups</Link></li>
                <li><Link to="/feed" className="hover:text-white transition-colors">Community</Link></li>
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Guidelines</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 EcoSystem. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;