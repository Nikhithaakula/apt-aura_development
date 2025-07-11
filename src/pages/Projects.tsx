
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  Plus, 
  Users, 
  Calendar, 
  Filter,
  MapPin,
  Clock,
  Star
} from "lucide-react";

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Mock projects data
  const projects = [
    {
      id: 1,
      title: "EcoTracker - Sustainability App",
      description: "Building a mobile app to help individuals and businesses track their carbon footprint and suggest eco-friendly alternatives.",
      owner: "Sarah Chen",
      skillsNeeded: ["React Native", "Node.js", "Environmental Science"],
      members: 4,
      maxMembers: 6,
      status: "Active",
      category: "Environmental",
      duration: "3 months",
      remote: true,
      postedDate: "2 days ago"
    },
    {
      id: 2,
      title: "AI-Powered Learning Assistant",
      description: "Developing an AI tutor that personalizes learning experiences for students with different learning styles and paces.",
      owner: "Marcus Johnson",
      skillsNeeded: ["Python", "Machine Learning", "Education", "UI/UX"],
      members: 3,
      maxMembers: 5,
      status: "Recruiting",
      category: "Education",
      duration: "6 months",
      remote: false,
      location: "San Francisco, CA",
      postedDate: "1 week ago"
    },
    {
      id: 3,
      title: "HealthConnect - Telemedicine Platform",
      description: "Creating a secure platform to connect patients with healthcare providers for virtual consultations and health monitoring.",
      owner: "Dr. Elena Rodriguez",
      skillsNeeded: ["HIPAA Compliance", "React", "Healthcare", "Security"],
      members: 5,
      maxMembers: 8,
      status: "Active",
      category: "Healthcare",
      duration: "9 months",
      remote: true,
      postedDate: "3 days ago"
    },
    {
      id: 4,
      title: "Urban Farming Management System",
      description: "IoT-based system to monitor and optimize urban farming operations including soil quality, irrigation, and crop health.",
      owner: "David Kim",
      skillsNeeded: ["IoT", "Agriculture", "Data Analytics", "Mobile Development"],
      members: 2,
      maxMembers: 4,
      status: "Planning",
      category: "Agriculture",
      duration: "4 months",
      remote: true,
      postedDate: "5 days ago"
    },
    {
      id: 5,
      title: "Blockchain Voting System",
      description: "Secure, transparent, and decentralized voting system for organizations and communities using blockchain technology.",
      owner: "Alex Thompson",
      skillsNeeded: ["Blockchain", "Solidity", "Security", "Frontend"],
      members: 3,
      maxMembers: 5,
      status: "Active",
      category: "Technology",
      duration: "8 months",
      remote: true,
      postedDate: "1 day ago"
    },
    {
      id: 6,
      title: "Mental Health Support Network",
      description: "Platform connecting individuals with peer support groups and mental health resources in their community.",
      owner: "Priya Patel",
      skillsNeeded: ["Psychology", "Community Building", "Web Development", "Privacy"],
      members: 4,
      maxMembers: 7,
      status: "Recruiting",
      category: "Healthcare",
      duration: "5 months",
      remote: false,
      location: "New York, NY",
      postedDate: "1 week ago"
    }
  ];

  const categories = ["All", "Technology", "Healthcare", "Education", "Environmental", "Agriculture"];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.skillsNeeded.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || project.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Open Projects</h1>
          <p className="text-gray-600">Discover and join exciting projects in our community</p>
        </div>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4 sm:mt-0">
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title</Label>
                <Input id="title" placeholder="Enter project title" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Describe your project..." rows={4} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="skills">Skills Needed</Label>
                <Input id="skills" placeholder="e.g., React, Python, Design (comma separated)" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input id="duration" placeholder="e.g., 3 months" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="members">Max Members</Label>
                  <Input id="members" type="number" placeholder="5" />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsCreateModalOpen(false)}>
                  Create Project
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search projects, skills, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Advanced Filters
          </Button>
        </div>
        
        {/* Category filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredProjects.length} of {projects.length} projects
        </p>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg mb-2">{project.title}</CardTitle>
                  <p className="text-sm text-gray-600">by {project.owner}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={project.status === 'Active' ? 'default' : 
                            project.status === 'Recruiting' ? 'secondary' : 'outline'}
                  >
                    {project.status}
                  </Badge>
                  {project.status === 'Active' && <Star className="w-4 h-4 text-yellow-500" />}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-gray-700 text-sm leading-relaxed">
                {project.description}
              </p>
              
              {/* Skills needed */}
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">SKILLS NEEDED</p>
                <div className="flex flex-wrap gap-1">
                  {project.skillsNeeded.map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Project details */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  <span>{project.members}/{project.maxMembers} members</span>
                </div>
                
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{project.duration}</span>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{project.remote ? "Remote" : project.location}</span>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{project.postedDate}</span>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex space-x-2 pt-2">
                <Button className="flex-1" size="sm">
                  Join Project
                </Button>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty state */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search terms or filters to find more projects.
          </p>
          <Button variant="outline">Clear Filters</Button>
        </div>
      )}
    </div>
  );
};

export default Projects;
