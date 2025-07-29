
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Calendar, Mail, Link as LinkIcon, Edit, Users, Briefcase, Star, TrendingUp, Award, MessageSquare, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useParams } from "react-router-dom";

// Add a type for the profile data to include all used fields
type ProfileData = {
  id: string;
  full_name: string;
  role: string;
  location?: string;
  website?: string;
  bio?: string;
  statement_of_purpose?: string;
  future_vision?: string;
  short_term_goals?: string;
  long_term_goals?: string;
  field_of_interest?: string;
  true_passion?: string;
  skills?: string[];
  skills_to_learn?: string[];
  interests?: string[];
  resume_url?: string | null;
  created_at?: string;
  avatar_url?: string;
  updated_at?: string;
  stats?: any;
};

const Profile = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<any>({});
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [userProjects, setUserProjects] = useState<any[]>([]);
  const [userActivity, setUserActivity] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [achievementRequests, setAchievementRequests] = useState<any[]>([]);
  const [newAchievement, setNewAchievement] = useState("");
  const [userStartups, setUserStartups] = useState<any[]>([]);

  useEffect(() => {
    const profileId = id || user?.id;
    if (!profileId) return;
    const fetchProfile = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("profiles").select("*").eq("id", profileId).single();
      setProfile(data);
      setForm({
        full_name: data?.full_name ?? "",
        role: data?.role ?? "",
        location: (data as ProfileData)?.location ?? "",
        website: (data as ProfileData)?.website ?? "",
        bio: data?.bio ?? "",
        statement_of_purpose: (data as ProfileData)?.statement_of_purpose ?? "",
        future_vision: (data as ProfileData)?.future_vision ?? "",
        short_term_goals: (data as ProfileData)?.short_term_goals ?? "",
        long_term_goals: (data as ProfileData)?.long_term_goals ?? "",
        field_of_interest: (data as ProfileData)?.field_of_interest ?? "",
        true_passion: (data as ProfileData)?.true_passion ?? "",
        skills: (data as ProfileData)?.skills ?? [],
        skills_to_learn: (data as ProfileData)?.skills_to_learn ?? [],
        interests: (data as ProfileData)?.interests ?? [],
        resume_url: (data as ProfileData)?.resume_url ?? null,
      });
      setResumeUrl((data as any)?.resume_url || null);
      setLoading(false);
    };
    fetchProfile();
  }, [user, id]);

  useEffect(() => {
    if (!user) return;
    // Fetch user profile (already present)
    // Fetch user projects
    const fetchUserProjects = async () => {
      const { data: memberships } = await supabase
        .from("project_members")
        .select("*, project:projects(*)")
        .eq("user_id", user.id)
        .eq("status", "approved");
      setUserProjects(memberships?.map(m => m.project) || []);
    };
    fetchUserProjects();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    // Fetch user activity (feed posts, applications, approvals, etc.)
    const fetchUserActivity = async () => {
      const { data: posts } = await supabase
        .from("feed_posts")
        .select("*")
        .eq("author_id", user.id)
        .order("created_at", { ascending: false });
      // You can add more activity types here (e.g., project applications, approvals)
      setUserActivity(posts || []);
    };
    fetchUserActivity();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    // Fetch approved achievements
    const fetchAchievements = async () => {
      const { data, error } = await supabase
        .from("achievement_requests" as any)
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "approved");
      if (error) {
        console.error("Error fetching achievements:", error);
        setAchievements([]);
      } else {
        setAchievements(data || []);
      }
    };
    // Fetch pending requests (for admins, or for user to see their own requests)
    const fetchRequests = async () => {
      const { data, error } = await supabase
        .from("achievement_requests" as any)
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "pending");
      setAchievementRequests(data || []);
    };
    fetchAchievements();
    fetchRequests();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    // Fetch user startups
    const fetchUserStartups = async () => {
      const { data: memberships } = await supabase
        .from("startup_members")
        .select("*, startup:startups(*)")
        .eq("user_id", user.id)
        .eq("status", "approved");
      setUserStartups(memberships?.map(m => m.startup) || []);
    };
    fetchUserStartups();
  }, [user]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((f: any) => ({ ...f, [name]: value }));
  };

  const handleSkillsChange = (e: any) => {
    setForm((f: any) => ({ ...f, skills: e.target.value.split(",").map((s: string) => s.trim()) }));
  };
  const handleSkillsToLearnChange = (e: any) => {
    setForm((f: any) => ({ ...f, skills_to_learn: e.target.value.split(",").map((s: string) => s.trim()) }));
  };
  const handleInterestsChange = (e: any) => {
    setForm((f: any) => ({ ...f, interests: e.target.value.split(",").map((s: string) => s.trim()) }));
  };

  const handleResumeChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    let uploadedResumeUrl = resumeUrl;
    if (resumeFile) {
      const filePath = `resumes/${user.id}_${Date.now()}_${resumeFile.name}`;
      const { data, error } = await supabase.storage.from('media').upload(filePath, resumeFile);
      if (!error && data) {
        const { data: publicUrl } = supabase.storage.from('media').getPublicUrl(filePath);
        uploadedResumeUrl = publicUrl?.publicUrl || null;
      }
    }
    const updateData = {
      ...form,
      skills: form.skills,
      skills_to_learn: form.skills_to_learn,
      interests: form.interests,
      resume_url: uploadedResumeUrl,
    };
    await supabase.from("profiles").update(updateData).eq("id", user.id);
    setIsEditing(false);
    setResumeUrl(uploadedResumeUrl);
    setSaving(false);
    // Refresh profile
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    setProfile(data);
  };

  const canEdit = !id || (id === user?.id);

  if (loading) return <div className="text-center py-12 text-gray-500">Loading profile...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-2xl">
                  {form.full_name?.split(' ').map((n: string) => n[0]).join('')}
                </span>
              </div>
              <div>
                {canEdit ? (
                  <input name="full_name" value={form.full_name} onChange={handleChange} className="text-3xl font-bold text-gray-900 mb-2 bg-gray-100 rounded px-2 py-1" />
                ) : (
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{form.full_name}</h1>
                )}
                {canEdit ? (
                  <input name="role" value={form.role} onChange={handleChange} className="text-xl text-gray-600 mb-3 bg-gray-100 rounded px-2 py-1" />
                ) : (
                  <p className="text-xl text-gray-600 mb-3">{form.role}</p>
                )}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {canEdit ? (
                      <input name="location" value={form.location} onChange={handleChange} className="bg-gray-100 rounded px-2 py-1" />
                    ) : (
                      <span>{form.location}</span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Joined {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "-"}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    {canEdit ? (
                      <span>{user.email}</span>
                    ) : (
                      <>
                        <span className="text-gray-400 italic mr-2">user@hidden.com</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            alert("Email request sent! The user will be notified.");
                          }}
                        >
                          Request Email
                        </Button>
                      </>
                    )}
                  </div>
                  <div className="flex items-center">
                    <LinkIcon className="w-4 h-4 mr-1" />
                    {canEdit ? (
                      <input name="website" value={form.website} onChange={handleChange} className="bg-gray-100 rounded px-2 py-1" />
                    ) : (
                      <span>{form.website}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex space-x-3 lg:ml-auto">
              {canEdit && (
                <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                  <Edit className="w-4 h-4 mr-2" />
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
              )}
              <Button>
                <MessageSquare className="w-4 h-4 mr-2" />
                Message
              </Button>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200">
            {canEdit ? (
              <textarea name="Think like a cover letter but write your heart out in professional space " value={form.bio} onChange={handleChange} className="w-full bg-gray-100 rounded px-2 py-1" rows={3} placeholder="Your bio..." />
            ) : (
              <p className="text-gray-700 leading-relaxed">{form.bio}</p>
            )}
          </div>
          {/* Statement of Purpose, Vision, Goals, Passion */}
          <div className="mt-6 grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Statement of Purpose</h3>
              {canEdit ? (
                <textarea name="statement_of_purpose" value={form.statement_of_purpose} onChange={handleChange} className="w-full bg-gray-100 rounded px-2 py-1" rows={2} placeholder="Why are you here?" />
              ) : (
                <p className="text-gray-700">{form.statement_of_purpose}</p>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Future Vision</h3>
              {canEdit ? (
                <textarea name="future_vision" value={form.future_vision} onChange={handleChange} className="w-full bg-gray-100 rounded px-2 py-1" rows={2} placeholder="How do you see yourself in the future?" />
              ) : (
                <p className="text-gray-700">{form.future_vision}</p>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Short Term Goals</h3>
              {canEdit ? (
                <textarea name="short_term_goals" value={form.short_term_goals} onChange={handleChange} className="w-full bg-gray-100 rounded px-2 py-1" rows={2} placeholder="Your short term goals..." />
              ) : (
                <p className="text-gray-700">{form.short_term_goals}</p>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Long Term Goals</h3>
              {canEdit ? (
                <textarea name="long_term_goals" value={form.long_term_goals} onChange={handleChange} className="w-full bg-gray-100 rounded px-2 py-1" rows={2} placeholder="Your long term goals..." />
              ) : (
                <p className="text-gray-700">{form.long_term_goals}</p>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Field of Interest</h3>
              {canEdit ? (
                <input name="field_of_interest" value={form.field_of_interest} onChange={handleChange} className="w-full bg-gray-100 rounded px-2 py-1" placeholder="e.g. AI, Sustainability, EdTech..." />
              ) : (
                <p className="text-gray-700">{form.field_of_interest}</p>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">True Passion</h3>
              {canEdit ? (
                <input name="true_passion" value={form.true_passion} onChange={handleChange} className="w-full bg-gray-100 rounded px-2 py-1" placeholder="What drives you?" />
              ) : (
                <p className="text-gray-700">{form.true_passion}</p>
              )}
            </div>
          </div>
          {/* Skills and Interests */}
          <div className="mt-6 grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Skills</h3>
              {canEdit ? (
                <input name="skills" value={form.skills?.join(", ") || ""} onChange={handleSkillsChange} className="w-full bg-gray-100 rounded px-2 py-1" placeholder="e.g. React, Node.js, Python..." />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {form.skills?.map((skill: string) => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Skills to Learn</h3>
              {canEdit ? (
                <input name="skills_to_learn" value={form.skills_to_learn?.join(", ") || ""} onChange={handleSkillsToLearnChange} className="w-full bg-gray-100 rounded px-2 py-1" placeholder="e.g. Go, Rust, Blockchain..." />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {form.skills_to_learn?.map((skill: string) => (
                    <Badge key={skill} variant="outline">{skill}</Badge>
                  ))}
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Interests</h3>
              {canEdit ? (
                <input name="interests" value={form.interests?.join(", ") || ""} onChange={handleInterestsChange} className="w-full bg-gray-100 rounded px-2 py-1" placeholder="e.g. Sustainability, Open Source..." />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {form.interests?.map((interest: string) => (
                    <Badge key={interest} variant="outline">{interest}</Badge>
                  ))}
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Resume</h3>
              {canEdit ? (
                <div className="flex items-center gap-2">
                  <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeChange} />
                  {resumeUrl && (
                    <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline flex items-center"><Upload className="w-4 h-4 mr-1" />View Current</a>
                  )}
                </div>
              ) : resumeUrl ? (
                <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline flex items-center"><Upload className="w-4 h-4 mr-1" />View Resume</a>
              ) : (
                <span className="text-gray-500">No resume uploaded</span>
              )}
            </div>
          </div>
          {canEdit && (
            <div className="flex justify-end mt-6">
              <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {profile?.stats?.projectsCompleted || 0}
            </div>
            <div className="text-sm text-gray-600">Projects Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {profile?.stats?.collaborations || 0}
            </div>
            <div className="text-sm text-gray-600">Collaborations</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {profile?.stats?.contributions || 0}
            </div>
            <div className="text-sm text-gray-600">Contributions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {profile?.stats?.followers || 0}
            </div>
            <div className="text-sm text-gray-600">Followers</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Sections */}
      <Tabs defaultValue="projects" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="startups">Startups</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-4">
          <div className="grid gap-4">
            {userProjects.length === 0 ? (
              <div className="text-gray-500">No projects yet.</div>
            ) : userProjects.map((project: any) => (
              <Card key={project.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{project.title}</h3>
                      <p className="text-sm text-gray-600">{project.description}</p>
                    </div>
                    <Badge variant="outline">{project.status}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="startups" className="space-y-4">
          <div className="grid gap-4">
            {userStartups.length === 0 ? (
              <div className="text-gray-500">No startups yet.</div>
            ) : userStartups.map((startup: any) => (
              <Card key={startup.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{startup.name}</h3>
                      <p className="text-sm text-gray-600">{startup.description}</p>
                    </div>
                    <Badge variant="outline">{startup.status}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <div className="space-y-4">
            {userActivity.length === 0 ? (
              <div className="text-gray-500">No activity yet.</div>
            ) : userActivity.map((activity: any) => (
              <Card key={activity.id}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-gray-900">{activity.content}</p>
                      <p className="text-sm text-gray-500 mt-1">{activity.created_at ? new Date(activity.created_at).toLocaleString() : ""}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="mb-4">
            <input
              type="text"
              value={newAchievement}
              onChange={e => setNewAchievement(e.target.value)}
              placeholder="Request a new achievement (e.g., skill, milestone, task)"
              className="w-full bg-gray-100 rounded px-2 py-1 mb-2"
            />
            <Button onClick={async () => {
              if (!newAchievement.trim()) return;
              await supabase.from("achievement_requests").insert({
                user_id: user.id,
                title: newAchievement.trim(),
                description: newAchievement.trim(),
                status: "pending"
              });
              setNewAchievement("");
              // Refresh requests
              const { data } = await supabase
                .from("achievement_requests")
                .select("*")
                .eq("user_id", user.id)
                .eq("status", "pending");
              setAchievementRequests(data || []);
            }}>Request Achievement</Button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {achievements.length === 0 ? (
              <div className="text-gray-500">No achievements yet.</div>
            ) : achievements.map((achievement: any) => (
              <Card key={achievement.id}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-blue-500">
                      <Star className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{achievement.description}</h3>
                      <p className="text-sm text-gray-600">Requested on {achievement.created_at ? new Date(achievement.created_at).toLocaleDateString() : ""}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {achievementRequests.length > 0 && (
            <div className="mt-6">
              <h4 className="font-semibold mb-2">Pending Achievement Requests</h4>
              <div className="space-y-2">
                {achievementRequests.map((req: any) => (
                  <Card key={req.id}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <span>{req.description}</span>
                      <Badge variant="secondary">Pending</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
