import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Technical skills categorization for better matching
const technicalSkills = {
  languages: [
    "javascript", "typescript", "python", "java", "c++", "c#", "ruby", "go", "rust", "php", "swift", "kotlin", "scala", "perl", "r", "dart", "haskell", "clojure", "sql", "html", "css", "objective-c", "matlab", "groovy", "lua", "elixir", "erlang", "fortran", "cobol", "assembly", "bash", "powershell", "shell", "f#", "vb.net", "delphi", "abap", "sas", "julia", "typescript", "pl/sql", "apex", "actionscript", "ada", "lisp", "prolog", "scheme", "ocaml", "crystal", "nim", "smalltalk", "vhdl", "verilog", "awk", "sed"
  ],
  frameworks: [
    "react", "reactjs", "angular", "angularjs", "vue", "vuejs", "svelte", "nextjs", "next.js", "nuxt", "nuxt.js", "django", "flask", "spring", "spring boot", "express", "express.js", "fastapi", "rails", "ruby on rails", "laravel", "dotnet", ".net", ".net core", "flutter", "electron", "react native", "tensorflow", "pytorch", "node", "nodejs", "nestjs", "symfony", "zend", "cakephp", "meteor", "ember", "backbone", "bootstrap", "material-ui", "mui", "tailwindcss", "chakra ui", "redux", "mobx", "apollo", "graphql", "gatsby", "blazor", "quasar", "ionic", "cordova", "capacitor", "struts", "play", "grails", "micronaut", "quarkus", "servlet", "jsp", "jsf", "primefaces", "vaadin", "jhipster", "sails.js", "adonisjs", "koa", "hapi", "sinatra", "phoenix", "actix", "rocket", "fiber", "gin", "echo", "beego", "buffalo", "hanami", "padrino", "volt", "crystal", "amber"
  ],
  databases: [
    "mysql", "postgresql", "postgres", "mongodb", "firebase", "supabase", "dynamodb", "redis", "cassandra", "sqlite", "oracle", "sql server", "mariadb", "cockroachdb", "elasticsearch", "arangodb", "couchdb", "influxdb", "neo4j", "memcached", "hbase", "redshift", "bigquery", "snowflake", "db2", "teradata", "firebird", "informix", "sybase", "timescaledb", "tidb", "clickhouse", "duckdb", "realm", "fauna", "aws aurora", "azure cosmos db"
  ],
  cloud: [
    "aws", "amazon web services", "azure", "gcp", "google cloud", "google cloud platform", "cloud computing", "kubernetes", "docker", "terraform", "serverless", "lambda", "ec2", "s3", "cloudformation", "cloud run", "cloud functions", "cloudflare", "digitalocean", "heroku", "netlify", "vercel", "openshift", "cloudwatch", "cloudfront", "route 53", "elastic beanstalk", "app engine", "dataproc", "bigtable", "pubsub", "container registry", "aks", "eks", "fargate", "app service", "functions", "event grid", "event hub", "logic apps", "batch", "cloud armor", "anthos", "istio", "argo", "helm", "rancher", "mesos", "nomad", "consul", "vault", "packer", "spinnaker", "jenkins x"
  ],
  tools: [
    "git", "github", "gitlab", "bitbucket", "jira", "jenkins", "travis", "travis ci", "circleci", "circle ci", "github actions", "gitlab ci", "azure devops", "webpack", "babel", "vite", "eslint", "prettier", "jest", "cypress", "selenium", "testing", "mocha", "chai", "jasmine", "karma", "ava", "enzyme", "puppeteer", "playwright", "storybook", "postman", "insomnia", "swagger", "openapi", "docker compose", "vagrant", "virtualbox", "vmware", "npm", "yarn", "pnpm", "rush", "lerna", "husky", "lint-staged", "commitizen", "cz-cli", "semantic-release", "sonarqube", "coveralls", "codecov", "snyk", "dependabot", "renovate", "logstash", "kibana", "grafana", "prometheus", "datadog", "new relic", "splunk", "papertrail", "rollbar", "sentry", "bugsnag", "airbrake", "segment", "mixpanel", "amplitude", "heap", "google analytics", "firebase analytics", "appcenter", "crashlytics", "fabric", "testflight", "appium", "xcode", "android studio", "visual studio", "vscode", "intellij", "pycharm", "webstorm", "eclipse", "netbeans", "sublime text", "atom", "notepad++", "ultraedit", "emacs", "vim", "nano"
  ]
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeText, jobDescription } = await req.json();
    
    if (!resumeText || !jobDescription) {
      return new Response(
        JSON.stringify({ error: 'Resume text and job description are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Processing resume match with texts of lengths:", resumeText.length, jobDescription.length);

    // Convert texts to lowercase for case-insensitive matching
    const resumeLower = resumeText.toLowerCase();
    const jobLower = jobDescription.toLowerCase();
    
    // Extract all words from job description
    const jobWords = jobLower.match(/\b\w+\b/g) || [];
    const uniqueJobWords = [...new Set(jobWords.filter(word => word.length > 3))];
    
    // Advanced matching logic with weighted scores
    let totalScore = 0;
    const maxScore = 100;
    
    // Track matches by category for detailed feedback
    // Define a type for the matches object to avoid 'never[]' errors
    interface MatchCategory {
      matched: string[];
      missing: string[];
      weight: number;
    }
    interface ExperienceCategory {
      matched: string[];
      missing: string[];
      weight: number;
    }
    interface GeneralCategory {
      matched: string[];
      missing: string[];
      weight: number;
    }

    const matches: {
      languages: MatchCategory;
      frameworks: MatchCategory;
      databases: MatchCategory;
      cloud: MatchCategory;
      tools: MatchCategory;
      experience: ExperienceCategory;
      general: GeneralCategory;
    } = {
      languages: { matched: [], missing: [], weight: 2.5 },
      frameworks: { matched: [], missing: [], weight: 2.0 },
      databases: { matched: [], missing: [], weight: 1.5 },
      cloud: { matched: [], missing: [], weight: 1.5 },
      tools: { matched: [], missing: [], weight: 1.0 },
      experience: { matched: [], missing: [], weight: 2.5 },
      general: { matched: [], missing: [], weight: 1.0 }
    };
    
    // 1. Match programming languages (highest weight)
    for (const language of technicalSkills.languages) {
      // Use word boundaries to avoid partial matches (e.g., 'java' in 'javascript')
      const languageRegex = new RegExp(`\\b${language.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}\\b`, 'i');
      if (languageRegex.test(jobLower)) {
        if (languageRegex.test(resumeLower)) {
          matches.languages.matched.push(language);
          totalScore += matches.languages.weight;
        } else {
          matches.languages.missing.push(language);
        }
      }
    }
    
    // 2. Match frameworks
    for (const framework of technicalSkills.frameworks) {
      // Use word boundaries to avoid partial matches (e.g., 'react' in 'reactjs')
      const frameworkRegex = new RegExp(`\\b${framework.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}\\b`, 'i');
      if (frameworkRegex.test(jobLower)) {
        if (frameworkRegex.test(resumeLower)) {
          matches.frameworks.matched.push(framework);
          totalScore += matches.frameworks.weight;
        } else {
          matches.frameworks.missing.push(framework);
        }
      }
    }
    
    // 3. Match databases
    for (const db of technicalSkills.databases) {
      const dbRegex = new RegExp(`\\b${db.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}\\b`, 'i');
      if (dbRegex.test(jobLower)) {
        if (dbRegex.test(resumeLower)) {
          matches.databases.matched.push(db);
          totalScore += matches.databases.weight;
        } else {
          matches.databases.missing.push(db);
        }
      }
    }
    
    // 4. Match cloud technologies
    for (const tech of technicalSkills.cloud) {
      const cloudRegex = new RegExp(`\\b${tech.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}\\b`, 'i');
      if (cloudRegex.test(jobLower)) {
        if (cloudRegex.test(resumeLower)) {
          matches.cloud.matched.push(tech);
          totalScore += matches.cloud.weight;
        } else {
          matches.cloud.missing.push(tech);
        }
      }
    }
    
    // 5. Match development tools
    for (const tool of technicalSkills.tools) {
      const toolRegex = new RegExp(`\\b${tool.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}\\b`, 'i');
      if (toolRegex.test(jobLower)) {
        if (toolRegex.test(resumeLower)) {
          matches.tools.matched.push(tool);
          totalScore += matches.tools.weight;
        } else {
          matches.tools.missing.push(tool);
        }
      }
    }
    
    // 6. Look for experience requirements (years, seniority)
    const experiencePatterns = [
      { regex: /\b(\d+)[\+]?\s*(?:years?|yrs?)(?:\s+of)?\s+experience\b/gi, type: "years" },
      { regex: /\b(junior|mid|senior|lead|principal)\b/gi, type: "level" },
      { regex: /\b(internship|entry[\s-]level)\b/gi, type: "entry" }
    ];
    
    // Extract experience requirements from job description
    const extractedExperience: { type: string; value: string; original: string }[] = [];
    
    experiencePatterns.forEach(pattern => {
      let match;
      while ((match = pattern.regex.exec(jobLower)) !== null) {
        extractedExperience.push({
          type: pattern.type,
          value: match[1],
          original: match[0]
        });
        
        // Check if resume mentions similar experience
        if (resumeLower.includes(match[0]) || 
            (pattern.type === "years" && resumeLower.match(new RegExp(`\\b${match[1]}[\\+]?\\s*(?:years?|yrs?)\\b`, "i")))) {
          matches.experience.matched.push(match[0]);
          totalScore += matches.experience.weight;
        } else {
          matches.experience.missing.push(match[0]);
        }
      }
    });
    
    // 7. General keyword matching (lower weight)
    const importantKeywords = uniqueJobWords.filter(word => {
      if (typeof word !== 'string') return false;
      return !Object.values(technicalSkills).flat().includes(word) && word.length > 4;
    });
    
    for (const keyword of importantKeywords) {
      if (typeof keyword !== 'string') continue;
      if (resumeLower.includes(keyword)) {
        matches.general.matched.push(keyword);
        totalScore += matches.general.weight * 0.2; // Lower weight for general keywords
      } else {
        matches.general.missing.push(keyword);
      }
    }
    
    // Normalize score to be out of 100
    const allPossiblePoints = 
      calculatePossiblePoints(matches.languages) +
      calculatePossiblePoints(matches.frameworks) +
      calculatePossiblePoints(matches.databases) +
      calculatePossiblePoints(matches.cloud) +
      calculatePossiblePoints(matches.tools) +
      calculatePossiblePoints(matches.experience) +
      (matches.general.matched.length + matches.general.missing.length) * matches.general.weight * 0.2;
    
    let normalizedScore = allPossiblePoints > 0 
      ? Math.round((totalScore / allPossiblePoints) * 100)
      : 50; // Default to 50% if no technical requirements found
    
    // Ensure score is between 0 and 100
    normalizedScore = Math.min(100, Math.max(0, normalizedScore));
    
    // Generate tailored suggestions based on missing skills
    let suggestions = "## AI Technical Match Analysis\n\n";

    if (normalizedScore < 40) {
      suggestions += "Your resume needs significant improvement to match this technical role.\n\n";
    } else if (normalizedScore < 70) {
      suggestions += "Your resume partially matches this technical position.\n\n";
    } else {
      suggestions += "Your resume shows a strong match for this technical position!\n\n";
    }
    
    // Add specific suggestions for key technical areas
    suggestions += generateCategoryFeedback("Programming Languages", matches.languages);
    suggestions += generateCategoryFeedback("Frameworks & Libraries", matches.frameworks);
    suggestions += generateCategoryFeedback("Databases", matches.databases);
    suggestions += generateCategoryFeedback("Cloud & DevOps", matches.cloud);
    suggestions += generateCategoryFeedback("Development Tools", matches.tools);
    
    // Experience suggestions
    if (matches.experience.missing.length > 0) {
      suggestions += "\n### Experience Requirements\n";
      suggestions += "The job requires: " + matches.experience.missing.join(", ") + ".\n";
      matches.experience.missing.forEach(item => {
        suggestions += `- Consider highlighting any relevant experience or transferable skills related to '${item}'.\n`;
      });
    }
    
    // Actionable suggestions for missing technical skills
    const allMissing = [
      { label: "Programming Languages", items: matches.languages.missing },
      { label: "Frameworks & Libraries", items: matches.frameworks.missing },
      { label: "Databases", items: matches.databases.missing },
      { label: "Cloud & DevOps", items: matches.cloud.missing },
      { label: "Development Tools", items: matches.tools.missing }
    ];
    
    let actionable = allMissing.filter(cat => cat.items.length > 0);
    if (actionable.length > 0) {
      suggestions += "\n### Skills & Tools to Add or Emphasize\n";
      actionable.forEach(cat => {
        cat.items.forEach(item => {
          suggestions += `- Consider gaining experience with or highlighting '${item}' if applicable.\n`;
        });
      });
    }
    
    // General keywords
    if (matches.general.missing.length > 0) {
      const topMissingKeywords = matches.general.missing.slice(0, 5);
      suggestions += "\n### Other Important Keywords\n";
      topMissingKeywords.forEach(keyword => {
        suggestions += `- Add or elaborate on '${keyword}' if you have relevant experience.\n`;
      });
    }
    
    if (normalizedScore < 60) {
      suggestions += "\n- Restructure your resume to emphasize your technical skills and quantifiable achievements.\n";
    }

    const response = {
      score: normalizedScore,
      suggestions,
      matchDetails: {
        totalKeywords: uniqueJobWords.length,
        matchedKeywords: Object.values(matches)
          .reduce((acc, category) => acc + category.matched.length, 0),
        matchedKeywordsList: [
          ...matches.languages.matched,
          ...matches.frameworks.matched, 
          ...matches.databases.matched,
          ...matches.cloud.matched,
          ...matches.tools.matched
        ].slice(0, 20),
        missingKeywords: [
          ...matches.languages.missing,
          ...matches.frameworks.missing,
          ...matches.databases.missing,
          ...matches.cloud.missing,
          ...matches.tools.missing
        ].slice(0, 20),
        technicalBreakdown: {
          languages: { 
            matched: matches.languages.matched,
            missing: matches.languages.missing
          },
          frameworks: {
            matched: matches.frameworks.matched,
            missing: matches.frameworks.missing
          },
          databases: {
            matched: matches.databases.matched,
            missing: matches.databases.missing
          },
          cloud: {
            matched: matches.cloud.matched,
            missing: matches.cloud.missing
          },
          tools: {
            matched: matches.tools.matched,
            missing: matches.tools.missing
          }
        }
      }
    };

    console.log("Completed match analysis with score:", normalizedScore);
    
    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error("Error in match-resume function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "An unknown error occurred",
        details: error.toString()
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});

// Helper function to calculate possible points for a category
function calculatePossiblePoints(category) {
  return (category.matched.length + category.missing.length) * category.weight;
}

// Helper function to generate feedback for a specific skill category
function generateCategoryFeedback(categoryName, category) {
  if (category.matched.length === 0 && category.missing.length === 0) {
    return "";
  }
  
  let feedback = `\n### ${categoryName}\n`;
  
  if (category.matched.length > 0) {
    feedback += "✅ Matched: " + category.matched.join(", ") + "\n";
  }
  
  if (category.missing.length > 0) {
    feedback += "❌ Missing: " + category.missing.join(", ") + "\n";
    feedback += "Consider adding these to your resume if you have experience with them.\n";
  }
  
  return feedback;
}
