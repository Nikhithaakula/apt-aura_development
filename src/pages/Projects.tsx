
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Search, Plus, Users, Calendar, Filter, MapPin, Clock, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Database } from "@/integrations/supabase/types";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const categories = ["All", "Technology", "Healthcare", "Education", "Environmental", "Agriculture"];

const Projects = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [projects, setProjects] = useState<Database["public"]["Tables"]["projects"]["Row"][]>([]);
  const [memberships, setMemberships] = useState<Database["public"]["Tables"]["project_members"]["Row"][]>([]);
  const [selectedProject, setSelectedProject] = useState<Database["public"]["Tables"]["projects"]["Row"] | null>(null);
  const [pendingApplications, setPendingApplications] = useState<any[]>([]);
  // Create project form state
  const [form, setForm] = useState({
    title: "",
    description: "",
    goal: "",
    skills_needed: "",
    tech_stack: "",
    tools: "",
    duration: "",
    category: "",
    work_mode: "",
    mediaFiles: [] as File[],
    mediaUrls: [] as string[],
  });
  // Application form state
  const [applyForm, setApplyForm] = useState({
    motivation: "",
    role_applied: "",
  });
  const { toast } = useToast();
  const [adminProfiles, setAdminProfiles] = useState<{ [id: string]: any }>({});

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase.from("projects").select("*");
      if (!error && data) setProjects(data);
    };
    fetchProjects();
  }, []);

  // Fetch memberships (for current user and for admin view)
  useEffect(() => {
    if (!user) return;
    const fetchMemberships = async () => {
      const { data, error } = await supabase.from("project_members").select("*");
      if (!error && data) setMemberships(data);
    };
    fetchMemberships();
  }, [user]);

  // Fetch pending applications for admin
  useEffect(() => {
    if (!user) return;
    const fetchPending = async () => {
      // Find projects owned by user
      const { data: owned, error: err1 } = await supabase.from("projects").select("id").eq("owner_id", user.id);
      if (err1 || !owned) return;
      const projectIds = owned.map(p => p.id);
      if (projectIds.length === 0) return setPendingApplications([]);
      // Find pending applications for these projects
      const { data: pending, error: err2 } = await supabase.from("project_members").select("*, user:profiles(*)").in("project_id", projectIds).eq("status", "pending");
      if (!err2 && pending) setPendingApplications(pending);
    };
    fetchPending();
  }, [user, projects]);

  // Fetch admin (owner) profiles for all projects
  useEffect(() => {
    const fetchAdmins = async () => {
      const ownerIds = Array.from(new Set(projects.map(p => p.owner_id).filter(Boolean)));
      if (ownerIds.length === 0) return;
      const { data, error } = await supabase.from("profiles").select("id, full_name, avatar_url").in("id", ownerIds);
      if (!error && data) {
        const map: { [id: string]: any } = {};
        data.forEach((profile: any) => { map[profile.id] = profile; });
        setAdminProfiles(map);
      }
    };
    fetchAdmins();
  }, [projects]);

  // Media upload handler
  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setForm(f => ({ ...f, mediaFiles: Array.from(e.target.files) }));
    }
  };

  // Upload files to Supabase Storage and return URLs
  const uploadMedia = async (files: File[]) => {
    const urls: string[] = [];
    for (const file of files) {
      const filePath = `projects/${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage.from('media').upload(filePath, file);
      if (!error && data) {
        // Always get the public URL
        const { data: publicUrl } = supabase.storage.from('media').getPublicUrl(filePath);
        if (publicUrl?.publicUrl) urls.push(publicUrl.publicUrl);
      }
    }
    return urls;
  };

  // Create project handler
  const handleCreateProject = async () => {
    if (!user) return;
    const { title, description, goal, skills_needed, tech_stack, tools, duration, category, work_mode, mediaFiles } = form;
    let mediaUrls: string[] = [];
    if (mediaFiles.length > 0) {
      mediaUrls = await uploadMedia(mediaFiles);
    }
    // Insert project and get the new project id
    const { data: projectData, error: projectError } = await supabase.from("projects").insert({
      title,
      description,
      goal,
      skills_needed: skills_needed.split(",").map(s => s.trim()),
      tech_stack: tech_stack.split(",").map(s => s.trim()),
      tools: tools.split(",").map(s => s.trim()),
      duration,
      category,
      work_mode,
      media: mediaUrls,
      owner_id: user.id,
    }).select().single();
    if (!projectError && projectData) {
      // Add creator as approved member (admin)
      await supabase.from("project_members").insert({
        project_id: projectData.id,
        user_id: user.id,
        role_applied: "admin",
        motivation: "Project creator",
        status: "approved",
      });
      setIsCreateModalOpen(false);
      setForm({ title: "", description: "", goal: "", skills_needed: "", tech_stack: "", tools: "", duration: "", category: "", work_mode: "", mediaFiles: [], mediaUrls: [] });
      // Refresh projects
      const { data } = await supabase.from("projects").select("*");
      if (data) setProjects(data);
    }
  };

  // Apply to project handler
  const handleApply = async () => {
    if (!user || !selectedProject) return;
    // Prevent duplicate requests
    const alreadyApplied = memberships.some(m => m.project_id === selectedProject.id && m.user_id === user.id);
    if (alreadyApplied) {
      toast({ title: "Already Applied", description: "You have already applied to this project.", variant: "destructive" });
      return;
    }
    const { motivation, role_applied } = applyForm;
    const admin_id = selectedProject.owner_id;
    const profile_link = `/profile/${user.id}`;
    const { error } = await supabase.from("project_members").insert({
      project_id: selectedProject.id,
      user_id: user.id,
      motivation,
      role_applied,
      status: "pending",
      admin_id,
      profile_link,
    });
    if (!error) {
      setIsApplyModalOpen(false);
      setApplyForm({ motivation: "", role_applied: "" });
      toast({ title: "Application Submitted", description: "Your request (with your profile link) has been sent to the project admin." });
    } else {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  // Approve/reject application
  const handleDecision = async (id: string, status: "approved" | "rejected") => {
    await supabase.from("project_members").update({ status }).eq("id", id);
    // Refresh pending applications
    if (user) {
      const { data: owned } = await supabase.from("projects").select("id").eq("owner_id", user.id);
      const projectIds = owned?.map(p => p.id) || [];
      const { data: pending } = await supabase.from("project_members").select("*, user:profiles(*)").in("project_id", projectIds).eq("status", "pending");
      if (pending) setPendingApplications(pending);
    }
  };

  // Filtered projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.skills_needed || []).some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || project.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Members for a project
  const getMembers = (projectId: string) =>
    memberships.filter(m => m.project_id === projectId && m.status === "approved");

  // Has user applied?
  const hasApplied = (projectId: string) =>
    memberships.some(m => m.project_id === projectId && m.user_id === user?.id);

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
                <Input id="title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Enter project title" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe your project..." rows={4} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal">What do you want to achieve?</Label>
                <Textarea id="goal" value={form.goal} onChange={e => setForm(f => ({ ...f, goal: e.target.value }))} placeholder="Describe the mission or goal of your project..." rows={2} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tech_stack">Technologies to be used</Label>
                <Input id="tech_stack" value={form.tech_stack} onChange={e => setForm(f => ({ ...f, tech_stack: e.target.value }))} placeholder="e.g., React, Node.js, Python (comma separated)" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tools">Tools</Label>
                <Input id="tools" value={form.tools} onChange={e => setForm(f => ({ ...f, tools: e.target.value }))} placeholder="e.g., Figma, GitHub, Slack (comma separated)" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="work_mode">Preferred Way of Work</Label>
                <Input id="work_mode" value={form.work_mode} onChange={e => setForm(f => ({ ...f, work_mode: e.target.value }))} placeholder="e.g., Remote, Hybrid, In-person, Async" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="media">Images/Videos (optional)</Label>
                <Input id="media" type="file" multiple accept="image/*,video/*" onChange={handleMediaChange} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input id="duration" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="e.g., 3 months" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="e.g., Technology" />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateProject}>
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
        {filteredProjects.map((project: any) => {
          // Use first image in media as background if available
          const bgImage = (project.media && project.media.length > 0 && project.media[0].match(/\.(jpg|jpeg|png|gif|webp)$/i)) ? project.media[0] : null;
          // Helper to truncate text
          const truncate = (text: string, n: number) => text && text.length > n ? text.slice(0, n) + '…' : text;
          return (
            <Card key={project.id} className="mb-8 shadow-lg">
              <CardHeader className="relative z-20 flex flex-col items-start gap-1 pb-2">
                <CardTitle className="text-xl font-bold text-gray-900 mb-0 leading-tight">
                  {project.title}
                </CardTitle>
                <div className="flex flex-wrap items-center gap-2 w-full mt-0">
                  {project.category && (
                    <Badge variant="outline" className="text-xs px-1 py-0.5 font-medium bg-gray-50 border-gray-200 text-gray-600">
                      {project.category}
                    </Badge>
                  )}
                  {project.status && (
                    <Badge variant="secondary" className="text-xs px-2 py-0.5 font-medium">
                      {project.status}
                    </Badge>
                  )}
                  {project.owner_id && adminProfiles[project.owner_id] && (
                    <>
                      <span className="mx-1 text-gray-300">|</span>
                      <Link
                        to={`/profile/${project.owner_id}`}
                        className="text-xs font-semibold text-blue-600 hover:underline z-30 relative"
                        style={{ pointerEvents: 'auto' }}
                        onClick={e => e.stopPropagation()}
                      >
                        {adminProfiles[project.owner_id].full_name || 'Admin'}
                      </Link>
                      <span className="text-xs text-gray-400 ml-1">(Admin)</span>
                    </>
                  )}
                </div>
              </CardHeader>
              <CardContent className="relative z-20 space-y-1 p-5 flex-1 flex flex-col justify-between mt-0">
                <div className="text-gray-800 text-justify leading-relaxed min-h-[60px] mt-0">
                  <span className="font-semibold">Description: </span>
                  {truncate(project.description, 350)}
                </div>
                {project.goal && (
                  <div className="text-gray-700 text-justify text-sm min-h-[32px] mt-0">
                    <span className="font-semibold">Goal: </span>
                    {truncate(project.goal, 200)}
                  </div>
                )}
                {project.requirements && (
                  <div className="text-gray-700 text-justify text-sm min-h-[32px] mt-0">
                    <span className="font-semibold">Req: </span>
                    {truncate(project.requirements, 80)}
                  </div>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  <div className="font-semibold text-xs text-gray-500 mb-1">Skills to Learn</div>
                  {(project.skills_needed || []).map((skill: string, i: number) => (
                    <Badge key={i} variant="secondary">{skill}</Badge>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                  <span>{memberships.filter(m => m.project_id === project.id && m.status === 'approved').length} members</span>
                  <span>{project.duration}</span>
                  <span>{project.category}</span>
                </div>
                <div className="flex justify-end mt-4">
                  <Link to={`/projects/${project.id}`}>
                    <button className="px-4 py-1 rounded bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition">View Project</button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {/* Application Modal */}
      <Dialog open={isApplyModalOpen} onOpenChange={setIsApplyModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Apply to Join Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="motivation">Motivation</Label>
              <Textarea id="motivation" value={applyForm.motivation} onChange={e => setApplyForm(f => ({ ...f, motivation: e.target.value }))} placeholder="Why do you want to join?" rows={3} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role Applied For</Label>
              <Input id="role" value={applyForm.role_applied} onChange={e => setApplyForm(f => ({ ...f, role_applied: e.target.value }))} placeholder="e.g., Frontend Developer" />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsApplyModalOpen(false)}>Cancel</Button>
              <Button onClick={handleApply}>Submit Application</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Admin: Pending Applications */}
      {user && pendingApplications.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">Pending Applications (Admin)</h2>
          <div className="space-y-4">
            {pendingApplications.map((app, i) => (
              <div key={i} className="border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between">
                <div>
                  <div className="font-semibold">Applicant: {app.user?.full_name || app.user_id}</div>
                  <div className="text-xs text-gray-500">Motivation: {app.motivation}</div>
                  <div className="text-xs text-gray-500">Role: {app.role_applied}</div>
                </div>
                <div className="flex gap-2 mt-2 sm:mt-0">
                  <Button size="sm" variant="default" onClick={() => handleDecision(app.id, "approved")}>Approve</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDecision(app.id, "rejected")}>Reject</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
