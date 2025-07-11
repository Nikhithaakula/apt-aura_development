
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Users, 
  Briefcase, 
  MessageSquare, 
  CheckCircle, 
  XCircle,
  Search,
  Filter,
  Pin,
  Heart,
  TrendingUp,
  Calendar
} from "lucide-react";

const Dashboard = () => {
  const [userRole] = useState("Student"); // This would come from auth context
  const [newPost, setNewPost] = useState("");

  // Mock data - in real app, this would come from Supabase
  const userProjects = [
    {
      id: 1,
      title: "E-Learning Platform",
      description: "Building a modern learning management system",
      role: "Frontend Developer",
      members: 5,
      status: "Active"
    },
    {
      id: 2,
      title: "Climate Action App",
      description: "Mobile app to track carbon footprint",
      role: "Team Lead",
      members: 3,
      status: "Planning"
    }
  ];

  const userStartups = [
    {
      id: 1,
      name: "GreenTech Solutions",
      role: "Co-founder",
      stage: "Seed",
      members: 8
    }
  ];

  const feedUpdates = [
    {
      id: 1,
      author: "Sarah Chen",
      role: "Developer",
      content: "Just launched the beta version of our sustainability tracking app! 🌱",
      timestamp: "2 hours ago",
      likes: 12,
      project: "EcoTracker"
    },
    {
      id: 2,
      author: "Marcus Johnson",
      role: "Designer",
      content: "Looking for feedback on our new user interface design. Any UX experts available?",
      timestamp: "4 hours ago",
      likes: 8,
      project: "DesignHub"
    }
  ];

  const joinRequests = [
    {
      id: 1,
      name: "Alex Thompson",
      project: "E-Learning Platform",
      skills: ["React", "Node.js"],
      message: "I'd love to contribute to your project. I have 3 years of experience with React."
    },
    {
      id: 2,
      name: "Elena Rodriguez",
      project: "Climate Action App",
      skills: ["Python", "Data Science"],
      message: "Interested in helping with the data analytics part of your climate app."
    }
  ];

  const handlePostUpdate = () => {
    if (newPost.trim()) {
      console.log("Posting update:", newPost);
      setNewPost("");
    }
  };

  const renderStudentDashboard = () => (
    <Tabs defaultValue="projects" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="projects">Projects Involved</TabsTrigger>
        <TabsTrigger value="startups">Startups Joined</TabsTrigger>
        <TabsTrigger value="feed">Feed Updates</TabsTrigger>
      </TabsList>

      <TabsContent value="projects" className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">My Projects</h3>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Join Project
          </Button>
        </div>
        
        <div className="grid gap-4">
          {userProjects.map((project) => (
            <Card key={project.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">{project.title}</h4>
                  <Badge variant={project.status === 'Active' ? 'default' : 'secondary'}>
                    {project.status}
                  </Badge>
                </div>
                <p className="text-gray-600 text-sm mb-2">{project.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Role: {project.role}</span>
                  <span className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {project.members} members
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="startups" className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">My Startups</h3>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Join Startup
          </Button>
        </div>
        
        <div className="grid gap-4">
          {userStartups.map((startup) => (
            <Card key={startup.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">{startup.name}</h4>
                  <Badge>{startup.stage}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Role: {startup.role}</span>
                  <span className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {startup.members} members
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="feed" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Share an Update</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="What's happening with your projects?"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              rows={3}
            />
            <Button onClick={handlePostUpdate} disabled={!newPost.trim()}>
              <MessageSquare className="w-4 h-4 mr-2" />
              Post Update
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {feedUpdates.map((update) => (
            <Card key={update.id}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {update.author.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold">{update.author}</span>
                      <Badge variant="outline" className="text-xs">{update.role}</Badge>
                      <span className="text-sm text-gray-500">{update.timestamp}</span>
                    </div>
                    <p className="text-gray-800 mb-2">{update.content}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <button className="flex items-center space-x-1 hover:text-red-500">
                        <Heart className="w-4 h-4" />
                        <span>{update.likes}</span>
                      </button>
                      <span>Project: {update.project}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );

  const renderStartupDashboard = () => (
    <Tabs defaultValue="problems" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="problems">Post Problem Statement</TabsTrigger>
        <TabsTrigger value="requests">Join Requests</TabsTrigger>
        <TabsTrigger value="updates">Feeds/Updates</TabsTrigger>
      </TabsList>

      <TabsContent value="requests" className="space-y-4">
        <h3 className="text-lg font-semibold">Pending Join Requests</h3>
        
        <div className="space-y-4">
          {joinRequests.map((request) => (
            <Card key={request.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold">{request.name}</h4>
                    <p className="text-sm text-gray-600">Applying for: {request.project}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="default">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Accept
                    </Button>
                    <Button size="sm" variant="outline">
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="flex flex-wrap gap-1">
                    {request.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600">{request.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );

  const renderInvestorDashboard = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Startup Discovery</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <Input placeholder="Search startups..." />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
          
          <div className="flex space-x-2">
            <Badge variant="outline">Seed Stage</Badge>
            <Badge variant="outline">Series A</Badge>
            <Badge variant="outline">FinTech</Badge>
            <Badge variant="outline">HealthTech</Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Following
              <Pin className="w-4 h-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">3 startups you're following</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Activity Feed
              <TrendingUp className="w-4 h-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Latest updates from your portfolio</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your projects and connections.</p>
      </div>

      {userRole === "Student" && renderStudentDashboard()}
      {userRole === "Startup" && renderStartupDashboard()}
      {userRole === "Investor" && renderInvestorDashboard()}
    </div>
  );
};

export default Dashboard;
