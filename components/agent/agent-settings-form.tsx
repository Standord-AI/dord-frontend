"use client";

import { useState } from "react";
import { AgentConfigInput, Agent } from "@/global-types";
import { AgentBasicInfo } from "./agent-basic-info";
import { AgentPersonality } from "./agent-personality";
import { AgentPolicies } from "./agent-policies";
import { AgentMessages } from "./agent-messages";
import { AgentUsageStats } from "./agent-usage-stats";
import { decompilePrompt } from "@/lib/agent-prompt";

interface AgentSettingsFormProps {
  agent: Agent;
  agentId: number;
}

export function AgentSettingsForm({ agent, agentId }: AgentSettingsFormProps) {
  // Initialize config from the agent's persona
  const initialConfig = decompilePrompt(agent.AgentPersona);

  // Override the agent name from the actual agent data
  initialConfig.agentName = agent.AgentName || initialConfig.agentName;

  const [config, setConfig] = useState<AgentConfigInput>(initialConfig);

  const handleConfigChange = (updates: Partial<AgentConfigInput>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  return (
    <div className="space-y-6">
      {/* Usage Stats at the top */}
      <AgentUsageStats agent={agent} />

      {/* Basic Info */}
      <AgentBasicInfo
        config={config}
        agentId={agentId}
        onConfigChange={handleConfigChange}
      />

      {/* Personality */}
      <AgentPersonality
        config={config}
        agentId={agentId}
        onConfigChange={handleConfigChange}
      />

      {/* Policies */}
      <AgentPolicies
        config={config}
        agentId={agentId}
        onConfigChange={handleConfigChange}
      />

      {/* Messages */}
      <AgentMessages
        config={config}
        agentId={agentId}
        onConfigChange={handleConfigChange}
      />
    </div>
  );
}
