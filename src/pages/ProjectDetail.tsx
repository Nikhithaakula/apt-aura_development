import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [admin, setAdmin] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [memberships, setMemberships] = useState<any[]>([]);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applyForm, setApplyForm] = useState({ motivation: "", role_applied: "" });
  const { toast } = useToast();

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      setNotFound(false);
      const { data, error } = await supabase.from("projects").select("*").eq("id", id).single();
      if (error || !data) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setProject(data);
      // Fetch admin profile
      if (data.owner_id) {
        const { data: adminData } = await supabase.from("profiles").select("id, full_name, avatar_url").eq("id", data.owner_id).single();
        setAdmin(adminData);
      }
      setLoading(false);
    };
    if (id) fetchProject();
  }, [id]);

  // Fetch memberships for this user
  useEffect(() => {
    if (!user || !id) return;
    const fetchMemberships = async () => {
      const { data, error } = await supabase.from("project_members").select("*").eq("user_id", user.id);
      if (!error && data) setMemberships(data);
    };
    fetchMemberships();
  }, [user, id]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[40vh]"><Loader2 className="w-8 h-8 animate-spin" /></div>
  );
  if (notFound) return (
    <div className="text-center py-16 text-gray-500">Project not found.</div>
  );
  if (!project) return null;

  // Helper: has user applied or is a member?
  const hasAppliedOrMember = user && memberships.some(m => m.project_id === project.id && m.user_id === user.id);

  // Apply handler
  const handleApply = async () => {
    if (!user || !project) return;
    if (hasAppliedOrMember) {
      toast({ title: "Already Applied", description: "You have already applied to this project.", variant: "destructive" });
      return;
    }
    const { motivation, role_applied } = applyForm;
    const admin_id = project.owner_id;
    const profile_link = `/profile/${user.id}`;
    const { error } = await supabase.from("project_members").insert({
      project_id: project.id,
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
      toast({ title: "Application Submitted", description: "Your request has been sent to the project admin." });
    } else {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col items-start gap-1 pb-2">
          <CardTitle className="text-2xl font-bold text-gray-900 mb-0 leading-tight">
            {project.title}
          </CardTitle>
          <div className="flex flex-wrap items-center gap-2 w-full mt-0">
            {project.category && (
              <Badge variant="default" className="text-xs px-1 py-0.5 font-medium bg-gray-50 border-gray-200 text-gray-600">
                {project.category}
              </Badge>
            )}
            {project.status && (
              <Badge variant="default" className="text-xs px-2 py-0.5 font-medium">
                {project.status}
              </Badge>
            )}
            {admin && (
              <>
                <span className="mx-1 text-gray-300">|</span>
                <Link
                  to={`/profile/${admin.id}`}
                  className="text-xs font-semibold text-blue-600 hover:underline z-30 relative"
                >
                  {admin.full_name || 'Admin'}
                </Link>
                <span className="text-xs text-gray-400 ml-1">(Admin)</span>
              </>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4 p-5">
          <div className="text-gray-800 text-justify leading-relaxed">
            <span className="font-semibold">Description: </span>
            {project.description}
          </div>
          {project.goal && (
            <div className="text-gray-700 text-justify text-sm">
              <span className="font-semibold">Goal: </span>
              {project.goal}
            </div>
          )}
          {project.customsections && project.customsections.length > 0 && (
            <div>
              
              <div className="space-y-2">
                {project.customsections.map((section: any, i: number) => (
                  <div key={i}>
                    <span className="font-semibold">{section.title}:</span> {section.content}
                  </div>
                ))}
              </div>
            </div>
          )}
            
          {project.teams && project.teams.length > 0 && (
            <div>
              <div className="font-semibold text-xs text-gray-500 mb-1 mt-4">Teams</div>
              <ul className="list-disc ml-6 space-y-1">
                {project.teams.map((team: any, i: number) => (
                  <li key={i}>
                    <span className="font-semibold">{team.name}:</span> {team.objective}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {project.timeline && project.timeline.length > 0 && (
            <div>
              <div className="font-semibold text-xs text-gray-500 mb-1 mt-4">Timeline</div>
              <ol className="list-decimal ml-6 space-y-1">
                {project.timeline.map((item: any, i: number) => (
                  <li key={i}>
                    <span className="font-semibold">{item.title}:</span> {item.content}
                  </li>
                ))}
              </ol>
            </div>
          )}
          {project.requirements && (
            <div className="text-gray-700 text-justify text-sm">
              <span className="font-semibold">Requirements: </span>
              {project.requirements}
            </div>
          )}
          {project.tech_stack && project.tech_stack.length > 0 && (
            <div>
              <div className="font-semibold text-xs text-gray-500 mb-1">Technologies</div>
              <div className="flex flex-wrap gap-2">
                {project.tech_stack.map((tech: string, i: number) => (
                  <Badge key={i} variant="default">{tech}</Badge>
                ))}
              </div>
            </div>
          )}
          {project.tools && project.tools.length > 0 && (
            <div>
              <div className="font-semibold text-xs text-gray-500 mb-1">Tools</div>
              <div className="flex flex-wrap gap-2">
                {project.tools.map((tool: string, i: number) => (
                  <Badge key={i} variant="default">{tool}</Badge>
                ))}
              </div>
            </div>
          )}
          {project.skills_needed && project.skills_needed.length > 0 && (
            <div>
              <div className="font-semibold text-xs text-gray-500 mb-1">Skills to Learn</div>
              <div className="flex flex-wrap gap-2">
                {project.skills_needed.map((skill: string, i: number) => (
                  <Badge key={i} variant="default">{skill}</Badge>
                ))}
              </div>
            </div>
          )}
          {project.work_mode && (
            <div className="text-gray-700 text-justify text-sm">
              <span className="font-semibold">Work Mode: </span>
              {project.work_mode}
            </div>
          )}
          {project.duration && (
            <div className="text-gray-700 text-justify text-sm">
              <span className="font-semibold">Duration: </span>
              {project.duration}
            </div>
          )}
        
          
          
          {project.media && project.media.length > 0 && (
            <div>
              <div className="font-semibold text-xs text-gray-500 mb-1">Media</div>
              <div className="flex flex-wrap gap-2">
                {project.media.map((url: string, i: number) => {
                  const isVideo = url.match(/\.(mp4|webm|ogg)$/i);
                  return isVideo ? (
                    <video
                      key={i}
                      src={url}
                      controls
                      className="w-full h-100 object-cover rounded border"
                      style={{ background: '#000' }}
                    />
                  ) : (
                    <img
                      key={i}
                      src={url}
                      alt="Project media"
                      className="w-full h-100 object-cover rounded border"
                    />
                  );
                })}
              </div>
            </div>
          )}
          {/* Apply to Join Project button for non-owners */}
          {user && user.id !== project.owner_id && !hasAppliedOrMember && (
            <div className="flex justify-end mt-6">
              <Dialog open={isApplyModalOpen} onOpenChange={setIsApplyModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="default">Apply to Join Project</Button>
                </DialogTrigger>
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
            </div>
          )}
          {/* Edit Project button for owner */}
          {user?.id === project.owner_id && (
            <div className="flex justify-end mt-6">
              <Link to={`/projects/${project.id}/edit`}>
                <button className="px-4 py-1 rounded bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition">
                  Edit Project
                </button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectDetail; 