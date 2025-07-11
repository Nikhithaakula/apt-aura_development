
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Plus,
  Filter,
  TrendingUp,
  Users,
  Briefcase,
  Rocket
} from "lucide-react";

const Feed = () => {
  const [newPost, setNewPost] = useState("");
  const [filter, setFilter] = useState("All");

  // Mock feed data
  const feedPosts = [
    {
      id: 1,
      author: {
        name: "Sarah Chen",
        role: "Full Stack Developer",
        avatar: "/placeholder.svg"
      },
      content: "Just launched the beta version of our sustainability tracking app! 🌱 The response from early users has been incredible. We've helped track over 1,000 tons of CO2 savings in just the first week. Looking forward to scaling this impact! #sustainability #tech #climatechange",
      timestamp: "2 hours ago",
      likes: 24,
      comments: 8,
      shares: 3,
      type: "update",
      project: "EcoTracker",
      tags: ["Sustainability", "Launch", "Beta"]
    },
    {
      id: 2,
      author: {
        name: "Marcus Johnson",
        role: "UI/UX Designer",
        avatar: "/placeholder.svg"
      },
      content: "Looking for feedback on our new user interface design for the AI learning assistant. We've simplified the onboarding flow and added more intuitive navigation. Any UX experts or educators willing to take a look? Your insights would be invaluable! 🎨📚",
      timestamp: "4 hours ago",
      likes: 16,
      comments: 12,
      shares: 2,
      type: "request",
      project: "EduConnect",
      tags: ["Design", "Feedback", "Education"]
    },
    {
      id: 3,
      author: {
        name: "Elena Rodriguez",
        role: "Data Scientist",
        avatar: "/placeholder.svg"
      },
      content: "Exciting breakthrough in our healthcare AI project! Our model now achieves 94% accuracy in early disease detection from medical imaging. This could revolutionize preventive healthcare, especially in underserved communities. Science is amazing! 🔬⚕️",
      timestamp: "6 hours ago",
      likes: 31,
      comments: 15,
      shares: 7,
      type: "achievement",
      project: "HealthWave",
      tags: ["AI", "Healthcare", "Research"]
    },
    {
      id: 4,
      author: {
        name: "David Kim",
        role: "Product Manager",
        avatar: "/placeholder.svg"
      },
      content: "Proud to share that our urban farming startup just secured our first major client! 🌾 A local restaurant chain will be sourcing fresh produce from our vertical farms. This proves that sustainable urban agriculture is not just possible, but profitable. Next stop: scaling nationwide!",
      timestamp: "8 hours ago",
      likes: 42,
      comments: 18,
      shares: 11,
      type: "milestone",
      project: "UrbanFarm",
      tags: ["Agriculture", "Business", "Milestone"]
    },
    {
      id: 5,
      author: {
        name: "Priya Patel",
        role: "Marketing Specialist",
        avatar: "/placeholder.svg"
      },
      content: "Seeking a passionate blockchain developer to join our decentralized voting platform! 🗳️ We're building the future of transparent democracy. If you believe in the power of technology to improve governance and have Solidity experience, let's chat! Remote-friendly team.",
      timestamp: "12 hours ago",
      likes: 19,
      comments: 9,
      shares: 4,
      type: "opportunity",
      project: "VoteChain",
      tags: ["Blockchain", "Hiring", "Democracy"]
    },
    {
      id: 6,
      author: {
        name: "Alex Thompson",
        role: "Startup Founder",
        avatar: "/placeholder.svg"
      },
      content: "Reflecting on our startup journey so far... From a dorm room idea to a team of 12 passionate individuals working on cybersecurity for SMBs. The challenges have been immense, but so has the learning. Grateful for this amazing community that supports each other! 💪🚀",
      timestamp: "1 day ago",
      likes: 56,
      comments: 23,
      shares: 8,
      type: "reflection",
      project: "CyberGuard",
      tags: ["Startup", "Journey", "Gratitude"]
    }
  ];

  const filters = [
    { name: "All", icon: TrendingUp },
    { name: "Updates", icon: MessageCircle },
    { name: "Opportunities", icon: Users },
    { name: "Projects", icon: Briefcase },
    { name: "Startups", icon: Rocket }
  ];

  const filteredPosts = filter === "All" ? feedPosts : 
    feedPosts.filter(post => {
      switch(filter) {
        case "Updates": return post.type === "update" || post.type === "achievement";
        case "Opportunities": return post.type === "opportunity" || post.type === "request";
        case "Projects": return post.project && !post.project.includes("startup");
        case "Startups": return post.type === "milestone" || post.type === "reflection";
        default: return true;
      }
    });

  const handlePost = () => {
    if (newPost.trim()) {
      console.log("Posting:", newPost);
      setNewPost("");
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case "update": return "bg-blue-100 text-blue-800";
      case "request": return "bg-purple-100 text-purple-800";
      case "achievement": return "bg-green-100 text-green-800";
      case "milestone": return "bg-orange-100 text-orange-800";
      case "opportunity": return "bg-pink-100 text-pink-800";
      case "reflection": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Feed</h1>
        <p className="text-gray-600">Stay updated with the latest from our ecosystem</p>
      </div>

      {/* Create Post */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">You</span>
            </div>
            <div className="flex-1">
              <Textarea
                placeholder="Share an update, ask for help, or celebrate a milestone..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                rows={3}
                className="resize-none border-0 p-0 focus-visible:ring-0 placeholder:text-gray-400"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" className="text-gray-500">
                <Plus className="w-4 h-4 mr-1" />
                Project
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-500">
                <Plus className="w-4 h-4 mr-1" />
                Media
              </Button>
            </div>
            <Button onClick={handlePost} disabled={!newPost.trim()}>
              Share
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex items-center space-x-4 mb-8 overflow-x-auto pb-2">
        {filters.map((filterOption) => {
          const Icon = filterOption.icon;
          return (
            <Button
              key={filterOption.name}
              variant={filter === filterOption.name ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(filterOption.name)}
              className="flex items-center space-x-1 whitespace-nowrap"
            >
              <Icon className="w-4 h-4" />
              <span>{filterOption.name}</span>
            </Button>
          );
        })}
      </div>

      {/* Feed Posts */}
      <div className="space-y-6">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              {/* Post Header */}
              <div className="flex items-start space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">
                    {post.author.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
                    <Badge variant="outline" className="text-xs">
                      {post.author.role}
                    </Badge>
                    <Badge className={`text-xs ${getTypeColor(post.type)}`}>
                      {post.type}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>{post.timestamp}</span>
                    {post.project && (
                      <>
                        <span>•</span>
                        <span className="font-medium">{post.project}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <div className="mb-4">
                <p className="text-gray-800 leading-relaxed mb-3">{post.content}</p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag.toLowerCase()}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Post Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center space-x-6">
                  <button className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors">
                    <Heart className="w-5 h-5" />
                    <span className="text-sm">{post.likes}</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm">{post.comments}</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors">
                    <Share2 className="w-5 h-5" />
                    <span className="text-sm">{post.shares}</span>
                  </button>
                </div>
                
                <Button variant="ghost" size="sm" className="text-gray-500">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center mt-8">
        <Button variant="outline">
          Load More Posts
        </Button>
      </div>
    </div>
  );
};

export default Feed;
