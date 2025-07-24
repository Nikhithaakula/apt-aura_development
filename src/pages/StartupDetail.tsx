import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const StartupDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [startup, setStartup] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [memberships, setMemberships] = useState<any[]>([]);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applyForm, setApplyForm] = useState({ motivation: "", role_applied: "" });
  const { toast } = useToast();

  useEffect(() => {
    const fetchStartup = async () => {
      const { data } = await supabase.from("startups").select("*").eq("id", id).single();
      setStartup(data);
      const { data: memberData } = await supabase.from("startup_members").select("*, user:profiles(full_name)").eq("startup_id", id).eq("status", "approved");
      setMembers(memberData || []);
    };
    fetchStartup();
  }, [id]);

  // Fetch memberships for this user
  useEffect(() => {
    if (!user || !id) return;
    const fetchMemberships = async () => {
      const { data, error } = await supabase.from("startup_members").select("*").eq("user_id", user.id);
      if (!error && data) setMemberships(data);
    };
    fetchMemberships();
  }, [user, id]);

  if (!startup) return <div className="p-8">Loading...</div>;

  // Helper: has user applied or is a member?
  const hasAppliedOrMember = user && memberships.some(m => m.startup_id === startup.id && m.user_id === user.id);

  // Apply handler
  const handleApply = async () => {
    if (!user || !startup) return;
    if (hasAppliedOrMember) {
      toast({ title: "Already Applied", description: "You have already applied to this startup.", variant: "destructive" });
      return;
    }
    const { motivation, role_applied } = applyForm;
    const admin_id = startup.owner_id;
    const profile_link = `/profile/${user.id}`;
    const { error } = await supabase.from("startup_members").insert({
      startup_id: startup.id,
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
      toast({ title: "Application Submitted", description: "Your request has been sent to the startup admin." });
    } else {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Button asChild variant="outline" className="mb-4"><Link to="/startups">Back to Startups</Link></Button>
      <Card className="shadow-lg">
        {/* Header */}
        <div className="flex items-center gap-4 p-6 border-b bg-gradient-to-r from-blue-50 to-green-50 rounded-t-2xl">
          {startup.logo ? (
            <img src={startup.logo} alt="logo" className="w-14 h-14 rounded-lg object-cover border" />
          ) : (
            <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center text-white font-bold text-2xl">
              {startup.name.split(' ').map((n: string) => n[0]).join('')}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold truncate text-gray-900">{startup.name}</h1>
              <Badge variant="default">{startup.stage}</Badge>
            </div>
            <div className="flex gap-2 mt-1 text-xs text-gray-500">
              {startup.sector && <Badge variant="secondary">{startup.sector}</Badge>}
              {startup.location && <span>{startup.location}</span>}
              {startup.founded && <span>Est. {startup.founded}</span>}
            </div>
          </div>
        </div>
        <CardContent className="space-y-6 p-6">
          {startup.tagline && <div className="text-lg text-gray-700 font-semibold">{startup.tagline}</div>}
          {startup.website && (
            <div className="mb-2">
              <a href={startup.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                {startup.website}
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 3h7m0 0v7m0-7L10 14m-4 0h4v4" /></svg>
              </a>
            </div>
          )}
          <div>
            <div className="font-semibold text-gray-800 mb-1">Description</div>
            <div className="text-gray-700 text-base whitespace-pre-line text-justify">{startup.description}</div>
          </div>
          {startup.mission && (
            <div>
              <div className="font-semibold text-gray-800 mb-1">Mission</div>
              <div className="text-gray-700 text-base whitespace-pre-line text-justify">{startup.mission}</div>
            </div>
          )}
           {/* Requirements Section */}
           {startup.requirements && (
            <div>
              <div className="font-semibold text-gray-800 mb-1">Requirements</div>
              <div className="text-gray-700 text-sm text-justify whitespace-pre-line">{startup.requirements}</div>
            </div>
          )}

           {/* Custom Sections */}
           {startup.customsections && startup.customsections.length > 0 && (
            <div>
              <div className="font-semibold text-xs text-gray-500 mb-1 mt-4">Additional Sections</div>
              <div className="space-y-2 text-gray-700 text-sm">
                {startup.customsections.map((section: any, i: number) => (
                  <div key={i} className="text-justify"><span className="font-semibold">{section.title}:</span> {section.content}</div>
                ))}
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="font-semibold text-xs text-gray-500 mb-1">Technologies</div>
              <div className="flex flex-wrap gap-2 mb-2">{(startup.tech_stack || []).map((tech: string, i: number) => (<Badge key={i} variant="default">{tech}</Badge>))}</div>
            </div>
            <div>
              <div className="font-semibold text-xs text-gray-500 mb-1">Tools</div>
              <div className="flex flex-wrap gap-2 mb-2">{(startup.tools || []).map((tool: string, i: number) => (<Badge key={i} variant="secondary">{tool}</Badge>))}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="font-semibold text-xs text-gray-500 mb-1">Work Mode</div>
              <div className="text-gray-700 text-sm">{startup.work_mode}</div>
            </div>
          </div>
         
          <hr />
          {/* Timeline Section */}
          {startup.timeline && startup.timeline.length > 0 && (
            <div>
              <div className="font-semibold text-xs text-gray-500 mb-1 mt-4">Timeline</div>
              <ol className="list-decimal ml-6 space-y-1 text-gray-700 text-sm">
                {startup.timeline.map((item: any, i: number) => (
                  <li key={i} className="text-justify"><span className="font-semibold">{item.title}:</span> {item.content}</li>
                ))}
              </ol>
            </div>
          )}
          {/* Teams Section */}
          {startup.teams && startup.teams.length > 0 && (
            <div>
              <div className="font-semibold text-xs text-gray-500 mb-1 mt-4">Teams</div>
              <ul className="list-disc ml-6 space-y-1 text-gray-700 text-sm">
                {startup.teams.map((team: any, i: number) => (
                  <li key={i} className="text-justify"><span className="font-semibold">{team.name}:</span> {team.objective}</li>
                ))}
              </ul>
            </div>
          )}
         
          {/* Media Section */}
          {startup.media && startup.media.length > 0 && (
            <div>
              <div className="font-semibold text-xs text-gray-500 mb-1">Media</div>
              <div className="flex flex-wrap gap-2">
                {startup.media.map((url: string, i: number) => {
                  const isVideo = url.match(/\.(mp4|webm|ogg)$/i);
                  return isVideo ? (
                    <video key={i} src={url} controls className="w-32 h-24 object-cover rounded border bg-black" />
                  ) : (
                    <img key={i} src={url} alt="Startup media" className="w-32 h-24 object-cover rounded border" />
                  );
                })}
              </div>
            </div>
          )}
          {/* Members */}
          <div>
            <div className="font-semibold text-xs text-gray-500 mb-1">Members</div>
            <div className="flex flex-wrap gap-2">
              {members.map((m, i) => (
                <span key={i} className="bg-gray-100 text-gray-700 px-2 py-1 rounded">{m.user?.full_name || m.user_id}</span>
              ))}
            </div>
          </div>
          {/* Apply to Join Startup button for non-owners */}
          {user && user.id !== startup.owner_id && !hasAppliedOrMember && (
            <div className="flex justify-end mt-6">
              <Dialog open={isApplyModalOpen} onOpenChange={setIsApplyModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="default">Apply to Join Startup</Button>
                </DialogTrigger>
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
          {/* Edit Startup button for owner */}
          {user?.id === startup.owner_id && (
            <Button className="mt-4" onClick={() => navigate(`/startups/${id}/edit`)}>Edit Startup</Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StartupDetail; 