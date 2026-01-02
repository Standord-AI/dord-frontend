"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AgentConfigInput, AgentType } from "@/global-types";
import { updateAgent } from "@/app/actions/agent";
import { compilePrompt, generateDescription } from "@/lib/agent-prompt";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface AgentBasicInfoProps {
  config: AgentConfigInput;
  agentId: number;
  onConfigChange: (updates: Partial<AgentConfigInput>) => void;
}

export function AgentBasicInfo({
  config,
  agentId,
  onConfigChange,
}: AgentBasicInfoProps) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const persona = compilePrompt(config);
      const description = generateDescription(config);

      const result = await updateAgent(agentId, {
        AgentName: config.agentName,
        AgentPersona: persona,
        AgentDescription: description,
      });

      if (result.success) {
        toast.success("Basic info saved successfully");
      } else {
        toast.error(result.error || "Failed to save");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">🤖</span>
          Basic Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="agentName">Agent Name</Label>
            <Input
              id="agentName"
              value={config.agentName}
              onChange={(e) => onConfigChange({ agentName: e.target.value })}
              placeholder="e.g., Sales Assistant"
            />
            <p className="text-xs text-muted-foreground">
              The name your customers will see
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="agentType">Agent Type</Label>
            <Select
              value={config.agentType}
              onValueChange={(value: AgentType) =>
                onConfigChange({ agentType: value })
              }
            >
              <SelectTrigger id="agentType" className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sales">
                  <span className="flex items-center gap-2">
                    💰 Sales Assistant
                  </span>
                </SelectItem>
                <SelectItem value="support">
                  <span className="flex items-center gap-2">
                    🎧 Support Agent
                  </span>
                </SelectItem>
                <SelectItem value="general">
                  <span className="flex items-center gap-2">
                    🌟 General Assistant
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Determines the agent&apos;s primary focus
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessDescription">Business Description</Label>
          <Textarea
            id="businessDescription"
            value={config.businessDescription}
            onChange={(e) =>
              onConfigChange({ businessDescription: e.target.value })
            }
            placeholder="Describe your business, products, and services..."
            rows={4}
          />
          <p className="text-xs text-muted-foreground">
            Help the agent understand your business context
          </p>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Basic Info"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
