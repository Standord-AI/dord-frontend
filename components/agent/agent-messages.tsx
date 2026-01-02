"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AgentConfigInput } from "@/global-types";
import { updateAgent } from "@/app/actions/agent";
import { compilePrompt, generateDescription } from "@/lib/agent-prompt";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface AgentMessagesProps {
  config: AgentConfigInput;
  agentId: number;
  onConfigChange: (updates: Partial<AgentConfigInput>) => void;
}

export function AgentMessages({
  config,
  agentId,
  onConfigChange,
}: AgentMessagesProps) {
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
        toast.success("Messages saved successfully");
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
          <span className="text-2xl">💬</span>
          Messages & Instructions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="greetingMessage">Greeting Message</Label>
          <Textarea
            id="greetingMessage"
            value={config.greetingMessage}
            onChange={(e) =>
              onConfigChange({ greetingMessage: e.target.value })
            }
            placeholder="Hello! How can I help you today?"
            rows={2}
          />
          <p className="text-xs text-muted-foreground">
            The first message customers will see when they start a conversation
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="escalationMessage">Escalation Message</Label>
          <Textarea
            id="escalationMessage"
            value={config.escalationMessage}
            onChange={(e) =>
              onConfigChange({ escalationMessage: e.target.value })
            }
            placeholder="I'll connect you with a human agent who can better assist you."
            rows={2}
          />
          <p className="text-xs text-muted-foreground">
            Shown when the agent needs to transfer the conversation to a human
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="customInstructions">
            Custom Instructions{" "}
            <span className="text-muted-foreground font-normal">
              (Optional)
            </span>
          </Label>
          <Textarea
            id="customInstructions"
            value={config.customInstructions || ""}
            onChange={(e) =>
              onConfigChange({ customInstructions: e.target.value })
            }
            placeholder="Add any specific instructions, rules, or context for your agent..."
            rows={4}
          />
          <p className="text-xs text-muted-foreground">
            Additional context or special instructions for the agent
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
              "Save Messages"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
