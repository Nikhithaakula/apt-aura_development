import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const Community = () => {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, role, skills");
      if (!error && data) setMembers(data);
      setLoading(false);
    };
    fetchMembers();

    // Real-time updates
    const subscription = supabase
      .channel('public:profiles')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, fetchMembers)
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold text-center mb-2">Meet Our Community</h2>
      <p className="text-center text-gray-500 mb-8">
        Connect with talented individuals from diverse backgrounds and expertise
      </p>
      {loading ? (
        <div className="text-center text-gray-400">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {members.map((member) => (
            <Link
              to={`/profile/${member.id}`}
              key={member.id}
              className="block"
              style={{ textDecoration: "none" }}
            >
              <Card className="flex flex-col items-center p-6 hover:shadow-lg transition cursor-pointer">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 to-green-400 flex items-center justify-center text-white font-bold text-xl mb-3">
                  {member.full_name
                    ? member.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
                    : "?"}
                </div>
                <div className="font-semibold text-lg text-center">{member.full_name}</div>
                <div className="text-gray-500 text-center mb-2">{member.role}</div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {(member.skills || []).map((skill: string) => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
      <div className="flex justify-center mt-8">
        <button className="px-6 py-2 rounded bg-gray-100 hover:bg-gray-200 font-medium">
          View All Members
        </button>
      </div>
    </div>
  );
};

export default Community; 