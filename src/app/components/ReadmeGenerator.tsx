import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge as BadgeUI } from "./ui/badge";
import { Copy, Download, FileText, Code, Eye, X } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BadgeSelector, type Badge, badgeTemplates } from "./BadgeSelector";
import { Checkbox } from "./ui/checkbox";

const LICENSE_OPTIONS = [
  { value: "MIT", label: "MIT License" },
  { value: "Apache-2.0", label: "Apache License 2.0" },
  { value: "GPL-3.0", label: "GNU GPL v3.0" },
  { value: "BSD-3-Clause", label: "BSD 3-Clause" },
  { value: "BSD-2-Clause", label: "BSD 2-Clause" },
  { value: "ISC", label: "ISC License" },
  { value: "MPL-2.0", label: "Mozilla Public License 2.0" },
  { value: "LGPL-3.0", label: "GNU LGPL v3.0" },
  { value: "AGPL-3.0", label: "GNU AGPL v3.0" },
  { value: "Unlicense", label: "The Unlicense" },
  { value: "Proprietary", label: "Proprietary" },
];

export function ReadmeGenerator() {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [installation, setInstallation] = useState("npm install");
  const [usage, setUsage] = useState("npm start");
  const [features, setFeatures] = useState("");
  const [selectedLicenses, setSelectedLicenses] = useState<string[]>(["MIT"]);
  const [author, setAuthor] = useState("");
  const [contributing, setContributing] = useState("Pull requests are welcome. For major changes, please open an issue first.");
  const [badges, setBadges] = useState<Badge[]>([]);

  const toggleLicense = (license: string) => {
    setSelectedLicenses(prev => 
      prev.includes(license) 
        ? prev.filter(l => l !== license)
        : [...prev, license]
    );
  };

  const generateReadme = () => {
    let readme = "";

    if (projectName) {
      readme += `# ${projectName}\n\n`;
    }

    if (badges.length > 0) {
      badges.forEach(badge => {
        const template = badgeTemplates.find(t => t.type === badge.type);
        if (template) {
          readme += template.generateMarkdown(badge.url, badge.label, badge.message, badge.color) + " ";
        }
      });
      readme += "\n\n";
    }

    if (description) {
      readme += `## Description\n\n${description}\n\n`;
    }

    if (features) {
      readme += `## Features\n\n`;
      const featureList = features.split("\n").filter(f => f.trim());
      featureList.forEach(feature => {
        readme += `- ${feature.trim()}\n`;
      });
      readme += `\n`;
    }

    if (installation) {
      readme += `## Installation\n\n\`\`\`bash\n${installation}\n\`\`\`\n\n`;
    }

    if (usage) {
      readme += `## Usage\n\n\`\`\`bash\n${usage}\n\`\`\`\n\n`;
    }

    if (contributing) {
      readme += `## Contributing\n\n${contributing}\n\n`;
    }

    if (selectedLicenses.length > 0) {
      readme += `## License\n\n`;
      if (selectedLicenses.length === 1) {
        readme += `This project is licensed under the ${selectedLicenses[0]} License.\n\n`;
      } else {
        readme += `This project is licensed under multiple licenses:\n\n`;
        selectedLicenses.forEach(license => {
          readme += `- ${license}\n`;
        });
        readme += `\n`;
      }
    }

    if (author) {
      readme += `## Author\n\n${author}\n`;
    }

    return readme || "# My Project\n\nAdd project details to generate README";
  };

  const readme = generateReadme();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(readme);
    toast.success("README copied to clipboard!");
  };

  const downloadReadme = () => {
    const blob = new Blob([readme], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "README.md";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("README.md downloaded!");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input Form */}
      <div className="space-y-6">
        <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-gray-200/50 dark:border-gray-800/50 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              Project Details
            </CardTitle>
            <CardDescription>Fill in your project information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                placeholder="my-awesome-project"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="A brief description of your project"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="features">Features (one per line)</Label>
              <Textarea
                id="features"
                placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="installation">Installation</Label>
              <Textarea
                id="installation"
                placeholder="npm install&#10;# or&#10;yarn add my-package"
                value={installation}
                onChange={(e) => setInstallation(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="usage">Usage</Label>
              <Textarea
                id="usage"
                placeholder="npm start"
                value={usage}
                onChange={(e) => setUsage(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contributing">Contributing</Label>
              <Textarea
                id="contributing"
                placeholder="How to contribute to your project"
                value={contributing}
                onChange={(e) => setContributing(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>License(s)</Label>
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-auto p-3 border-2 border-gray-200 dark:border-gray-800 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
                {LICENSE_OPTIONS.map((license) => (
                  <div key={license.value} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors">
                    <Checkbox
                      id={license.value}
                      checked={selectedLicenses.includes(license.value)}
                      onCheckedChange={() => toggleLicense(license.value)}
                    />
                    <Label
                      htmlFor={license.value}
                      className="text-sm font-normal cursor-pointer flex-1"
                    >
                      {license.label}
                    </Label>
                  </div>
                ))}
              </div>
              {selectedLicenses.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedLicenses.map((license) => (
                    <BadgeUI key={license} className="text-xs bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 text-indigo-900 dark:text-indigo-100 border border-indigo-200 dark:border-indigo-800 hover:shadow-md transition-all">
                      {license}
                      <button
                        onClick={() => toggleLicense(license)}
                        className="ml-1.5 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </BadgeUI>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                placeholder="Your Name (@yourhandle)"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <BadgeSelector badges={badges} onBadgesChange={setBadges} />
      </div>

      {/* Preview */}
      <div className="space-y-4">
        <Card className="sticky top-4 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-gray-200/50 dark:border-gray-800/50 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-xl">Preview</CardTitle>
            <CardDescription>Your generated README.md</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="rendered">
              <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-1">
                <TabsTrigger value="rendered" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300">
                  <Eye className="w-4 h-4" />
                  Rendered
                </TabsTrigger>
                <TabsTrigger value="markdown" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300">
                  <Code className="w-4 h-4" />
                  Markdown
                </TabsTrigger>
              </TabsList>

              <TabsContent value="rendered" className="mt-4">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 max-h-[600px] overflow-auto border-2 border-gray-200 dark:border-gray-800 shadow-inner markdown-preview">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {readme}
                  </ReactMarkdown>
                </div>
              </TabsContent>

              <TabsContent value="markdown" className="mt-4">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 rounded-xl p-6 max-h-[600px] overflow-auto border-2 border-gray-200 dark:border-gray-800 shadow-inner">
                  <pre className="text-sm whitespace-pre-wrap break-words font-mono text-gray-800 dark:text-gray-200">
                    {readme}
                  </pre>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-2">
              <Button onClick={copyToClipboard} className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button onClick={downloadReadme} variant="outline" className="flex-1 border-2 hover:border-indigo-600 hover:text-indigo-600 transition-all duration-300">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
