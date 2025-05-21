
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { PlusCircle, FileText, Briefcase, ArrowRight } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState<any[]>([]);
  const [jobDescriptions, setJobDescriptions] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      // Fetch resumes
      const { data: resumesData, error: resumesError } = await supabase
        .from("resumes")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (resumesError) throw resumesError;
      setResumes(resumesData || []);

      // Fetch job descriptions
      const { data: jobsData, error: jobsError } = await supabase
        .from("job_descriptions")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (jobsError) throw jobsError;
      setJobDescriptions(jobsData || []);

      // Fetch matches
      const { data: matchesData, error: matchesError } = await supabase
        .from("matches")
        .select(`
          *,
          resumes:resume_id (title),
          job_descriptions:job_description_id (title)
        `)
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (matchesError) throw matchesError;
      setMatches(matchesData || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load your dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Welcome, {user?.email}</h2>
        <p className="text-gray-600 mb-4">
          This is your personal dashboard where you can manage your resumes and job descriptions.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">My Resumes</h3>
            <p className="text-sm text-gray-500 mb-4">
              Manage your saved resumes
            </p>
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : resumes.length > 0 ? (
              <div className="space-y-2">
                {resumes.slice(0, 3).map((resume) => (
                  <Card key={resume.id} className="overflow-hidden">
                    <CardContent className="p-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-blue-500" />
                          <span className="text-sm truncate max-w-[160px]">{resume.title}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(resume.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {resumes.length > 3 && (
                  <div className="text-center pt-2">
                    <Button variant="ghost" size="sm" className="text-xs">
                      View all ({resumes.length})
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">No resumes yet</p>
              </div>
            )}
            
            <div className="mt-4">
              <Link to="/match">
                <Button variant="outline" size="sm" className="w-full">
                  <PlusCircle className="h-4 w-4 mr-1" /> Add New Resume
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">My Job Descriptions</h3>
            <p className="text-sm text-gray-500 mb-4">
              Manage your saved job descriptions
            </p>
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : jobDescriptions.length > 0 ? (
              <div className="space-y-2">
                {jobDescriptions.slice(0, 3).map((job) => (
                  <Card key={job.id} className="overflow-hidden">
                    <CardContent className="p-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Briefcase className="h-4 w-4 mr-2 text-green-500" />
                          <span className="text-sm truncate max-w-[160px]">{job.title}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(job.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {jobDescriptions.length > 3 && (
                  <div className="text-center pt-2">
                    <Button variant="ghost" size="sm" className="text-xs">
                      View all ({jobDescriptions.length})
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">No job descriptions yet</p>
              </div>
            )}
            
            <div className="mt-4">
              <Link to="/match">
                <Button variant="outline" size="sm" className="w-full">
                  <PlusCircle className="h-4 w-4 mr-1" /> Add New Job Description
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-8 border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Recent Matches</h3>
          <p className="text-sm text-gray-500 mb-4">
            View your recent resume-job matches
          </p>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : matches.length > 0 ? (
            <div className="space-y-3">
              {matches.map((match) => (
                <Card key={match.id}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-blue-500" />
                          <span className="text-sm font-medium">{match.resumes?.title || "Resume"}</span>
                          <ArrowRight className="h-4 w-4 mx-2 text-gray-400" />
                          <Briefcase className="h-4 w-4 mr-2 text-green-500" />
                          <span className="text-sm font-medium">{match.job_descriptions?.title || "Job"}</span>
                        </div>
                        <div className="mt-1 flex items-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2.5">
                            <div
                              className={`h-2.5 rounded-full ${
                                match.score < 40
                                  ? "bg-red-500"
                                  : match.score < 70
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                              }`}
                              style={{ width: `${match.score}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm font-medium">{match.score}% Match</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(match.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">No matches yet</p>
              <Link to="/match" className="mt-4 inline-block">
                <Button>Create Your First Match</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
