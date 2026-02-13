import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge as BadgeUI } from "./ui/badge";
import { Plus, X, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export interface Badge {
  id: string;
  type: string;
  url: string;
  label?: string;
  message?: string;
  color?: string;
}

interface BadgeTemplate {
  type: string;
  label: string;
  description: string;
  urlPattern: RegExp;
  urlPlaceholder: string;
  urlExample: string;
  generateMarkdown: (url: string, label?: string, message?: string, color?: string) => string;
}

const badgeTemplates: BadgeTemplate[] = [
  {
    type: "npm-version",
    label: "NPM Version",
    description: "Shows the current npm package version",
    urlPattern: /^[a-z0-9-_@\/]+$/i,
    urlPlaceholder: "package-name",
    urlExample: "react",
    generateMarkdown: (url) => `![npm](https://img.shields.io/npm/v/${url})`,
  },
  {
    type: "npm-downloads",
    label: "NPM Downloads",
    description: "Shows npm package download count",
    urlPattern: /^[a-z0-9-_@\/]+$/i,
    urlPlaceholder: "package-name",
    urlExample: "react",
    generateMarkdown: (url) => `![npm](https://img.shields.io/npm/dm/${url})`,
  },
  {
    type: "github-stars",
    label: "GitHub Stars",
    description: "Shows GitHub repository stars",
    urlPattern: /^[a-z0-9-_]+\/[a-z0-9-_\.]+$/i,
    urlPlaceholder: "username/repo",
    urlExample: "facebook/react",
    generateMarkdown: (url) => `![GitHub stars](https://img.shields.io/github/stars/${url})`,
  },
  {
    type: "github-forks",
    label: "GitHub Forks",
    description: "Shows GitHub repository forks",
    urlPattern: /^[a-z0-9-_]+\/[a-z0-9-_\.]+$/i,
    urlPlaceholder: "username/repo",
    urlExample: "facebook/react",
    generateMarkdown: (url) => `![GitHub forks](https://img.shields.io/github/forks/${url})`,
  },
  {
    type: "github-issues",
    label: "GitHub Issues",
    description: "Shows open GitHub issues",
    urlPattern: /^[a-z0-9-_]+\/[a-z0-9-_\.]+$/i,
    urlPlaceholder: "username/repo",
    urlExample: "facebook/react",
    generateMarkdown: (url) => `![GitHub issues](https://img.shields.io/github/issues/${url})`,
  },
  {
    type: "github-license",
    label: "GitHub License",
    description: "Shows repository license",
    urlPattern: /^[a-z0-9-_]+\/[a-z0-9-_\.]+$/i,
    urlPlaceholder: "username/repo",
    urlExample: "facebook/react",
    generateMarkdown: (url) => `![GitHub license](https://img.shields.io/github/license/${url})`,
  },
  {
    type: "build-status",
    label: "Build Status",
    description: "Shows CI/CD build status",
    urlPattern: /^https?:\/\/.+$/i,
    urlPlaceholder: "https://ci-service.com/status-url",
    urlExample: "https://github.com/user/repo/actions",
    generateMarkdown: (url) => `![Build Status](https://img.shields.io/badge/build-passing-brightgreen)`,
  },
  {
    type: "coverage",
    label: "Code Coverage",
    description: "Shows test coverage percentage",
    urlPattern: /^https?:\/\/.+$/i,
    urlPlaceholder: "https://codecov.io/gh/user/repo",
    urlExample: "https://codecov.io/gh/facebook/react",
    generateMarkdown: (url) => `![Coverage](https://img.shields.io/badge/coverage-95%25-brightgreen)`,
  },
  {
    type: "license",
    label: "License Badge",
    description: "Custom license badge",
    urlPattern: /^[a-z0-9-_\s\.]+$/i,
    urlPlaceholder: "MIT",
    urlExample: "MIT",
    generateMarkdown: (url) => `![License](https://img.shields.io/badge/license-${encodeURIComponent(url)}-blue)`,
  },
  {
    type: "custom",
    label: "Custom Badge",
    description: "Create a custom badge with label and message",
    urlPattern: /.*/,
    urlPlaceholder: "Enter badge text",
    urlExample: "custom",
    generateMarkdown: (url, label = "label", message = "message", color = "blue") => 
      `![${label}](https://img.shields.io/badge/${encodeURIComponent(label)}-${encodeURIComponent(message)}-${color})`,
  },
];

interface BadgeSelectorProps {
  badges: Badge[];
  onBadgesChange: (badges: Badge[]) => void;
}

export function BadgeSelector({ badges, onBadgesChange }: BadgeSelectorProps) {
  const [selectedType, setSelectedType] = useState<string>("");
  const [badgeUrl, setBadgeUrl] = useState("");
  const [customLabel, setCustomLabel] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [customColor, setCustomColor] = useState("blue");

  const currentTemplate = badgeTemplates.find(t => t.type === selectedType);

  const validateUrl = (url: string): boolean => {
    if (!currentTemplate) return false;
    return currentTemplate.urlPattern.test(url);
  };

  const addBadge = () => {
    if (!currentTemplate || !badgeUrl.trim()) {
      toast.error("Please select a badge type and enter required information");
      return;
    }

    if (!validateUrl(badgeUrl)) {
      toast.error(`Invalid format. Example: ${currentTemplate.urlExample}`);
      return;
    }

    const newBadge: Badge = {
      id: Math.random().toString(36).substr(2, 9),
      type: selectedType,
      url: badgeUrl,
      label: customLabel || undefined,
      message: customMessage || undefined,
      color: customColor || undefined,
    };

    onBadgesChange([...badges, newBadge]);
    setBadgeUrl("");
    setCustomLabel("");
    setCustomMessage("");
    setCustomColor("blue");
    toast.success("Badge added!");
  };

  const removeBadge = (id: string) => {
    onBadgesChange(badges.filter(b => b.id !== id));
    toast.success("Badge removed");
  };

  const generateBadgeMarkdown = (badge: Badge): string => {
    const template = badgeTemplates.find(t => t.type === badge.type);
    if (!template) return "";
    return template.generateMarkdown(badge.url, badge.label, badge.message, badge.color);
  };

  return (
    <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-gray-200/50 dark:border-gray-800/50 shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-xl">Badge Templates</CardTitle>
        <CardDescription>Add badges to showcase your project</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Badge Type Selection */}
        <div className="space-y-2">
          <Label>Badge Type</Label>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger>
              <SelectValue placeholder="Select badge type" />
            </SelectTrigger>
            <SelectContent>
              {badgeTemplates.map((template) => (
                <SelectItem key={template.type} value={template.type}>
                  {template.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {currentTemplate && (
            <p className="text-sm text-muted-foreground">{currentTemplate.description}</p>
          )}
        </div>

        {/* Badge URL Input */}
        {currentTemplate && (
          <div className="space-y-2">
            <Label>
              {currentTemplate.type === "custom" ? "Badge Text" : "URL/Identifier"}
            </Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder={currentTemplate.urlPlaceholder}
                  value={badgeUrl}
                  onChange={(e) => setBadgeUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Example: {currentTemplate.urlExample}
                </p>
              </div>
              {badgeUrl && (
                <div className="flex items-center">
                  {validateUrl(badgeUrl) ? (
                    <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-500" />
                    </div>
                  ) : (
                    <div className="p-1.5 bg-red-100 dark:bg-red-900/30 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-500" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Custom Badge Fields */}
        {currentTemplate?.type === "custom" && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Label</Label>
              <Input
                placeholder="status"
                value={customLabel}
                onChange={(e) => setCustomLabel(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <Input
                placeholder="active"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <Select value={customColor} onValueChange={setCustomColor}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="brightgreen">Green</SelectItem>
                  <SelectItem value="blue">Blue</SelectItem>
                  <SelectItem value="red">Red</SelectItem>
                  <SelectItem value="yellow">Yellow</SelectItem>
                  <SelectItem value="orange">Orange</SelectItem>
                  <SelectItem value="lightgrey">Grey</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <Button onClick={addBadge} disabled={!currentTemplate || !badgeUrl} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
          <Plus className="w-4 h-4 mr-2" />
          Add Badge
        </Button>

        {/* Added Badges */}
        {badges.length > 0 && (
          <div className="space-y-2 pt-4 border-t">
            <Label>Added Badges</Label>
            <div className="space-y-2">
              {badges.map((badge) => {
                const template = badgeTemplates.find(t => t.type === badge.type);
                return (
                  <div
                    key={badge.id}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/50 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <BadgeUI variant="outline">{template?.label}</BadgeUI>
                      </div>
                      <code className="text-xs text-muted-foreground break-all">
                        {generateBadgeMarkdown(badge)}
                      </code>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeBadge(badge.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { badgeTemplates };
