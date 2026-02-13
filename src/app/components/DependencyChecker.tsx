import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { 
  Package, 
  AlertCircle, 
  CheckCircle, 
  Info,
  FileJson,
  Loader2,
  Upload,
  RefreshCw,
  Download
} from "lucide-react";
import { toast } from "sonner";

interface Dependency {
  name: string;
  version: string;
  type: "dependencies" | "devDependencies" | "peerDependencies";
}

interface DependencyAnalysis {
  total: number;
  dependencies: number;
  devDependencies: number;
  peerDependencies: number;
  specificVersions: number;
  rangeVersions: number;
  latestVersions: number;
  issues: string[];
}

export function DependencyChecker() {
  const [packageJson, setPackageJson] = useState("");
  const [dependencies, setDependencies] = useState<Dependency[]>([]);
  const [analysis, setAnalysis] = useState<DependencyAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const analyzePackageJson = (jsonContent: string) => {
    setIsAnalyzing(true);
    
    // Simulate processing time
    setTimeout(() => {
      try {
        const parsed = JSON.parse(jsonContent);
        const deps: Dependency[] = [];
        const issues: string[] = [];

        let specificVersions = 0;
        let rangeVersions = 0;
        let latestVersions = 0;

        // Extract dependencies
        if (parsed.dependencies) {
          Object.entries(parsed.dependencies).forEach(([name, version]) => {
            deps.push({ name, version: version as string, type: "dependencies" });
            
            const versionStr = version as string;
            if (versionStr.startsWith("^") || versionStr.startsWith("~")) {
              rangeVersions++;
            } else if (versionStr === "latest") {
              latestVersions++;
            } else {
              specificVersions++;
            }
          });
        }

        // Extract devDependencies
        if (parsed.devDependencies) {
          Object.entries(parsed.devDependencies).forEach(([name, version]) => {
            deps.push({ name, version: version as string, type: "devDependencies" });
            
            const versionStr = version as string;
            if (versionStr.startsWith("^") || versionStr.startsWith("~")) {
              rangeVersions++;
            } else if (versionStr === "latest") {
              latestVersions++;
            } else {
              specificVersions++;
            }
          });
        }

        // Extract peerDependencies
        if (parsed.peerDependencies) {
          Object.entries(parsed.peerDependencies).forEach(([name, version]) => {
            deps.push({ name, version: version as string, type: "peerDependencies" });
            
            const versionStr = version as string;
            if (versionStr.startsWith("^") || versionStr.startsWith("~")) {
              rangeVersions++;
            } else if (versionStr === "latest") {
              latestVersions++;
            } else {
              specificVersions++;
            }
          });
        }

        // Check for potential issues
        if (latestVersions > 0) {
          issues.push(`${latestVersions} package(s) using "latest" version (not recommended for production)`);
        }

        if (deps.length === 0) {
          issues.push("No dependencies found");
        }

        if (!parsed.name) {
          issues.push("Package name is missing");
        }

        if (!parsed.version) {
          issues.push("Package version is missing");
        }

        // Check for common security issues
        const deprecatedPackages = ["request", "node-uuid", "gulp-util"];
        deps.forEach(dep => {
          if (deprecatedPackages.includes(dep.name)) {
            issues.push(`"${dep.name}" is deprecated and should be replaced`);
          }
        });

        setDependencies(deps);
        setAnalysis({
          total: deps.length,
          dependencies: parsed.dependencies ? Object.keys(parsed.dependencies).length : 0,
          devDependencies: parsed.devDependencies ? Object.keys(parsed.devDependencies).length : 0,
          peerDependencies: parsed.peerDependencies ? Object.keys(parsed.peerDependencies).length : 0,
          specificVersions,
          rangeVersions,
          latestVersions,
          issues,
        });

        toast.success("Analysis complete!");
      } catch (error) {
        toast.error("Invalid JSON format");
        setDependencies([]);
        setAnalysis(null);
      } finally {
        setIsAnalyzing(false);
      }
    }, 500);
  };

  const handleAnalyze = () => {
    analyzePackageJson(packageJson);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.json') && file.name !== 'package.json') {
      toast.error("Please upload a valid JSON file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setPackageJson(content);
      analyzePackageJson(content);
      toast.success(`File "${file.name}" loaded successfully`);
    };
    reader.onerror = () => {
      toast.error("Failed to read file");
    };
    reader.readAsText(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const loadExample = () => {
    const example = {
      name: "my-project",
      version: "1.0.0",
      dependencies: {
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "lodash": "4.17.21",
        "axios": "^1.6.0"
      },
      devDependencies: {
        "typescript": "^5.0.0",
        "vite": "^5.0.0",
        "@types/react": "^18.2.0"
      }
    };
    setPackageJson(JSON.stringify(example, null, 2));
  };

  const updateToLatestVersions = () => {
    try {
      const parsed = JSON.parse(packageJson);
      
      // Update all dependencies to latest versions (simulated)
      if (parsed.dependencies) {
        Object.keys(parsed.dependencies).forEach(key => {
          parsed.dependencies[key] = "latest";
        });
      }
      
      if (parsed.devDependencies) {
        Object.keys(parsed.devDependencies).forEach(key => {
          parsed.devDependencies[key] = "latest";
        });
      }
      
      if (parsed.peerDependencies) {
        Object.keys(parsed.peerDependencies).forEach(key => {
          parsed.peerDependencies[key] = "latest";
        });
      }
      
      const updatedJson = JSON.stringify(parsed, null, 2);
      setPackageJson(updatedJson);
      analyzePackageJson(updatedJson);
      toast.success("All packages updated to latest version!");
    } catch (error) {
      toast.error("Failed to update packages. Invalid JSON format.");
    }
  };

  const downloadUpdatedPackageJson = () => {
    const blob = new Blob([packageJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "package.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("package.json downloaded!");
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "dependencies":
        return "default";
      case "devDependencies":
        return "secondary";
      case "peerDependencies":
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input */}
      <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-gray-200/50 dark:border-gray-800/50 shadow-xl hover:shadow-2xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
              <FileJson className="w-5 h-5 text-white" />
            </div>
            Package.json Input
          </CardTitle>
          <CardDescription>Upload or paste your package.json content</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Upload */}
          <div className="space-y-2">
            <Label>Upload File</Label>
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                className="w-full border-2 border-dashed hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:text-indigo-600 transition-all duration-300"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload package.json
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Click to upload a package.json file
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or paste content
              </span>
            </div>
          </div>

          {/* Text Input */}
          <div className="space-y-2">
            <Label htmlFor="packageJson">Package.json Content</Label>
            <Textarea
              id="packageJson"
              placeholder='{"name": "my-project", "dependencies": {...}}'
              value={packageJson}
              onChange={(e) => setPackageJson(e.target.value)}
              rows={20}
              className="font-mono text-sm"
            />
          </div>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Button 
                onClick={handleAnalyze} 
                disabled={!packageJson || isAnalyzing}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Package className="w-4 h-4 mr-2" />
                    Analyze
                  </>
                )}
              </Button>
              <Button onClick={loadExample} variant="outline" className="border-2 hover:border-indigo-600 hover:text-indigo-600 transition-all duration-300">
                Load Example
              </Button>
            </div>
            {analysis && packageJson && (
              <div className="flex gap-2">
                <Button 
                  onClick={updateToLatestVersions} 
                  variant="secondary"
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Update to Latest
                </Button>
                <Button 
                  onClick={downloadUpdatedPackageJson} 
                  variant="outline"
                  className="border-2 hover:border-emerald-600 hover:text-emerald-600 transition-all duration-300"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        {/* Analysis Summary */}
        {analysis && (
          <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-gray-200/50 dark:border-gray-800/50 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-xl">Analysis Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
                  <div className="text-sm text-muted-foreground">Total Packages</div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{analysis.total}</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 rounded-xl border border-blue-100 dark:border-blue-900/50">
                  <div className="text-sm text-muted-foreground">Dependencies</div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{analysis.dependencies}</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 rounded-xl border border-emerald-100 dark:border-emerald-900/50">
                  <div className="text-sm text-muted-foreground">Dev Dependencies</div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{analysis.devDependencies}</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/50 dark:to-rose-950/50 rounded-xl border border-pink-100 dark:border-pink-900/50">
                  <div className="text-sm text-muted-foreground">Peer Dependencies</div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">{analysis.peerDependencies}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Range Versions (^ or ~)</span>
                  <span className="font-medium">{analysis.rangeVersions}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Specific Versions</span>
                  <span className="font-medium">{analysis.specificVersions}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Latest Versions</span>
                  <span className="font-medium">{analysis.latestVersions}</span>
                </div>
              </div>

              {analysis.issues.length > 0 && (
                <div className="space-y-2 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 rounded-xl border border-yellow-200 dark:border-yellow-900/50">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />
                    <span className="font-semibold text-yellow-900 dark:text-yellow-300">Issues Found</span>
                  </div>
                  <div className="space-y-2">
                    {analysis.issues.map((issue, index) => (
                      <div key={index} className="text-sm text-yellow-800 dark:text-yellow-300 pl-7 flex items-start gap-2">
                        <span className="mt-1">•</span>
                        <span>{issue}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {analysis.issues.length === 0 && (
                <div className="flex items-center gap-2 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl border border-green-200 dark:border-green-900/50">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-500" />
                  <span className="font-semibold text-green-900 dark:text-green-300">No issues found</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Dependency List */}
        {dependencies.length > 0 && (
          <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-gray-200/50 dark:border-gray-800/50 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-xl">Dependencies List</CardTitle>
              <CardDescription>All packages in your project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[500px] overflow-auto">
                {dependencies.map((dep, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-md hover:scale-[1.02] transition-all duration-200"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{dep.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Version: {dep.version}
                      </div>
                    </div>
                    <Badge variant={getTypeColor(dep.type)}>
                      {dep.type === "dependencies" && "dep"}
                      {dep.type === "devDependencies" && "dev"}
                      {dep.type === "peerDependencies" && "peer"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {!analysis && (
          <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-gray-200/50 dark:border-gray-800/50 shadow-xl">
            <CardContent className="py-16">
              <div className="text-center space-y-4">
                <div className="p-4 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                  <Info className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
                </div>
                <p className="text-muted-foreground text-lg">
                  Upload or paste your package.json content and click Analyze to see results
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
