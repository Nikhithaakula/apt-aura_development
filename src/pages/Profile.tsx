
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, 
  Calendar, 
  Mail, 
  Link as LinkIcon, 
  Edit,
  Users,
  Briefcase,
  Star,
  TrendingUp,
  Award,
  MessageSquare
} from "lucide-react";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);

  // Mock user profile data
  const userProfile = {
    name: "John Doe",
    role: "Full Stack Developer",
    location: "San Francisco, CA",
    joinDate: "January 2024",
    email: "john.doe@example.com",
    website: "johndoe.dev",
    bio: "Passionate full-stack developer with 5+ years of experience building scalable web applications. I love working on projects that make a positive impact on society and the environment. Always eager to learn new technologies and collaborate with like-minded individuals.",
    skills: ["React", "Node.js", "Python", "PostgreSQL", "AWS", "Docker", "TypeScript", "GraphQL"],
    interests: ["Sustainability", "Education", "Open Source", "AI/ML"],
    stats: {
      projectsCompleted: 12,
      collaborations: 28,
      contributions: 156,
      followers: 89
    }
  };

  const userProjects = [
    {
      id: 1,
      title: "EcoTracker - Sustainability App",
      role: "Lead Developer",
      status: "Completed",
      description: "Built a comprehensive carbon footprint tracking application",
      technologies: ["React Native", "Node.js", "MongoDB"],
      team: 6,
      duration: "4 months"
    },
    {
      id: 2,
      title: "AI Learning Assistant",
      role: "Frontend Developer",
      status: "Active",
      description: "Developing an AI-powered educational platform",
      technologies: ["React", "Python", "TensorFlow"],
      team: 4,
      duration: "Ongoing"
    },
    {
      id: 3,
      title: "Community Health Platform",
      role: "Full Stack Developer",
      status: "Planning",
      description: "Telemedicine platform for rural communities",
      technologies: ["Vue.js", "Express", "PostgreSQL"],
      team: 3,
      duration: "6 months"
    }
  ];

  const userActivity = [
    {
      id: 1,
      type: "project_join",
      description: "Joined the HealthWave project as a Frontend Developer",
      timestamp: "2 days ago"
    },
    {
      id: 2,
      type: "post",
      description: "Shared an update about the EcoTracker launch",
      timestamp: "1 week ago"
    },
    {
      id: 3,
      type: "collaboration",
      description: "Started collaborating with Sarah Chen on data visualization",
      timestamp: "2 weeks ago"
    },
    {
      id: 4,
      type: "achievement",
      description: "Completed the Community Health Platform project",
      timestamp: "3 weeks ago"
    }
  ];

  const achievements = [
    {
      id: 1,
      title: "Collaboration Champion",
      description: "Completed 25+ successful collaborations",
      icon: Users,
      color: "text-blue-500"
    },
    {
      id: 2,
      title: "Innovation Leader",
      description: "Led 10+ impactful projects",
      icon: TrendingUp,
      color: "text-green-500"
    },
    {
      id: 3,
      title: "Community Builder",
      description: "Helped 50+ community members",
      icon: Award,
      color: "text-purple-500"
    },
    {
      id: 4,
      title: "Tech Contributor",
      description: "Made 100+ technical contributions",
      icon: Star,
      color: "text-yellow-500"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
            {/* Avatar and Basic Info */}
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-2xl">
                  {userProfile.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{userProfile.name}</h1>
                <p className="text-xl text-gray-600 mb-3">{userProfile.role}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{userProfile.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Joined {userProfile.joinDate}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    <span>{userProfile.email}</span>
                  </div>
                  <div className="flex items-center">
                    <LinkIcon className="w-4 h-4 mr-1" />
                    <span>{userProfile.website}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 lg:ml-auto">
              <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                <Edit className="w-4 h-4 mr-2" />
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
              <Button>
                <MessageSquare className="w-4 h-4 mr-2" />
                Message
              </Button>
            </div>
          </div>

          {/* Bio */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-700 leading-relaxed">{userProfile.bio}</p>
          </div>

          {/* Skills and Interests */}
          <div className="mt-6 grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {userProfile.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {userProfile.interests.map((interest) => (
                  <Badge key={interest} variant="outline">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {userProfile.stats.projectsCompleted}
            </div>
            <div className="text-sm text-gray-600">Projects Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {userProfile.stats.collaborations}
            </div>
            <div className="text-sm text-gray-600">Collaborations</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {userProfile.stats.contributions}
            </div>
            <div className="text-sm text-gray-600">Contributions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {userProfile.stats.followers}
            </div>
            <div className="text-sm text-gray-600">Followers</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Sections */}
      <Tabs defaultValue="projects" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-4">
          <div className="grid gap-4">
            {userProjects.map((project) => (
              <Card key={project.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {project.title}
                      </h3>
                      <p className="text-sm text-gray-600">Role: {project.role}</p>
                    </div>
                    <Badge 
                      variant={
                        project.status === 'Completed' ? 'default' : 
                        project.status === 'Active' ? 'secondary' : 'outline'
                      }
                    >
                      {project.status}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        <span>{project.team} team members</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{project.duration}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <div className="space-y-4">
            {userActivity.map((activity) => (
              <Card key={activity.id}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-gray-900">{activity.description}</p>
                      <p className="text-sm text-gray-500 mt-1">{activity.timestamp}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {achievements.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <Card key={achievement.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center ${achievement.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {achievement.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
