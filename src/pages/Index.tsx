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
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();

  const steps = [
    {
      number: 1,
      title: "Create Your Profile",
      description: "Build a comprehensive profile showcasing your skills, experience, and goals.",
      icon: UserPlus,
      color: "bg-blue-500"
    },
    {
      number: 2,
      title: "Explore Projects and Startups",
      description: "Discover exciting projects and innovative startups looking for talent.",
      icon: Target,
      color: "bg-green-500"
    },
    {
      number: 3,
      title: "Join or Start a Team",
      description: "Connect with like-minded individuals and form collaborative teams.",
      icon: Users,
      color: "bg-purple-500"
    },
    {
      number: 4,
      title: "Post Updates & Collaborate",
      description: "Share your progress and collaborate with your team members.",
      icon: MessageSquare,
      color: "bg-orange-500"
    },
    {
      number: 5,
      title: "Get Discovered by HR & Investors",
      description: "Showcase your work and get noticed by potential employers and investors.",
      icon: Star,
      color: "bg-pink-500"
    },
    {
      number: 6,
      title: "Grow with the Ecosystem",
      description: "Advance your career and make meaningful impact within our community.",
      icon: TrendingUp,
      color: "bg-indigo-500"
    }
  ];

  const featuredMembers = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Full Stack Developer",
      avatar: "/placeholder.svg",
      skills: ["React", "Node.js", "Python"]
    },
    {
      id: 2,
      name: "Marcus Johnson",
      role: "UI/UX Designer",
      avatar: "/placeholder.svg",
      skills: ["Figma", "Design Systems", "User Research"]
    },
    {
      id: 3,
      name: "Elena Rodriguez",
      role: "Data Scientist",
      avatar: "/placeholder.svg",
      skills: ["Machine Learning", "Python", "Analytics"]
    },
    {
      id: 4,
      name: "David Kim",
      role: "Product Manager",
      avatar: "/placeholder.svg",
      skills: ["Strategy", "Agile", "Leadership"]
    },
    {
      id: 5,
      name: "Priya Patel",
      role: "Marketing Specialist",
      avatar: "/placeholder.svg",
      skills: ["Digital Marketing", "Content", "SEO"]
    },
    {
      id: 6,
      name: "Alex Thompson",
      role: "Startup Founder",
      avatar: "/placeholder.svg",
      skills: ["Entrepreneurship", "Business Development", "Strategy"]
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Build Your Future, <span className="text-green-300">Together</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Connect. Collaborate. Create Impact.
            </p>
            <p className="text-lg mb-10 text-blue-200 max-w-2xl mx-auto">
              Join a thriving ecosystem where students, professionals, startups, and investors 
              come together to build the future.
            </p>
            {user ? (
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4" asChild>
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4" asChild>
                <Link to="/auth">Join the Ecosystem</Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* 6-Step Guide Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Your Journey in 6 Simple Steps
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From profile creation to career growth, we guide you every step of the way
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <Card key={step.number} className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className={`w-12 h-12 ${step.color} rounded-full flex items-center justify-center mr-4`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-2xl font-bold text-gray-300">
                        {step.number.toString().padStart(2, '0')}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Member Board Preview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Community
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Connect with talented individuals from diverse backgrounds and expertise
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {featuredMembers.map((member) => (
              <Card key={member.id} className="hover:shadow-lg transition-shadow duration-300 bg-white">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {member.role}
                  </p>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {member.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Button asChild variant="outline" size="lg">
              <Link to="/feed">View All Members</Link>
            </Button>
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
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input 
                placeholder="Search for people, projects, startups, skills..." 
                className="pl-12 py-4 text-lg border-0 bg-white shadow-sm"
              />
            </div>
            
            <div className="flex flex-wrap gap-3 justify-center">
              <Button variant="outline" size="sm" className="bg-white">
                <Users className="w-4 h-4 mr-2" />
                People
              </Button>
              <Button variant="outline" size="sm" className="bg-white">
                <Briefcase className="w-4 h-4 mr-2" />
                Projects
              </Button>
              <Button variant="outline" size="sm" className="bg-white">
                <Rocket className="w-4 h-4 mr-2" />
                Startups
              </Button>
              <Button variant="outline" size="sm" className="bg-white">
                <Zap className="w-4 h-4 mr-2" />
                Skills
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
