import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const StartupEdit = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const defaultSection = { title: "", content: "" };
  const defaultTeam = { name: "", objective: "" };
  const [form, setForm] = useState<any>(null);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchStartup = async () => {
      const { data } = await supabase.from("startups").select("*").eq("id", id).single();
      setForm(data);
    };
    fetchStartup();
  }, [id]);

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setMediaFiles(Array.from(e.target.files));
  };

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

  // Logo upload handler
  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
      setLogoPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  // Add section/team handlers
  const handleSectionChange = (idx: number, field: string, value: string, key: "timeline" | "customsections") => {
    setForm((f: any) => ({
      ...f,
      [key]: f[key].map((s: any, i: number) => i === idx ? { ...s, [field]: value } : s),
    }));
  };
  const handleTeamChange = (idx: number, field: string, value: string) => {
    setForm((f: any) => ({
      ...f,
      teams: f.teams.map((t: any, i: number) => i === idx ? { ...t, [field]: value } : t),
    }));
  };
  const addSection = (key: "timeline" | "customsections") => {
    setForm((f: any) => ({ ...f, [key]: [...f[key], { ...defaultSection }] }));
  };
  const removeSection = (idx: number, key: "timeline" | "customsections") => {
    setForm((f: any) => ({ ...f, [key]: f[key].filter((_: any, i: number) => i !== idx) }));
  };
  const addTeam = () => {
    setForm((f: any) => ({ ...f, teams: [...f.teams, { ...defaultTeam }] }));
  };
  const removeTeam = (idx: number) => {
    setForm((f: any) => ({ ...f, teams: f.teams.filter((_: any, i: number) => i !== idx) }));
  };

  const handleSave = async () => {
    if (!form) return;
    let mediaUrls = form.media || [];
    if (mediaFiles.length > 0) {
      const uploaded = await uploadMedia(mediaFiles);
      mediaUrls = [...mediaUrls, ...uploaded];
    }
    let logoUrl = form.logo || null;
    if (logoFile) {
      const filePath = `startups/logo_${Date.now()}_${logoFile.name}`;
      const { data, error } = await supabase.storage.from('media').upload(filePath, logoFile);
      if (!error && data) {
        const { data: publicUrl } = supabase.storage.from('media').getPublicUrl(filePath);
        if (publicUrl?.publicUrl) logoUrl = publicUrl.publicUrl;
      }
    }
    const updateObj: any = {
      ...form,
      tech_stack: typeof form.tech_stack === 'string' ? form.tech_stack.split(",").map((s: string) => s.trim()) : form.tech_stack,
      tools: typeof form.tools === 'string' ? form.tools.split(",").map((s: string) => s.trim()) : form.tools,
      media: mediaUrls,
      timeline: form.timeline,
      teams: form.teams,
      customsections: form.customsections,
      logo: logoUrl,
    };
    const { error } = await supabase.from("startups").update(updateObj).eq("id", id);
    if (!error) navigate(`/startups/${id}`);
  };

  if (!form) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Edit Startup</h2>
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        {/* Logo Upload */}
        <div className="space-y-2">
          <Label>Logo</Label>
          {form.logo && !logoPreview && (
            <div className="mb-2 flex items-center gap-2">
              <img src={form.logo} alt="logo" className="w-16 h-16 object-cover rounded" />
              <Button type="button" variant="destructive" size="sm" onClick={() => setForm((f: any) => ({ ...f, logo: null }))}>Remove</Button>
            </div>
          )}
          {logoPreview && (
            <div className="mb-2 flex items-center gap-2">
              <img src={logoPreview} alt="logo preview" className="w-16 h-16 object-cover rounded" />
              <Button type="button" variant="destructive" size="sm" onClick={() => { setLogoFile(null); setLogoPreview(null); }}>Remove</Button>
            </div>
          )}
          <Input type="file" accept="image/*" onChange={handleLogoChange} />
        </div>
        <div className="space-y-2">
          <Label>Name</Label>
          <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        </div>
        <div className="space-y-2">
          <Label>Tagline</Label>
          <Input value={form.tagline} onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))} />
        </div>
        <div className="space-y-2">
          <Label>Website</Label>
          <Input value={form.website || ''} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} placeholder="https://yourstartup.com" />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="text-justify" />
        </div>
        <div className="space-y-2">
          <Label>Mission</Label>
          <Textarea value={form.mission} onChange={e => setForm(f => ({ ...f, mission: e.target.value }))} className="text-justify" />
        </div>
        <div className="space-y-2">
          <Label>Technologies</Label>
          <Input value={(form.tech_stack || []).join(", ")} onChange={e => setForm(f => ({ ...f, tech_stack: e.target.value.split(",").map((s: string) => s.trim()) }))} />
        </div>
        <div className="space-y-2">
          <Label>Tools</Label>
          <Input value={(form.tools || []).join(", ")} onChange={e => setForm(f => ({ ...f, tools: e.target.value.split(",").map((s: string) => s.trim()) }))} />
        </div>
        <div className="space-y-2">
          <Label>Work Mode</Label>
          <Input value={form.work_mode} onChange={e => setForm(f => ({ ...f, work_mode: e.target.value }))} />
        </div>
        <div className="space-y-2">
          <Label>Location</Label>
          <Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
        </div>
        <div className="space-y-2">
          <Label>Founded</Label>
          <Input value={form.founded} onChange={e => setForm(f => ({ ...f, founded: e.target.value }))} />
        </div>
        {/* Requirements Section */}
        <div className="space-y-2">
          <Label>Requirements</Label>
          <Textarea value={form.requirements} onChange={e => setForm(f => ({ ...f, requirements: e.target.value }))} className="text-justify" />
        </div>
        <div className="space-y-2">
          <Label>Sector</Label>
          <Input value={form.sector} onChange={e => setForm(f => ({ ...f, sector: e.target.value }))} />
        </div>
        <div className="space-y-2">
          <Label>Stage</Label>
          <Input value={form.stage} onChange={e => setForm(f => ({ ...f, stage: e.target.value }))} />
        </div>
        {/* Timeline Section */}
        <div>
          <Label>Timeline</Label>
          {(form.timeline || []).map((section: any, idx: number) => (
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
          {(form.teams || []).map((team: any, idx: number) => (
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
          {(form.customsections || []).map((section: any, idx: number) => (
            <div key={idx} className="flex gap-2 mb-2">
              <Input
                placeholder="Section Title"
                value={section.title}
                onChange={e => handleSectionChange(idx, "title", e.target.value, "customsections")}
              />
              <Textarea
                placeholder="Section Content"
                value={section.content}
                onChange={e => handleSectionChange(idx, "content", e.target.value, "customsections")}
                className="text-justify"
              />
              <Button type="button" variant="destructive" onClick={() => removeSection(idx, "customsections")}>Remove</Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={() => addSection("customsections")}>Add Custom Section</Button>
        </div>
        {/* Media Section (with removal) */}
        <div>
          <Label>Existing Media</Label>
          <div className="flex flex-wrap gap-2 mt-1">
            {(form.media || []).map((url: string, i: number) => (
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
                      setForm((f: any) => ({ ...f, media: f.media.filter((u: string) => u !== url) }));
                      await supabase.storage.from('media').remove([match[1]]);
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
        {/* Add Media */}
        <div>
          <Label>Add Images/Videos</Label>
          <Input type="file" multiple accept="image/*,video/*" onChange={handleMediaChange} />
        </div>
        <Button className="mt-4" onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
};

export default StartupEdit; 