
import { useState, useEffect } from "react";
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
  TrendingUp, 
  MapPin,
  Calendar,
  Heart,
  ExternalLink,
  Filter
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Database } from "@/integrations/supabase/types";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const stages = ["All Stages", "Pre-Seed", "Seed", "Series A", "Series B+"];
const sectors = ["All Sectors", "CleanTech", "EdTech", "HealthTech", "AgriTech", "CyberSecurity", "Logistics"];

const Startups = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStage, setSelectedStage] = useState("All Stages");
  const [selectedSector, setSelectedSector] = useState("All Sectors");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [startups, setStartups] = useState<Database["public"]["Tables"]["startups"]["Row"][]>([]);
  const [memberships, setMemberships] = useState<Database["public"]["Tables"]["startup_members"]["Row"][]>([]);
  const [selectedStartup, setSelectedStartup] = useState<Database["public"]["Tables"]["startups"]["Row"] | null>(null);
  const [pendingApplications, setPendingApplications] = useState<any[]>([]);
  // Create startup form state
  const [form, setForm] = useState({
    name: "",
    tagline: "",
    description: "",
    mission: "",
    tech_stack: "",
    tools: "",
    sector: "",
    stage: "",
    location: "",
    founded: "",
    requirements: "",
    work_mode: "",
    mediaFiles: [] as File[],
    mediaUrls: [] as string[],
  });
  // Application form state
  const [applyForm, setApplyForm] = useState({
    motivation: "",
    role_applied: "",
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch startups
  useEffect(() => {
    const fetchStartups = async () => {
      const { data, error } = await supabase.from("startups").select("*");
      if (!error && data) setStartups(data);
    };
    fetchStartups();
  }, []);

  // Fetch memberships (for current user and for admin view)
  useEffect(() => {
    if (!user) return;
    const fetchMemberships = async () => {
      const { data, error } = await supabase.from("startup_members").select("*");
      if (!error && data) setMemberships(data);
    };
    fetchMemberships();
  }, [user]);

  // Fetch pending applications for admin
  useEffect(() => {
    if (!user) return;
    const fetchPending = async () => {
      // Find startups owned by user
      const { data: owned, error: err1 } = await supabase.from("startups").select("id").eq("owner_id", user.id);
      if (err1 || !owned) return;
      const startupIds = owned.map(s => s.id);
      if (startupIds.length === 0) return setPendingApplications([]);
      // Find pending applications for these startups
      const { data: pending, error: err2 } = await supabase.from("startup_members").select("*, user:profiles(*)").in("startup_id", startupIds).eq("status", "pending");
      if (!err2 && pending) setPendingApplications(pending);
    };
    fetchPending();
  }, [user, startups]);

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
      const filePath = `startups/${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage.from('media').upload(filePath, file);
      if (!error && data) {
        const { data: publicUrl } = supabase.storage.from('media').getPublicUrl(filePath);
        if (publicUrl?.publicUrl) urls.push(publicUrl.publicUrl);
      }
    }
    return urls;
  };

  // Create startup handler
  const handleCreateStartup = async () => {
    if (!user) return;
    setCreateLoading(true);
    setCreateError(null);
    try {
      const { name, tagline, description, mission, tech_stack, tools, sector, stage, location, founded, requirements, work_mode, mediaFiles } = form;
      let mediaUrls: string[] = [];
      if (mediaFiles.length > 0) {
        mediaUrls = await uploadMedia(mediaFiles);
      }
      const { data: startupData, error: startupError } = await supabase.from("startups").insert({
        name,
        tagline,
        description,
        mission,
        tech_stack: tech_stack.split(",").map(s => s.trim()),
        tools: tools.split(",").map(s => s.trim()),
        sector,
        stage,
        location,
        founded,
        requirements,
        work_mode,
        media: mediaUrls,
        owner_id: user.id,
      }).select().single();
      if (startupError || !startupData) {
        setCreateError(startupError?.message || "Failed to create startup. Please check your input.");
        setCreateLoading(false);
        return;
      }
      await supabase.from("startup_members").insert({
        startup_id: startupData.id,
        user_id: user.id,
        role_applied: "admin",
        motivation: "Startup creator",
        status: "approved",
      });
      setIsCreateModalOpen(false);
      setForm({ name: "", tagline: "", description: "", mission: "", tech_stack: "", tools: "", sector: "", stage: "", location: "", founded: "", requirements: "", work_mode: "", mediaFiles: [], mediaUrls: [] });
      const { data } = await supabase.from("startups").select("*");
      if (data) setStartups(data);
    } catch (err: any) {
      setCreateError(err.message || "Unexpected error occurred.");
    }
    setCreateLoading(false);
  };

  // Apply to startup handler
  const handleApply = async () => {
    if (!user || !selectedStartup) return;
    // Prevent duplicate requests
    const alreadyApplied = memberships.some(m => m.startup_id === selectedStartup.id && m.user_id === user.id);
    if (alreadyApplied) {
      toast({ title: "Already Applied", description: "You have already applied to this startup.", variant: "destructive" });
      return;
    }
    const { motivation, role_applied } = applyForm;
    // Assign admin_id as the startup owner
    const admin_id = selectedStartup.owner_id;
    const { error } = await supabase.from("startup_members").insert({
      startup_id: selectedStartup.id,
      user_id: user.id,
      motivation,
      role_applied,
      status: "pending",
    });
    if (!error) {
      setIsApplyModalOpen(false);
      setApplyForm({ motivation: "", role_applied: "" });
      toast({ title: "Application Submitted", description: "Your request (with your profile link) has been sent to the startup admin." });
    } else {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  // Approve/reject application
  const handleDecision = async (id: string, status: "approved" | "rejected") => {
    await supabase.from("startup_members").update({ status }).eq("id", id);
    // Refresh pending applications
    if (user) {
      const { data: owned } = await supabase.from("startups").select("id").eq("owner_id", user.id);
      const startupIds = owned?.map(s => s.id) || [];
      const { data: pending } = await supabase.from("startup_members").select("*, user:profiles(*)").in("startup_id", startupIds).eq("status", "pending");
      if (pending) setPendingApplications(pending);
    }
  };

  // Filtered startups
  const filteredStartups = startups.filter(startup => {
    const matchesSearch = (startup.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (startup.tagline || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (startup.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (startup.sector || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = selectedStage === "All Stages" || startup.stage === selectedStage;
    const matchesSector = selectedSector === "All Sectors" || startup.sector === selectedSector;
    return matchesSearch && matchesStage && matchesSector;
  });

  // Members for a startup
  const getMembers = (startupId: string) =>
    memberships.filter(m => m.startup_id === startupId && m.status === "approved");

  // Has user applied?
  const hasApplied = (startupId: string) =>
    memberships.some(m => m.startup_id === startupId && m.user_id === user?.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Startups</h1>
          <p className="text-gray-600">Discover innovative startups and join their journey</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={(open) => { setIsCreateModalOpen(open); if (open) setCreateError(null); }}>
          <DialogTrigger asChild>
            <Button className="mt-4 sm:mt-0">
              <Plus className="w-4 h-4 mr-2" />
              Register Startup
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Register New Startup</DialogTitle>
              <p className="text-gray-500 text-sm mt-1">Fill in the details to register your startup. Fields marked * are required.</p>
            </DialogHeader>
            {createError && <div className="text-red-600 text-sm mb-2">{createError}</div>}
            <form className="space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="font-semibold mb-2">Basic Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="name">Startup Name *</Label>
                  <Input id="name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Enter startup name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input id="tagline" value={form.tagline} onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))} placeholder="A short tagline (optional)" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea id="description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe your startup..." rows={3} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mission">Mission / What do you want to achieve?</Label>
                  <Textarea id="mission" value={form.mission} onChange={e => setForm(f => ({ ...f, mission: e.target.value }))} placeholder="Describe the mission or goal of your startup..." rows={2} />
                </div>
              </div>
              <hr />
              {/* Tech & Work */}
              <div>
                <h3 className="font-semibold mb-2">Tech & Work</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tech_stack">Technologies *</Label>
                    <Input id="tech_stack" value={form.tech_stack} onChange={e => setForm(f => ({ ...f, tech_stack: e.target.value }))} placeholder="e.g., React, Node.js, Python" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tools">Tools</Label>
                    <Input id="tools" value={form.tools} onChange={e => setForm(f => ({ ...f, tools: e.target.value }))} placeholder="e.g., Figma, GitHub, Slack" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sector">Sector *</Label>
                    <Input id="sector" value={form.sector} onChange={e => setForm(f => ({ ...f, sector: e.target.value }))} placeholder="e.g., HealthTech, EdTech" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stage">Stage</Label>
                    <Input id="stage" value={form.stage} onChange={e => setForm(f => ({ ...f, stage: e.target.value }))} placeholder="e.g., Seed, Series A" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="work_mode">Preferred Way of Work</Label>
                    <Input id="work_mode" value={form.work_mode} onChange={e => setForm(f => ({ ...f, work_mode: e.target.value }))} placeholder="e.g., Remote, Hybrid, In-person, Async" />
                  </div>
                </div>
              </div>
              <hr />
              {/* Details */}
              <div>
                <h3 className="font-semibold mb-2">Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="e.g., San Francisco, CA" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="founded">Founded</Label>
                    <Input id="founded" value={form.founded} onChange={e => setForm(f => ({ ...f, founded: e.target.value }))} placeholder="e.g., 2023" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="requirements">Requirements</Label>
                    <Input id="requirements" value={form.requirements} onChange={e => setForm(f => ({ ...f, requirements: e.target.value }))} placeholder="e.g., Looking for Backend Developer" />
                  </div>
                </div>
              </div>
              <hr />
              {/* Media */}
              <div>
                <h3 className="font-semibold mb-2">Media</h3>
                <div className="space-y-2">
                  <Label htmlFor="media">Images/Videos (optional)</Label>
                  <Input id="media" type="file" multiple accept="image/*,video/*" onChange={handleMediaChange} />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                <Button type="button" onClick={handleCreateStartup} disabled={createLoading}>
                  {createLoading ? <span className="animate-spin mr-2">⏳</span> : null}
                  Register Startup
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
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
          <Card key={startup.id} className="hover:shadow-lg transition-shadow flex flex-col h-full">
            <CardContent className="p-6 flex flex-col h-full">
              <div className="flex items-center mb-2">
                {startup.logo ? (
                  <img src={startup.logo} alt="logo" className="w-12 h-12 rounded-lg object-cover mr-4 border" />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-white font-bold text-lg">{startup.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold truncate">{startup.name}</h3>
                    <Badge variant="default">{startup.stage}</Badge>
                  </div>
                  <div className="text-xs text-gray-500 flex gap-4 mt-1">
                    {startup.location && <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" />{startup.location}</span>}
                    {startup.founded && <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" />Est. {startup.founded}</span>}
                  </div>
                </div>
              </div>
              {startup.tagline && <div className="text-sm text-gray-600 mb-2 truncate">{startup.tagline}</div>}
              <div className="mb-2">
                <span className="font-semibold text-gray-800">Description: </span>
                <span className="text-gray-700 text-sm line-clamp-3">{startup.description}</span>
              </div>
              {startup.mission && (
                <div className="mb-1"><span className="font-semibold text-gray-800">Mission: </span><span className="text-gray-700 text-sm line-clamp-2">{startup.mission}</span></div>
              )}
              <div className="flex flex-wrap gap-2 text-xs mb-2">
                {Array.isArray(startup.tech_stack) && startup.tech_stack.length > 0 && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{startup.tech_stack.join(", ")}</span>
                )}
                {Array.isArray(startup.tools) && startup.tools.length > 0 && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded">{startup.tools.join(", ")}</span>
                )}
                {startup.work_mode && <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">{startup.work_mode}</span>}
                {startup.sector && <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">{startup.sector}</span>}
                {startup.requirements && <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded">{startup.requirements}</span>}
              </div>
              <div className="flex flex-wrap gap-2 text-xs mb-2">
                {startup.media && startup.media.length > 0 && startup.media.map((url, i) => (
                  url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                    <img key={i} src={url} alt="media" className="w-12 h-12 object-cover rounded" />
                  ) : (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View Video</a>
                  )
                ))}
              </div>
              <div className="flex flex-wrap gap-2 text-xs mb-2">
                <span className="font-semibold text-gray-800">Members:</span>
                {getMembers(startup.id).map((m, i) => (
                  <span key={i} className="bg-gray-100 text-gray-700 px-2 py-1 rounded">{m.user_id === user?.id ? "You" : m.user_id}</span>
                ))}
              </div>
              <div className="flex items-center justify-between mt-auto pt-2">
                <Link to={"/startups/" + startup.id} className="text-blue-600 hover:underline text-sm font-medium">View Startup</Link>
                {user && startup.owner_id !== user.id && !hasApplied(startup.id) && (
                  <Button size="sm" onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedStartup(startup);
                    setIsApplyModalOpen(true);
                  }}>
                    Apply to Join
                  </Button>
                )}
                {user && hasApplied(startup.id) && <span className="text-xs text-blue-500">Applied</span>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Application Modal */}
      <Dialog open={isApplyModalOpen} onOpenChange={setIsApplyModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Apply to Join Startup</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="motivation">Motivation</Label>
              <Textarea id="motivation" value={applyForm.motivation} onChange={e => setApplyForm(f => ({ ...f, motivation: e.target.value }))} placeholder="Why do you want to join?" rows={3} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role Applied For</Label>
              <Input id="role" value={applyForm.role_applied} onChange={e => setApplyForm(f => ({ ...f, role_applied: e.target.value }))} placeholder="e.g., Backend Developer" />
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

export default Startups;
