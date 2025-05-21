import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useSupabaseCreate } from "@/hooks/use-supabase";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle, Code, Database, FileText, Server, Wrench } from "lucide-react";

const Match = () => {
  const { user } = useAuth();
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [matchResult, setMatchResult] = useState<null | {
    score: number;
    suggestions: string;
    matchDetails: {
      totalKeywords: number;
      matchedKeywords: number;
      matchedKeywordsList?: string[];
      missingKeywords: string[];
      technicalBreakdown?: {
        languages: { matched: string[]; missing: string[] };
        frameworks: { matched: string[]; missing: string[] };
        databases: { matched: string[]; missing: string[] };
        cloud: { matched: string[]; missing: string[] };
        tools: { matched: string[]; missing: string[] };
      };
    }
  }>(null);
  
  const { create: createMatch } = useSupabaseCreate("matches");
  const { create: createResume } = useSupabaseCreate("resumes");
  const { create: createJobDesc } = useSupabaseCreate("job_descriptions");

  const handleCalculateMatch = async () => {
    if (!resume.trim() || !jobDescription.trim()) {
      toast.error("Please provide both a resume and job description.");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Calling match-resume function...");
      // Call our edge function to calculate the match
      const { data: aiData, error: aiError } = await supabase.functions.invoke("match-resume", {
        body: { resumeText: resume, jobDescription },
      });

      console.log("Response received:", { data: aiData, error: aiError });

      if (aiError) {
        throw new Error(`AI matching failed: ${aiError.message}`);
      }

      if (!aiData) {
        throw new Error("No data received from matching function");
      }
      
      setMatchResult(aiData);

      if (user) {
        try {
          // Save resume
          const savedResume = await createResume({
            title: `Resume ${new Date().toLocaleString()}`,
            content: resume,
            user_id: user.id
          });

          // Save job description
          const savedJobDesc = await createJobDesc({
            title: `Job Description ${new Date().toLocaleString()}`,
            content: jobDescription,
            user_id: user.id
          });

          // Save match result
          await createMatch({
            user_id: user.id,
            resume_id: savedResume.id,
            job_description_id: savedJobDesc.id,
            score: aiData.score,
            suggestions: aiData.suggestions
          });

          toast.success("Match results saved to your account!");
        } catch (error) {
          console.error("Error saving data:", error);
          // Continue showing results even if saving fails
        }
      }
    } catch (error: any) {
      toast.error(`An error occurred: ${error.message}`);
      console.error("Match error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score < 40) return "bg-red-500";
    if (score < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getScoreText = (score: number) => {
    if (score < 40) return "Low Match";
    if (score < 70) return "Moderate Match";
    return "Strong Match";
  };

  const renderMarkdown = (text: string) => {
    // Very simple markdown renderer for the suggestions
    return text.split('\n').map((line, i) => {
      if (line.startsWith('## ')) {
        return <h2 key={i} className="text-xl font-bold mt-4 mb-2">{line.substring(3)}</h2>;
      } else if (line.startsWith('### ')) {
        return <h3 key={i} className="text-lg font-semibold mt-3 mb-1">{line.substring(4)}</h3>;
      } else if (line.startsWith('- ')) {
        return <li key={i} className="ml-4">{line.substring(2)}</li>;
      } else if (line.startsWith('✅ ')) {
        return <div key={i} className="flex items-center gap-2"><CheckCircle className="text-green-500 h-4 w-4" />{line.substring(2)}</div>;
      } else if (line.startsWith('❌ ')) {
        return <div key={i} className="flex items-center gap-2"><AlertCircle className="text-red-500 h-4 w-4" />{line.substring(2)}</div>;
      } else if (line.trim() === '') {
        return <div key={i} className="h-2"></div>;
      } else {
        return <p key={i} className="my-1">{line}</p>;
      }
    });
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Match Your Resume</h1>
      <p className="text-gray-600 mb-8">
        Paste your resume and a job description to see how well they match and get AI-powered suggestions.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Resume</h2>
          <Textarea 
            className="w-full h-64 p-4"
            placeholder="Paste your resume here..."
            value={resume}
            onChange={(e) => setResume(e.target.value)}
          />
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Job Description</h2>
          <Textarea 
            className="w-full h-64 p-4"
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <Button 
          size="lg"
          onClick={handleCalculateMatch}
          disabled={isLoading}
        >
          {isLoading ? "Analyzing..." : "Calculate Match"}
        </Button>
      </div>
      
      {matchResult ? (
        <div className="mt-12">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Technical Match Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="text-5xl font-bold mb-2">{matchResult.score}%</div>
                <div className={`text-lg font-medium ${
                  matchResult.score < 40 ? 'text-red-600' : 
                  matchResult.score < 70 ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {getScoreText(matchResult.score)}
                </div>
                <div className="w-full mt-4">
                  <Progress 
                    value={matchResult.score} 
                    className="h-4" 
                    indicatorClassName={getScoreColor(matchResult.score)}
                  />
                </div>
                <div className="text-sm text-gray-500 mt-4">
                  Matched {matchResult.matchDetails.matchedKeywords} out of {matchResult.matchDetails.totalKeywords} key terms
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="technical">Technical Analysis</TabsTrigger>
              <TabsTrigger value="keywords">Keywords</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">AI Suggestions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-gray-700">
                    {renderMarkdown(matchResult.suggestions)}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="technical" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Technical Skills Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  {matchResult.matchDetails.technicalBreakdown ? (
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center mb-2">
                          <Code className="mr-2 h-5 w-5" /> 
                          <h3 className="font-medium text-lg">Programming Languages</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Matched</h4>
                            <div className="flex flex-wrap gap-1">
                              {matchResult.matchDetails.technicalBreakdown.languages.matched.length > 0 ? matchResult.matchDetails.technicalBreakdown.languages.matched.map((lang, idx) => (
                                <span key={idx} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">{lang}</span>
                              )) : <span className="text-gray-400 text-sm">None found</span>}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Missing</h4>
                            <div className="flex flex-wrap gap-1">
                              {matchResult.matchDetails.technicalBreakdown.languages.missing.length > 0 ? matchResult.matchDetails.technicalBreakdown.languages.missing.map((lang, idx) => (
                                <span key={idx} className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">{lang}</span>
                              )) : <span className="text-gray-400 text-sm">None missing</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <div className="flex items-center mb-2">
                          <Server className="mr-2 h-5 w-5" /> 
                          <h3 className="font-medium text-lg">Frameworks & Libraries</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Matched</h4>
                            <div className="flex flex-wrap gap-1">
                              {matchResult.matchDetails.technicalBreakdown.frameworks.matched.length > 0 ? matchResult.matchDetails.technicalBreakdown.frameworks.matched.map((fw, idx) => (
                                <span key={idx} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">{fw}</span>
                              )) : <span className="text-gray-400 text-sm">None found</span>}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Missing</h4>
                            <div className="flex flex-wrap gap-1">
                              {matchResult.matchDetails.technicalBreakdown.frameworks.missing.length > 0 ? matchResult.matchDetails.technicalBreakdown.frameworks.missing.map((fw, idx) => (
                                <span key={idx} className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">{fw}</span>
                              )) : <span className="text-gray-400 text-sm">None missing</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <div className="flex items-center mb-2">
                          <Database className="mr-2 h-5 w-5" /> 
                          <h3 className="font-medium text-lg">Databases</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Matched</h4>
                            <div className="flex flex-wrap gap-1">
                              {matchResult.matchDetails.technicalBreakdown.databases.matched.length > 0 ? matchResult.matchDetails.technicalBreakdown.databases.matched.map((db, idx) => (
                                <span key={idx} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">{db}</span>
                              )) : <span className="text-gray-400 text-sm">None found</span>}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Missing</h4>
                            <div className="flex flex-wrap gap-1">
                              {matchResult.matchDetails.technicalBreakdown.databases.missing.length > 0 ? matchResult.matchDetails.technicalBreakdown.databases.missing.map((db, idx) => (
                                <span key={idx} className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">{db}</span>
                              )) : <span className="text-gray-400 text-sm">None missing</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <div className="flex items-center mb-2">
                          <Server className="mr-2 h-5 w-5" /> 
                          <h3 className="font-medium text-lg">Cloud & DevOps</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Matched</h4>
                            <div className="flex flex-wrap gap-1">
                              {matchResult.matchDetails.technicalBreakdown.cloud.matched.length > 0 ? matchResult.matchDetails.technicalBreakdown.cloud.matched.map((cloud, idx) => (
                                <span key={idx} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">{cloud}</span>
                              )) : <span className="text-gray-400 text-sm">None found</span>}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Missing</h4>
                            <div className="flex flex-wrap gap-1">
                              {matchResult.matchDetails.technicalBreakdown.cloud.missing.length > 0 ? matchResult.matchDetails.technicalBreakdown.cloud.missing.map((cloud, idx) => (
                                <span key={idx} className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">{cloud}</span>
                              )) : <span className="text-gray-400 text-sm">None missing</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <div className="flex items-center mb-2">
                          <Wrench className="mr-2 h-5 w-5" /> 
                          <h3 className="font-medium text-lg">Development Tools</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Matched</h4>
                            <div className="flex flex-wrap gap-1">
                              {matchResult.matchDetails.technicalBreakdown.tools.matched.length > 0 ? matchResult.matchDetails.technicalBreakdown.tools.matched.map((tool, idx) => (
                                <span key={idx} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">{tool}</span>
                              )) : <span className="text-gray-400 text-sm">None found</span>}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Missing</h4>
                            <div className="flex flex-wrap gap-1">
                              {matchResult.matchDetails.technicalBreakdown.tools.missing.length > 0 ? matchResult.matchDetails.technicalBreakdown.tools.missing.map((tool, idx) => (
                                <span key={idx} className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">{tool}</span>
                              )) : <span className="text-gray-400 text-sm">None missing</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">Technical skill breakdown not available.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="keywords" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Keyword Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium text-lg mb-2">Matched Keywords</h3>
                      <div className="flex flex-wrap gap-2">
                        {matchResult.matchDetails.matchedKeywordsList && matchResult.matchDetails.matchedKeywordsList.length > 0 ? 
                          matchResult.matchDetails.matchedKeywordsList.map((word, idx) => (
                            <span key={idx} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">{word}</span>
                          )) : 
                          <p className="text-gray-500">No matched keywords found.</p>
                        }
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium text-lg mb-2">Missing Keywords</h3>
                      <div className="flex flex-wrap gap-2">
                        {matchResult.matchDetails.missingKeywords && matchResult.matchDetails.missingKeywords.length > 0 ? 
                          matchResult.matchDetails.missingKeywords.map((word, idx) => (
                            <span key={idx} className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">{word}</span>
                          )) : 
                          <p className="text-gray-500">No missing keywords found.</p>
                        }
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="mt-12 bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Results</h2>
          <p className="text-gray-600 mb-4">
            Submit your resume and job description above to see results.
          </p>
        </div>
      )}
    </div>
  );
};

export default Match;
