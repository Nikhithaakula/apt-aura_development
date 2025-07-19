
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Share2, Plus, TrendingUp, Users, Briefcase, Rocket, Home, Gift, Star, CheckCircle, FlaskConical, HelpCircle, Trash, Info, Hash } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const Feed = () => {
  const { user } = useAuth();
  const [newPost, setNewPost] = useState("");
  const [filter, setFilter] = useState("All");
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);
  const [type, setType] = useState("update");
  const [projectId, setProjectId] = useState("");
  const [startupId, setStartupId] = useState("");
  const [tags, setTags] = useState("");
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [userProjects, setUserProjects] = useState<any[]>([]);
  const [userStartups, setUserStartups] = useState<any[]>([]);
  const { toast } = useToast();

  // Add these at the top level of Feed component
  const [showDetails, setShowDetails] = useState<{ [postId: string]: boolean }>({});
  const [likes, setLikes] = useState<{ [postId: string]: number }>({});
  const [liked, setLiked] = useState<{ [postId: string]: boolean }>({});

  // Remove hashtagFilter and hashtag logic
  // Add state for feed type filter
  const [feedTypeFilter, setFeedTypeFilter] = useState<string | null>(null);

  // Fetch feed posts from Supabase
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("feed_posts")
        .select("*, author:profiles(*), project:projects(title), startup:startups(name)")
        .order("created_at", { ascending: false });
      if (error) setError("Failed to load feed posts");
      setPosts(data || []);
      setLoading(false);
    };
    fetchPosts();
    // Optionally, poll every 10s for real-time updates
    const interval = setInterval(fetchPosts, 10000);
    return () => clearInterval(interval);
  }, []);

  // Fetch user's projects and startups for selectors
  useEffect(() => {
    if (!user) return;
    const fetchUserProjects = async () => {
      const { data: memberships } = await supabase.from("project_members").select("*, project:projects(*)").eq("user_id", user.id);
      const projects = memberships?.map(m => m.project) || [];
      setUserProjects(projects);
    };
    const fetchUserStartups = async () => {
      const { data: memberships } = await supabase.from("startup_members").select("*, startup:startups(*)").eq("user_id", user.id);
      const startups = memberships?.map(m => m.startup) || [];
      setUserStartups(startups);
    };
    fetchUserProjects();
    fetchUserStartups();
  }, [user]);

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setMediaFiles(Array.from(e.target.files));
  };
  const uploadMedia = async (files: File[]) => {
    const urls: string[] = [];
    for (const file of files) {
      const filePath = `feed/${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage.from('media').upload(filePath, file);
      if (!error && data) {
        const { data: publicUrl } = supabase.storage.from('media').getPublicUrl(filePath);
        if (publicUrl?.publicUrl) urls.push(publicUrl.publicUrl);
      }
    }
    return urls;
  };
  const handlePost = async () => {
    if (!user || !newPost.trim()) return;
    setPosting(true);
    let mediaUrls: string[] = [];
    if (mediaFiles.length > 0) {
      mediaUrls = await uploadMedia(mediaFiles);
    }
    const insertObj: any = {
      author_id: user.id,
      content: newPost.trim(),
      type,
      tags: tags.split(",").map((t: string) => t.trim()).filter(Boolean),
      media: mediaUrls,
    };
    if (projectId) insertObj.project_id = projectId;
    if (startupId) insertObj.startup_id = startupId;
    const { error } = await supabase.from("feed_posts").insert(insertObj);
    setPosting(false);
    if (!error) {
      setNewPost(""); setType("update"); setProjectId(""); setStartupId(""); setTags(""); setMediaFiles([]);
      // Refresh posts
      const { data } = await supabase
        .from("feed_posts")
        .select("*, author:profiles(*), project:projects(title), startup:startups(name)")
        .order("created_at", { ascending: false });
      setPosts(data || []);
      toast({ title: "Posted!", description: "Your update has been shared." });
    }
  };

  // Define filter buttons with hashtag mapping
  const filterButtons = [
    { name: "All", hashtag: null, icon: Home },
    { name: "Updates", hashtag: "#update", icon: MessageCircle },
    { name: "Opportunities", hashtag: "#opportunity", icon: Gift },
    { name: "Achievements", hashtag: "#achievement", icon: Star },
    { name: "Milestones", hashtag: "#milestone", icon: CheckCircle },
    { name: "Tests", hashtag: "#test", icon: FlaskConical },
    { name: "Help", hashtag: "#help", icon: HelpCircle },
  ];

  // Update filteredPosts logic to use hashtagFilter
  const filteredPosts = posts.filter(post => {
    if (!feedTypeFilter || feedTypeFilter === 'all') return true;
    return post.type === feedTypeFilter;
  });

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

  // Like/unlike logic
  const handleLike = async (postId: string, liked: boolean) => {
    if (!user) return;
    if (liked) {
      await supabase.from("feed_likes").delete().eq("post_id", postId).eq("user_id", user.id);
    } else {
      await supabase.from("feed_likes").insert({ post_id: postId, user_id: user.id });
    }
    // Refresh posts
    const { data } = await supabase
      .from("feed_posts")
      .select("*, author:profiles(*), project:projects(title), startup:startups(name)")
      .order("created_at", { ascending: false });
    setPosts(data || []);
  };

  // Comments logic
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});
  const [comments, setComments] = useState<{ [postId: string]: any[] }>({});
  const fetchComments = async (postId: string) => {
    const { data } = await supabase.from("feed_comments").select("*, user:profiles(full_name)").eq("post_id", postId).order("created_at");
    setComments(c => ({ ...c, [postId]: data || [] }));
  };
  const handleAddComment = async (postId: string) => {
    if (!user || !commentInputs[postId]?.trim()) return;
    await supabase.from("feed_comments").insert({ post_id: postId, user_id: user.id, content: commentInputs[postId].trim() });
    setCommentInputs(c => ({ ...c, [postId]: "" }));
    fetchComments(postId);
  };

  // Fetch likes and liked state for all posts when posts or user changes
  useEffect(() => {
    const fetchLikesForPosts = async () => {
      const newLikes: { [postId: string]: number } = {};
      const newLiked: { [postId: string]: boolean } = {};
      for (const post of filteredPosts) {
        const { data } = await supabase.from("feed_likes").select("*").eq("post_id", post.id);
        newLikes[post.id] = data?.length || 0;
        newLiked[post.id] = !!data?.find((l: any) => l.user_id === user?.id);
      }
      setLikes(newLikes);
      setLiked(newLiked);
    };
    if (filteredPosts.length > 0 && user) fetchLikesForPosts();
  }, [filteredPosts, user]);

  // Fetch comments for all posts when posts change
  useEffect(() => {
    filteredPosts.forEach(post => fetchComments(post.id));
  }, [filteredPosts]);

  // Add delete handlers
  const handleDeletePost = async (postId: string) => {
    if (!window.confirm("Are you sure you want to delete this post? This cannot be undone.")) return;
    const { error } = await supabase.from("feed_posts").delete().eq("id", postId);
    if (error) {
      toast({ title: "Failed to delete post", description: error.message, variant: "destructive" });
    } else {
      setPosts(posts => posts.filter(p => p.id !== postId));
      toast({ title: "Post deleted" });
    }
  };
  const handleDeleteComment = async (commentId: string, postId: string) => {
    if (!window.confirm("Delete this comment?")) return;
    const { error } = await supabase.from("feed_comments").delete().eq("id", commentId);
    if (error) {
      toast({ title: "Failed to delete comment", description: error.message, variant: "destructive" });
    } else {
      setComments(c => ({ ...c, [postId]: (c[postId] || []).filter((cm: any) => cm.id !== commentId) }));
      toast({ title: "Comment deleted" });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Replace the user guide card with a more modern, professional design */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="rounded-xl shadow-sm bg-gradient-to-br from-blue-50 to-white border border-blue-100 p-6 flex flex-col gap-3">
          <div className="flex items-center gap-2 mb-1">
            <Info className="w-5 h-5 text-blue-500" />
            <span className="font-bold text-lg text-gray-900">How to use the Community Feed</span>
          </div>
          <ul className="list-none pl-0 text-sm text-gray-700 space-y-1">
            <li><span className="font-semibold text-blue-700">1.</span> Write your update, question, or announcement in the text box.</li>
            <li><span className="font-semibold text-blue-700">2.</span> Select the type of post below the text box (Update, Opportunity, Achievement, etc.).</li>
            <li><span className="font-semibold text-blue-700">3.</span> Use the tools to post about product testing and</li>
            <li><span className="font-semibold text-blue-700">4.</span> (Optional) Select a <span className="font-semibold">Project</span> or <span className="font-semibold">Startup</span> to associate your post with.</li>
            <li><span className="font-semibold text-blue-700">5.</span> (Optional) Add images or videos by clicking <span className="font-semibold">+ Media</span>.</li>
            <li><span className="font-semibold text-blue-700">6.</span> Click <span className="font-semibold">Share</span> to post to the community feed.</li>
            <li><span className="font-semibold text-blue-700">7.</span> Use the filter buttons above the feed to view posts by type.</li>
            <li><span className="font-semibold text-blue-700">8.</span> Click on a post to view the details and comments.</li>
          </ul>
        </div>
      </div>
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
                disabled={posting}
              />
              <div className="flex gap-2 mb-2 mt-2">
                {["update", "opportunity", "achievement", "milestone", "request", "reflection"].map((t) => (
                  <Button
                    key={t}
                    variant={type === t ? "default" : "outline"}
                    size="sm"
                    onClick={() => setType(t)}
                    className={type === t ? "ring-2 ring-blue-400" : ""}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </Button>
                ))}
              </div>
              <div className="flex gap-2 mb-2">
                <div>
                  <Button
                    variant={projectId ? "default" : "outline"}
                    size="sm"
                    onClick={() => {}}
                    asChild
                  >
                    <select
                      value={projectId}
                      onChange={e => setProjectId(e.target.value)}
                      className="bg-transparent border-none outline-none focus:ring-0 px-2 py-1"
                    >
                      <option value="">+ Project</option>
                      {userProjects.map((proj) => (
                        <option key={proj.id} value={proj.id}>{proj.title}</option>
                      ))}
                    </select>
                  </Button>
                </div>
                <div>
                  <Button
                    variant={startupId ? "default" : "outline"}
                    size="sm"
                    onClick={() => {}}
                    asChild
                  >
                    <select
                      value={startupId}
                      onChange={e => setStartupId(e.target.value)}
                      className="bg-transparent border-none outline-none focus:ring-0 px-2 py-1"
                    >
                      <option value="">+ Startup</option>
                      {userStartups.map((startup) => (
                        <option key={startup.id} value={startup.id}>{startup.name}</option>
                      ))}
                    </select>
                  </Button>
                </div>
                <Button
                  variant={mediaFiles.length > 0 ? "default" : "outline"}
                  size="sm"
                  onClick={() => document.getElementById('media-upload')?.click()}
                >
                  + Media
                </Button>
                <input
                  id="media-upload"
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  style={{ display: 'none' }}
                  onChange={handleMediaChange}
                />
              </div>
              {mediaFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {mediaFiles.map((file, i) => {
                    const url = URL.createObjectURL(file);
                    const isVideo = file.type.startsWith('video');
                    return isVideo ? (
                      <video key={i} src={url} controls className="w-24 h-16 object-cover rounded border" style={{ background: '#000' }} />
                    ) : (
                      <img key={i} src={url} alt="Media preview" className="w-24 h-16 object-cover rounded border" />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              {/* Project and Media buttons are now above */}
            </div>
            <Button onClick={handlePost} disabled={!newPost.trim() || posting || !type}>
              {posting ? "Posting..." : "Share"}
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* Feed filter buttons */}
      <div className="flex items-center space-x-2 mb-6 overflow-x-auto pb-2">
        {[{name: "All", value: "all"}, {name: "Update", value: "update"}, {name: "Opportunity", value: "opportunity"}, {name: "Achievement", value: "achievement"}, {name: "Milestone", value: "milestone"}, {name: "Request", value: "request"}, {name: "Reflection", value: "reflection"}].map(btn => {
          const isActive = (feedTypeFilter === btn.value || (!feedTypeFilter && btn.value === 'all'));
          return (
            <Button
              key={btn.value}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => setFeedTypeFilter(btn.value === 'all' ? null : btn.value)}
              className={`flex items-center space-x-1 whitespace-nowrap transition-all duration-150 ${isActive ? 'ring-2 ring-blue-400' : ''}`}
            >
              <span>{btn.name}</span>
            </Button>
          );
        })}
      </div>
      {/* Remove hashtag filter UI and logic */}
      {loading ? (
        <div className="text-center text-gray-500 py-12">Loading feed...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-12">{error}</div>
      ) : (
        <div className="space-y-6">
          {filteredPosts.length === 0 ? (
            <div className="text-center text-gray-500 py-12 animate-fade-in">No posts found{feedTypeFilter ? ` for ${feedTypeFilter}` : ''}.</div>
          ) : filteredPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">
                      {post.author?.full_name ? post.author.full_name.split(' ').map((n: string) => n[0]).join('') : "?"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{post.author?.full_name || "Unknown"}</h3>
                      <Badge variant="outline" className="text-xs">
                        {post.author?.role || "User"}
                      </Badge>
                      {post.type && (
                        <Badge className={`text-xs ${getTypeColor(post.type)}`}>{post.type}</Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>{post.created_at ? new Date(post.created_at).toLocaleString() : ""}</span>
                      {post.project?.title && (
                        <>
                          <span>•</span>
                          <span className="font-medium">{post.project.title}</span>
                        </>
                      )}
                      {post.startup?.name && (
                        <>
                          <span>•</span>
                          <span className="font-medium">{post.startup.name}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-gray-800 leading-relaxed mb-3">{post.content}</p>
                  {post.media && post.media.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {post.media.map((url: string, i: number) => {
                        const isVideo = url.match(/\.(mp4|webm|ogg)$/i);
                        return isVideo ? (
                          <video key={i} src={url} controls className="w-40 h-28 object-cover rounded border" style={{ background: '#000' }} />
                        ) : (
                          <img key={i} src={url} alt="Feed media" className="w-40 h-28 object-cover rounded border" />
                        );
                      })}
                    </div>
                  )}
                  {post.tags && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {post.tags.map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="text-xs cursor-pointer hover:bg-blue-200 transition-colors" onClick={() => setFeedTypeFilter(`#${tag.toLowerCase()}`)}>
                          #{tag.toLowerCase()}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-6">
                    <button className={`flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors ${liked[post.id] ? 'text-red-500' : ''}`} onClick={() => handleLike(post.id, liked[post.id])}>
                      <Heart className="w-5 h-5" />
                      <span className="text-sm">{likes[post.id] || 0}</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors" onClick={() => setShowDetails(sd => ({ ...sd, [post.id]: !sd[post.id] }))}>
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm">{comments[post.id]?.length || 0}</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors" disabled>
                      <Share2 className="w-5 h-5" />
                      <span className="text-sm">0</span>
                    </button>
                  </div>
                  <Button variant="ghost" size="sm" className="text-gray-500" onClick={() => setShowDetails(sd => ({ ...sd, [post.id]: !sd[post.id] }))}>
                    {showDetails[post.id] ? "Hide Details" : "View Details"}
                  </Button>
                  {user?.id === post.author_id && (
                    <button
                      className="ml-2 text-red-500 hover:text-red-700 transition-colors"
                      title="Delete post"
                      onClick={() => handleDeletePost(post.id)}
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {showDetails[post.id] && (
                  <div className="mt-4 border-t pt-4">
                    <div className="mb-2 font-semibold text-gray-700">Comments</div>
                    <div className="space-y-2 mb-2">
                      {(comments[post.id] || []).map((c: any) => (
                        <div key={c.id} className="flex items-start gap-2">
                          <span className="font-bold text-xs text-blue-700">{c.user?.full_name || "User"}:</span>
                          <span className="text-gray-800 text-sm">{c.content}</span>
                          {user?.id === c.user_id && (
                            <button
                              className="ml-1 text-red-400 hover:text-red-700 transition-colors"
                              title="Delete comment"
                              onClick={() => handleDeleteComment(c.id, post.id)}
                            >
                              <Trash className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 items-center">
                      <Input
                        value={commentInputs[post.id] || ""}
                        onChange={e => setCommentInputs(c => ({ ...c, [post.id]: e.target.value }))}
                        placeholder="Add a comment..."
                        className="flex-1"
                      />
                      <Button size="sm" onClick={() => handleAddComment(post.id)}>Comment</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <div className="text-center mt-8">
        <Button variant="outline" disabled>
          Load More Posts
        </Button>
      </div>
    </div>
  );
};

export default Feed;
