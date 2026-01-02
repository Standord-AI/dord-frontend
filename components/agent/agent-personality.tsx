"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AgentConfigInput,
  ToneType,
  EmojiUsage,
  LanguageCode,
} from "@/global-types";
import { updateAgent } from "@/app/actions/agent";
import { compilePrompt, generateDescription } from "@/lib/agent-prompt";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface AgentPersonalityProps {
  config: AgentConfigInput;
  agentId: number;
  onConfigChange: (updates: Partial<AgentConfigInput>) => void;
}

export function AgentPersonality({
  config,
  agentId,
  onConfigChange,
}: AgentPersonalityProps) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const persona = compilePrompt(config);
      const description = generateDescription(config);

      const result = await updateAgent(agentId, {
        AgentPersona: persona,
        AgentDescription: description,
      });

      if (result.success) {
        toast.success("Personality settings saved");
      } else {
        toast.error(result.error || "Failed to save");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const verbosityLabels = {
    1: "Very Brief",
    2: "Brief",
    3: "Balanced",
    4: "Detailed",
    5: "Very Detailed",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">✨</span>
          Personality & Style
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tone Selection */}
        <div className="space-y-3">
          <Label>Communication Tone</Label>
          <RadioGroup
            value={config.tone}
            onValueChange={(value: ToneType) => onConfigChange({ tone: value })}
            className="grid grid-cols-3 gap-4"
          >
            <div className="flex items-center space-x-2 rounded-lg border p-4 cursor-pointer hover:bg-accent transition-colors">
              <RadioGroupItem value="friendly" id="friendly" />
              <Label htmlFor="friendly" className="cursor-pointer flex-1">
                <span className="font-medium">😊 Friendly</span>
                <p className="text-xs text-muted-foreground">
                  Warm and approachable
                </p>
              </Label>
            </div>
            <div className="flex items-center space-x-2 rounded-lg border p-4 cursor-pointer hover:bg-accent transition-colors">
              <RadioGroupItem value="professional" id="professional" />
              <Label htmlFor="professional" className="cursor-pointer flex-1">
                <span className="font-medium">👔 Professional</span>
                <p className="text-xs text-muted-foreground">
                  Formal and courteous
                </p>
              </Label>
            </div>
            <div className="flex items-center space-x-2 rounded-lg border p-4 cursor-pointer hover:bg-accent transition-colors">
              <RadioGroupItem value="casual" id="casual" />
              <Label htmlFor="casual" className="cursor-pointer flex-1">
                <span className="font-medium">🎉 Casual</span>
                <p className="text-xs text-muted-foreground">
                  Relaxed and informal
                </p>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Verbosity */}
        <div className="space-y-3">
          <Label>Response Length (Verbosity)</Label>
          <div className="flex items-center gap-2">
            {([1, 2, 3, 4, 5] as const).map((level) => (
              <button
                key={level}
                onClick={() => onConfigChange({ verbosity: level })}
                className={`flex-1 py-3 px-2 rounded-lg border text-center transition-all ${
                  config.verbosity === level
                    ? "bg-primary text-primary-foreground border-primary"
                    : "hover:bg-accent"
                }`}
              >
                <span className="text-sm font-medium">{level}</span>
                <p className="text-xs opacity-80">{verbosityLabels[level]}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Emoji Usage */}
          <div className="space-y-3">
            <Label>Emoji Usage</Label>
            <RadioGroup
              value={config.emojiUsage}
              onValueChange={(value: EmojiUsage) =>
                onConfigChange({ emojiUsage: value })
              }
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="emoji-none" />
                <Label htmlFor="emoji-none" className="cursor-pointer">
                  🚫 None
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="emoji-low" />
                <Label htmlFor="emoji-low" className="cursor-pointer">
                  😊 Low (occasional)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="emoji-medium" />
                <Label htmlFor="emoji-medium" className="cursor-pointer">
                  🎉 Medium (moderate)
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Language */}
          <div className="space-y-3">
            <Label htmlFor="language">Response Language</Label>
            <Select
              value={config.language}
              onValueChange={(value: LanguageCode) =>
                onConfigChange({ language: value })
              }
            >
              <SelectTrigger id="language" className="w-full">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">🇬🇧 English</SelectItem>
                <SelectItem value="si">🇱🇰 Sinhala (සිංහල)</SelectItem>
                <SelectItem value="ta">🇱🇰 Tamil (தமிழ்)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Primary language for responses
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Personality"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
