import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const defaultSection = { title: "", content: "" };
const defaultTeam = { name: "", objective: "" };

const ProjectEdit = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    goal: "",
    requirements: "",
    tech_stack: "",
    tools: "",
    work_mode: "",
    duration: "",
    category: "",
    skills_needed: "",
    media: [] as string[],
    mediaFiles: [] as File[],
    timeline: [] as { title: string; content: string }[],
    teams: [] as { name: string; objective: string }[],
    customsections: [] as { title: string; content: string }[],
  });

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      setError("");
      const { data, error } = await supabase.from("projects").select("*").eq("id", id).single();
      if (error || !data) {
        setError("Project not found");
        setLoading(false);
        return;
      }
      setForm(f => ({
        ...f,
        ...data,
        requirements: (data as any).requirements || "",
        tech_stack: Array.isArray(data.tech_stack) ? data.tech_stack.join(", ") : (data.tech_stack || ""),
        tools: Array.isArray(data.tools) ? data.tools.join(", ") : (data.tools || ""),
        skills_needed: Array.isArray(data.skills_needed) ? data.skills_needed.join(", ") : (data.skills_needed || ""),
        timeline: (data as any).timeline || [],
        teams: (data as any).teams || [],
        customsections: (data as any).customsections || [],
        media: data.media || [],
      }));
      setLoading(false);
    };
    fetchProject();
  }, [id]);

  const handleInput = (e: any) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setForm(f => ({ ...f, mediaFiles: Array.from(e.target.files) }));
    }
  };

  const handleSectionChange = (idx: number, field: string, value: string, key: "timeline" | "customsections") => {
    setForm(f => ({
      ...f,
      [key]: f[key].map((s, i) => i === idx ? { ...s, [field]: value } : s),
    }));
  };

  const handleTeamChange = (idx: number, field: string, value: string) => {
    setForm(f => ({
      ...f,
      teams: f.teams.map((t, i) => i === idx ? { ...t, [field]: value } : t),
    }));
  };

  const addSection = (key: "timeline" | "customsections") => {
    setForm(f => ({ ...f, [key]: [...f[key], { ...defaultSection }] }));
  };
  const removeSection = (idx: number, key: "timeline" | "customsections") => {
    setForm(f => ({ ...f, [key]: f[key].filter((_, i) => i !== idx) }));
  };
  const addTeam = () => {
    setForm(f => ({ ...f, teams: [...f.teams, { ...defaultTeam }] }));
  };
  const removeTeam = (idx: number) => {
    setForm(f => ({ ...f, teams: f.teams.filter((_, i) => i !== idx) }));
  };

  const uploadMedia = async (files: File[]) => {
    const urls: string[] = [];
    for (const file of files) {
      const filePath = `projects/${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage.from('media').upload(filePath, file);
      if (!error && data) {
        const { data: publicUrl } = supabase.storage.from('media').getPublicUrl(filePath);
        console.log("publicUrl object:", publicUrl);
        if (publicUrl && publicUrl.publicUrl) {
          urls.push(publicUrl.publicUrl);
        } else {
          console.error("No publicUrl returned for", filePath, publicUrl);
        }
      } else {
        console.error("Upload error for", filePath, error);
      }
    }
    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    let mediaUrls = form.media;
    if (form.mediaFiles.length > 0) {
      const uploaded = await uploadMedia(form.mediaFiles);
      mediaUrls = [...mediaUrls, ...uploaded];
    }
    const updateObj: any = {
      title: form.title,
      description: form.description,
      goal: form.goal,
      requirements: form.requirements,
      tech_stack: form.tech_stack.split(",").map((s) => s.trim()),
      tools: form.tools.split(",").map((s) => s.trim()),
      work_mode: form.work_mode,
      duration: form.duration,
      category: form.category,
      skills_needed: form.skills_needed.split(",").map((s) => s.trim()),
      media: mediaUrls,
      timeline: form.timeline,
      teams: form.teams,
      customsections: form.customsections,
    };
    const { error: updateError } = await supabase.from("projects").update(updateObj).eq("id", id);
    setLoading(false);
    if (updateError) {
      setError(updateError.message);
    } else {
      navigate(`/projects/${id}`);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Edit Project</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" value={form.title} onChange={handleInput} required />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" value={form.description} onChange={handleInput} required rows={3} />
        </div>
        <div>
          <Label htmlFor="goal">Goal</Label>
          <Textarea id="goal" name="goal" value={form.goal} onChange={handleInput} rows={2} />
        </div>
        <div>
          <Label htmlFor="requirements">Requirements</Label>
          <Textarea id="requirements" name="requirements" value={form.requirements} onChange={handleInput} rows={2} />
        </div>
        <div>
          <Label htmlFor="tech_stack">Technologies (comma separated)</Label>
          <Input id="tech_stack" name="tech_stack" value={form.tech_stack} onChange={handleInput} />
        </div>
        <div>
          <Label htmlFor="tools">Tools (comma separated)</Label>
          <Input id="tools" name="tools" value={form.tools} onChange={handleInput} />
        </div>
        <div>
          <Label htmlFor="work_mode">Work Mode</Label>
          <Input id="work_mode" name="work_mode" value={form.work_mode} onChange={handleInput} />
        </div>
        <div>
          <Label htmlFor="duration">Duration</Label>
          <Input id="duration" name="duration" value={form.duration} onChange={handleInput} />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Input id="category" name="category" value={form.category} onChange={handleInput} />
        </div>
        <div>
          <Label htmlFor="skills_needed">Skills Needed (comma separated)</Label>
          <Input id="skills_needed" name="skills_needed" value={form.skills_needed} onChange={handleInput} />
        </div>
        <div>
          <Label>Existing Media</Label>
          <div className="flex flex-wrap gap-2 mt-1">
            {form.media.map((url, i) => (
              <div key={i} className="relative group">
                {url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                  <img src={url} alt="media" className="w-20 h-20 object-cover rounded" />
                ) : (
                  <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View Video</a>
                )}
                <button
                  type="button"
                  onClick={async () => {
                    const match = url.match(/\/object\/public\/media\/(.*)$/);
                    if (match) {
                      const filePath = match[1];
                      setForm(f => ({ ...f, media: f.media.filter(u => u !== url) }));
                      await supabase.storage.from('media').remove([filePath]);
                    }
                  }}
                  className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity text-xs"
                  title="Delete"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
        <div>
          <Label htmlFor="media">Add Images/Videos</Label>
          <Input id="media" type="file" multiple accept="image/*,video/*" onChange={handleMediaChange} />
        </div>
        {/* Timeline Section */}
        <div>
          <Label>Timeline</Label>
          {form.timeline.map((section, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <Input
                placeholder="Milestone Title"
                value={section.title}
                onChange={e => handleSectionChange(idx, "title", e.target.value, "timeline")}
                className="flex-1"
              />
              <Input
                placeholder="Details"
                value={section.content}
                onChange={e => handleSectionChange(idx, "content", e.target.value, "timeline")}
                className="flex-1"
              />
              <Button type="button" variant="destructive" onClick={() => removeSection(idx, "timeline")}>Remove</Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={() => addSection("timeline")}>Add Timeline Item</Button>
        </div>
        {/* Teams Section */}
        <div>
          <Label>Teams</Label>
          {form.teams.map((team, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <Input
                placeholder="Team Name"
                value={team.name}
                onChange={e => handleTeamChange(idx, "name", e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="Objective"
                value={team.objective}
                onChange={e => handleTeamChange(idx, "objective", e.target.value)}
                className="flex-1"
              />
              <Button type="button" variant="destructive" onClick={() => removeTeam(idx)}>Remove</Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addTeam}>Add Team</Button>
        </div>
        {/* Custom Sections */}
        <div>
          <Label>Custom Sections</Label>
          {form.customsections.map((section, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <Input
                placeholder="Section Title"
                value={section.title}
                onChange={e => handleSectionChange(idx, "title", e.target.value, "customsections")}
              />
              <Input
                placeholder="Section Content"
                value={section.content}
                onChange={e => handleSectionChange(idx, "content", e.target.value, "customsections")}
              />
              <Button type="button" variant="destructive" onClick={() => removeSection(idx, "customsections")}>Remove</Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={() => addSection("customsections")}>Add Custom Section</Button>
        </div>
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
          <Button type="submit" disabled={loading}>Save Changes</Button>
        </div>
        {error && <div className="text-red-600 mt-2">{error}</div>}
      </form>
    </div>
  );
};

export default ProjectEdit; 