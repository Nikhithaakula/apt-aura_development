
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Plus, Users, Briefcase, MessageSquare, CheckCircle, XCircle, Search, Filter, Pin, Heart, TrendingUp, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Database } from "@/integrations/supabase/types";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const [newPost, setNewPost] = useState("");
  const [userProjects, setUserProjects] = useState<any[]>([]);
  const [userStartups, setUserStartups] = useState<any[]>([]);
  const [projectApplications, setProjectApplications] = useState<any[]>([]);
  const [startupApplications, setStartupApplications] = useState<any[]>([]);
  const [adminProjectRequests, setAdminProjectRequests] = useState<any>({});
  const [adminStartupRequests, setAdminStartupRequests] = useState<any>({});
  const [feedUpdates, setFeedUpdates] = useState<any[]>([]);

  // Fetch user's project memberships AND owned projects
  useEffect(() => {
    if (!user) return;
    const fetchUserProjects = async () => {
      // Get memberships
      const { data: memberships } = await supabase.from("project_members").select("*, project:projects(*)").eq("user_id", user.id);
      // Get owned projects
      const { data: owned } = await supabase.from("projects").select("*").eq("owner_id", user.id);
      // Merge, avoid duplicates (by id)
      const memberProjects = memberships?.map(m => ({ ...m.project, role: m.role_applied, status: m.status, _source: "member" })) || [];
      const ownedProjects = (owned || []).map(p => ({ ...p, role: "admin", status: "approved", _source: "owner" }));
      // Remove owned projects that are already in memberProjects (by id)
      const allProjects = [...memberProjects];
      ownedProjects.forEach(op => {
        if (!allProjects.some(mp => mp.id === op.id)) allProjects.push(op);
      });
      setUserProjects(allProjects);
      setProjectApplications(memberships || []);
    };
    fetchUserProjects();
  }, [user]);

  // Fetch user's startup memberships AND owned startups
  useEffect(() => {
    if (!user) return;
    const fetchUserStartups = async () => {
      // Get memberships
      const { data: memberships } = await supabase.from("startup_members").select("*, startup:startups(*)").eq("user_id", user.id);
      // Get owned startups
      const { data: owned } = await supabase.from("startups").select("*").eq("owner_id", user.id);
      // Merge, avoid duplicates (by id)
      const memberStartups = memberships?.map(m => ({ ...m.startup, role: m.role_applied, status: m.status, _source: "member" })) || [];
      const ownedStartups = (owned || []).map(s => ({ ...s, role: "admin", status: "approved", _source: "owner" }));
      // Remove owned startups that are already in memberStartups (by id)
      const allStartups = [...memberStartups];
      ownedStartups.forEach(os => {
        if (!allStartups.some(ms => ms.id === os.id)) allStartups.push(os);
      });
      setUserStartups(allStartups);
      setStartupApplications(memberships || []);
    };
    fetchUserStartups();
  }, [user]);

  // Fetch admin project join requests
  useEffect(() => {
    if (!user) return;
    const fetchAdminProjectRequests = async () => {
      const { data: owned } = await supabase.from("projects").select("id, title").eq("owner_id", user.id);
      const projectIds = owned?.map(p => p.id) || [];
      if (projectIds.length === 0) return setAdminProjectRequests({});
      const { data: requests } = await supabase.from("project_members").select("*, user:profiles(*), project:projects(title)").in("project_id", projectIds).eq("status", "pending");
      // Group by project
      const grouped = {};
      requests?.forEach(r => {
        const pid = r.project_id;
        if (!grouped[pid]) grouped[pid] = { title: r.project?.title, requests: [] };
        grouped[pid].requests.push(r);
      });
      setAdminProjectRequests(grouped);
    };
    fetchAdminProjectRequests();
  }, [user]);

  // Fetch admin startup join requests
  useEffect(() => {
    if (!user) return;
    const fetchAdminStartupRequests = async () => {
      const { data: owned } = await supabase.from("startups").select("id, name").eq("owner_id", user.id);
      const startupIds = owned?.map(s => s.id) || [];
      if (startupIds.length === 0) return setAdminStartupRequests({});
      const { data: requests } = await supabase.from("startup_members").select("*, user:profiles(*), startup:startups(name)").in("startup_id", startupIds).eq("status", "pending");
      // Group by startup
      const grouped = {};
      requests?.forEach(r => {
        const sid = r.startup_id;
        if (!grouped[sid]) grouped[sid] = { name: r.startup?.name, requests: [] };
        grouped[sid].requests.push(r);
      });
      setAdminStartupRequests(grouped);
    };
    fetchAdminStartupRequests();
  }, [user]);

  // Fetch feed updates
  useEffect(() => {
    const fetchFeed = async () => {
      const { data } = await supabase.from("feed_posts").select("*, author:profiles(full_name, role)").order("created_at", { ascending: false });
      setFeedUpdates(data || []);
    };
    fetchFeed();
  }, []);

  // Post update handler
  const handlePostUpdate = async () => {
    if (!user || !newPost.trim()) return;
    await supabase.from("feed_posts").insert({
      author_id: user.id,
      content: newPost,
      type: "update"
    });
    setNewPost("");
    // Refresh feed
    const { data } = await supabase.from("feed_posts").select("*, author:profiles(full_name, role)").order("created_at", { ascending: false });
    setFeedUpdates(data || []);
  };

  // Approve/reject project application
  const handleProjectDecision = async (id: string, status: "approved" | "rejected") => {
    await supabase.from("project_members").update({ status }).eq("id", id);
    // Refresh admin requests
    if (user) {
      const { data: owned } = await supabase.from("projects").select("id, title").eq("owner_id", user.id);
      const projectIds = owned?.map(p => p.id) || [];
      const { data: requests } = await supabase.from("project_members").select("*, user:profiles(*), project:projects(title)").in("project_id", projectIds).eq("status", "pending");
      const grouped = {};
      requests?.forEach(r => {
        const pid = r.project_id;
        if (!grouped[pid]) grouped[pid] = { title: r.project?.title, requests: [] };
        grouped[pid].requests.push(r);
      });
      setAdminProjectRequests(grouped);
    }
  };

  // Approve/reject startup application
  const handleStartupDecision = async (id: string, status: "approved" | "rejected") => {
    await supabase.from("startup_members").update({ status }).eq("id", id);
    // Refresh admin requests
    if (user) {
      const { data: owned } = await supabase.from("startups").select("id, name").eq("owner_id", user.id);
      const startupIds = owned?.map(s => s.id) || [];
      const { data: requests } = await supabase.from("startup_members").select("*, user:profiles(*), startup:startups(name)").in("startup_id", startupIds).eq("status", "pending");
      const grouped = {};
      requests?.forEach(r => {
        const sid = r.startup_id;
        if (!grouped[sid]) grouped[sid] = { name: r.startup?.name, requests: [] };
        grouped[sid].requests.push(r);
      });
      setAdminStartupRequests(grouped);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Tabs defaultValue="projects" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="projects">My Projects</TabsTrigger>
          <TabsTrigger value="startups">My Startups</TabsTrigger>
          <TabsTrigger value="requests">Admin Requests</TabsTrigger>
          <TabsTrigger value="feed">Feed Updates</TabsTrigger>
        </TabsList>

        {/* My Projects */}
        <TabsContent value="projects" className="space-y-4">
          <h3 className="text-lg font-semibold">Projects & Applications</h3>
          <div className="grid gap-4">
            {userProjects.map((project, i) => (
              <Link key={i} to={`/projects/${project.id}`} className="block group">
                <Card className="group-hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold group-hover:text-blue-700 transition-colors">{project.title}</h4>
                      <Badge variant={project.status === 'approved' ? 'default' : project.status === 'pending' ? 'secondary' : 'destructive'}>
                        {project.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Role: {project.role}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>

        {/* My Startups */}
        <TabsContent value="startups" className="space-y-4">
          <h3 className="text-lg font-semibold">Startups & Applications</h3>
          <div className="grid gap-4">
            {userStartups.map((startup, i) => (
              <Link key={i} to={`/startups/${startup.id}`} className="block group">
                <Card className="group-hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold group-hover:text-blue-700 transition-colors">{startup.name}</h4>
                      <Badge variant={startup.status === 'approved' ? 'default' : startup.status === 'pending' ? 'secondary' : 'destructive'}>
                        {startup.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Role: {startup.role}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>

        {/* Admin Requests */}
        <TabsContent value="requests" className="space-y-4">
          <h3 className="text-lg font-semibold">All Join Requests (Grouped)</h3>
          {/* Project Requests */}
          {Object.keys(adminProjectRequests).length > 0 && (
            <div className="mb-8">
              <h4 className="font-semibold mb-2">Project Join Requests</h4>
              {Object.entries(adminProjectRequests).map(([pid, group]: any) => (
                <Card key={pid} className="mb-2">
                  <CardHeader>
                    <CardTitle>{group.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {group.requests.map((req: any, i: number) => (
                      <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between border-b py-2 last:border-b-0">
                        <div>
                          <div className="font-semibold">
                            {req.user?.full_name || req.user_id}
                            {" "}
                            <a
                              href={`/profile/${req.user_id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 underline ml-2"
                            >
                              View Profile
                            </a>
                          </div>
                          <div className="text-xs text-gray-500">Motivation: {req.motivation}</div>
                          <div className="text-xs text-gray-500">Role: {req.role_applied}</div>
                        </div>
                        <div className="flex gap-2 mt-2 sm:mt-0">
                          <Button size="sm" variant="default" onClick={() => handleProjectDecision(req.id, "approved")}>Approve</Button>
                          <Button size="sm" variant="destructive" onClick={() => handleProjectDecision(req.id, "rejected")}>Reject</Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          {/* Startup Requests */}
          {Object.keys(adminStartupRequests).length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Startup Join Requests</h4>
              {Object.entries(adminStartupRequests).map(([sid, group]: any) => (
                <Card key={sid} className="mb-2">
                  <CardHeader>
                    <CardTitle>{group.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {group.requests.map((req: any, i: number) => (
                      <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between border-b py-2 last:border-b-0">
                        <div>
                          <div className="font-semibold">
                            {req.user?.full_name || req.user_id}
                            {" "}
                            <a
                              href={`/profile/${req.user_id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 underline ml-2"
                            >
                              View Profile
                            </a>
                          </div>
                          <div className="text-xs text-gray-500">Motivation: {req.motivation}</div>
                          <div className="text-xs text-gray-500">Role: {req.role_applied}</div>
                        </div>
                        <div className="flex gap-2 mt-2 sm:mt-0">
                          <Button size="sm" variant="default" onClick={() => handleStartupDecision(req.id, "approved")}>Approve</Button>
                          <Button size="sm" variant="destructive" onClick={() => handleStartupDecision(req.id, "rejected")}>Reject</Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          {Object.keys(adminProjectRequests).length === 0 && Object.keys(adminStartupRequests).length === 0 && (
            <div className="text-gray-500">No pending join requests.</div>
          )}
        </TabsContent>

        {/* Feed Updates */}
        <TabsContent value="feed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Share an Update</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="What's happening with your projects or startups?"
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
            {feedUpdates.map((update, i) => (
              <Card key={update.id || i}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {update.author?.full_name ? update.author.full_name.split(' ').map((n: string) => n[0]).join('') : "?"}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold">{update.author?.full_name || "Unknown"}</span>
                        <Badge variant="outline" className="text-xs">{update.author?.role || "User"}</Badge>
                        <span className="text-sm text-gray-500">{update.created_at ? new Date(update.created_at).toLocaleString() : ""}</span>
                      </div>
                      <p className="text-gray-800 mb-2">{update.content}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
