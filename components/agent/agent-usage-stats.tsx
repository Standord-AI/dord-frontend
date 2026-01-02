"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Agent } from "@/global-types";

interface AgentUsageStatsProps {
  agent: Agent;
}

export function AgentUsageStats({ agent }: AgentUsageStatsProps) {
  const usagePercent =
    agent.TokenUsageLimit > 0
      ? Math.round((agent.TokenUsageCurrent / agent.TokenUsageLimit) * 100)
      : 0;

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "paused":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "inactive":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">📊</span>
          Usage & Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Token Usage */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Token Usage</Label>
            <span className="text-sm text-muted-foreground">
              {formatNumber(agent.TokenUsageCurrent)} /{" "}
              {formatNumber(agent.TokenUsageLimit)}
            </span>
          </div>
          <Progress value={usagePercent} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {usagePercent}% of your monthly token limit used
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* LLM Model */}
          <div className="space-y-2 rounded-lg border p-4">
            <Label className="text-muted-foreground text-xs">LLM Model</Label>
            <p className="font-medium text-sm flex items-center gap-2">
              🧠 {agent.LLMModel || "gpt-4o-mini"}
            </p>
          </div>

          {/* Automation Status */}
          <div className="space-y-2 rounded-lg border p-4">
            <Label className="text-muted-foreground text-xs">
              Automation Status
            </Label>
            <Badge
              variant="outline"
              className={getStatusColor(agent.AutomationStatus)}
            >
              {agent.AutomationStatus}
            </Badge>
          </div>

          {/* DORD Enabled */}
          <div className="space-y-2 rounded-lg border p-4">
            <Label className="text-muted-foreground text-xs">
              DORD Integration
            </Label>
            <div className="flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${
                  agent.DordEnabled ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="font-medium text-sm">
                {agent.DordEnabled ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>
        </div>

        {/* Last Trigger */}
        {agent.LastAutomationTrigger &&
          agent.LastAutomationTrigger !== "0001-01-01T05:19:24+05:19" && (
            <div className="text-sm text-muted-foreground">
              Last automation trigger:{" "}
              {new Date(agent.LastAutomationTrigger).toLocaleString()}
            </div>
          )}
      </CardContent>
    </Card>
  );
}
