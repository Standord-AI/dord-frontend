import { getAgent } from "@/app/actions/agent";
import { AgentSettingsForm } from "@/components/agent/agent-settings-form";
import { Bot } from "lucide-react";

export default async function AgentSettingsPage() {
  const { agent, agentId, error } = await getAgent();

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
          <p className="text-destructive font-medium">{error}</p>
          <p className="text-sm text-muted-foreground mt-2">
            Please try again later or contact support.
          </p>
        </div>
      </div>
    );
  }

  if (!agent || !agentId) {
    return (
      <div className="p-6">
        <div className="rounded-lg border p-12 text-center">
          <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Agent Configured</h2>
          <p className="text-muted-foreground">
            Your business doesn&apos;t have an AI agent set up yet.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Contact support to get started with your AI assistant.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bot className="h-7 w-7" />
            Agent Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure your AI assistant&apos;s personality, behavior, and
            capabilities
          </p>
        </div>
      </div>

      <AgentSettingsForm agent={agent} agentId={agentId} />
    </div>
  );
}
