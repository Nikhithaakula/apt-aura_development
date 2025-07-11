
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Plus, 
  Users, 
  TrendingUp, 
  MapPin,
  Calendar,
  Heart,
  ExternalLink,
  Filter
} from "lucide-react";

const Startups = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock startups data
  const startups = [
    {
      id: 1,
      name: "GreenTech Solutions",
      tagline: "Sustainable technology for a better tomorrow",
      description: "We're developing IoT solutions to help businesses reduce their carbon footprint through smart energy management and waste reduction systems.",
      stage: "Seed",
      sector: "CleanTech",
      location: "San Francisco, CA",
      teamSize: 8,
      founded: "2023",
      requirements: "Looking for: Senior Backend Developer, Marketing Specialist",
      acceptingMembers: true,
      followers: 124,
      logo: "/placeholder.svg",
      tags: ["Sustainability", "IoT", "B2B"]
    },
    {
      id: 2,
      name: "EduConnect",
      tagline: "Bridging the education gap with AI",
      description: "AI-powered platform that personalizes learning experiences for students in underserved communities, making quality education accessible to all.",
      stage: "Series A",
      sector: "EdTech",
      location: "Boston, MA",
      teamSize: 15,
      founded: "2022",
      requirements: "Seeking: AI/ML Engineer, UX Designer, Education Specialist",
      acceptingMembers: true,
      followers: 89,
      logo: "/placeholder.svg",
      tags: ["Education", "AI", "Social Impact"]
    },
    {
      id: 3,
      name: "HealthWave",
      tagline: "Democratizing healthcare access",
      description: "Telemedicine platform connecting rural communities with healthcare professionals, featuring AI-assisted diagnosis and remote monitoring.",
      stage: "Pre-Seed",
      sector: "HealthTech",
      location: "Austin, TX",
      teamSize: 5,
      founded: "2024",
      requirements: "Need: Full-stack Developer, Healthcare Professional, Regulatory Expert",
      acceptingMembers: true,
      followers: 67,
      logo: "/placeholder.svg",
      tags: ["Healthcare", "Telemedicine", "Rural"]
    },
    {
      id: 4,
      name: "UrbanFarm",
      tagline: "Growing the future of food",
      description: "Vertical farming solutions for urban environments, using advanced hydroponics and LED technology to maximize yield in minimal space.",
      stage: "Seed",
      sector: "AgriTech",
      location: "Seattle, WA",
      teamSize: 12,
      founded: "2023",
      requirements: "Hiring: Hardware Engineer, Plant Scientist, Operations Manager",
      acceptingMembers: false,
      followers: 156,
      logo: "/placeholder.svg",
      tags: ["Agriculture", "Sustainability", "Urban"]
    },
    {
      id: 5,
      name: "CyberGuard",
      tagline: "Next-gen cybersecurity for SMBs",
      description: "AI-powered cybersecurity platform designed specifically for small and medium businesses, providing enterprise-level protection at affordable prices.",
      stage: "Series A",
      sector: "CyberSecurity",
      location: "New York, NY",
      teamSize: 22,
      founded: "2022",
      requirements: "Looking for: Security Researcher, Sales Engineer, Customer Success Manager",
      acceptingMembers: true,
      followers: 203,
      logo: "/placeholder.svg",
      tags: ["Security", "AI", "SMB"]
    },
    {
      id: 6,
      name: "EcoLogistics",
      tagline: "Sustainable supply chain solutions",
      description: "Optimizing supply chains for sustainability and efficiency using machine learning algorithms and real-time tracking systems.",
      stage: "Pre-Seed",
      sector: "Logistics",
      location: "Chicago, IL",
      teamSize: 6,
      founded: "2024",
      requirements: "Seeking: Supply Chain Expert, Data Scientist, Business Development",
      acceptingMembers: true,
      followers: 45,
      logo: "/placeholder.svg",
      tags: ["Logistics", "Sustainability", "ML"]
    }
  ];

  const stages = ["All Stages", "Pre-Seed", "Seed", "Series A", "Series B+"];
  const sectors = ["All Sectors", "CleanTech", "EdTech", "HealthTech", "AgriTech", "CyberSecurity", "Logistics"];
  
  const [selectedStage, setSelectedStage] = useState("All Stages");
  const [selectedSector, setSelectedSector] = useState("All Sectors");

  const filteredStartups = startups.filter(startup => {
    const matchesSearch = startup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         startup.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         startup.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         startup.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStage = selectedStage === "All Stages" || startup.stage === selectedStage;
    const matchesSector = selectedSector === "All Sectors" || startup.sector === selectedSector;
    return matchesSearch && matchesStage && matchesSector;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Startups</h1>
          <p className="text-gray-600">Discover innovative startups and join their journey</p>
        </div>
        
        <Button className="mt-4 sm:mt-0">
          <Plus className="w-4 h-4 mr-2" />
          Register Startup
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search startups, sectors, or keywords..."
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
        
        {/* Stage and Sector filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Stage</p>
            <div className="flex flex-wrap gap-2">
              {stages.map((stage) => (
                <Button
                  key={stage}
                  variant={selectedStage === stage ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedStage(stage)}
                >
                  {stage}
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Sector</p>
            <div className="flex flex-wrap gap-2">
              {sectors.map((sector) => (
                <Button
                  key={sector}
                  variant={selectedSector === sector ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSector(sector)}
                >
                  {sector}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredStartups.length} of {startups.length} startups
        </p>
      </div>

      {/* Startups Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredStartups.map((startup) => (
          <Card key={startup.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">
                    {startup.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <CardTitle className="text-lg truncate">{startup.name}</CardTitle>
                    <Badge variant={startup.acceptingMembers ? "default" : "secondary"}>
                      {startup.stage}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{startup.tagline}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span>{startup.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      <span>{startup.teamSize} team</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>Est. {startup.founded}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-gray-700 text-sm leading-relaxed">
                {startup.description}
              </p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {startup.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              {/* Requirements */}
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs font-semibold text-gray-500 mb-1">CURRENT OPENINGS</p>
                <p className="text-sm text-gray-700">{startup.requirements}</p>
              </div>
              
              {/* Stats and actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Heart className="w-4 h-4 mr-1" />
                    <span>{startup.followers} followers</span>
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>{startup.sector}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  {startup.acceptingMembers ? (
                    <Button size="sm">
                      Request to Join Team
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline">
                      Follow Updates
                    </Button>
                  )}
                  <Button size="sm" variant="ghost">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty state */}
      {filteredStartups.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No startups found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search terms or filters to discover more startups.
          </p>
          <Button variant="outline">Clear Filters</Button>
        </div>
      )}
    </div>
  );
};

export default Startups;
