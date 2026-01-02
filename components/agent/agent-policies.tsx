"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AgentConfigInput, DiscountPolicy } from "@/global-types";
import { updateAgent } from "@/app/actions/agent";
import {
  compilePrompt,
  generateDescription,
  availableActions,
} from "@/lib/agent-prompt";
import { toast } from "sonner";
import { Loader2, Check } from "lucide-react";

interface AgentPoliciesProps {
  config: AgentConfigInput;
  agentId: number;
  onConfigChange: (updates: Partial<AgentConfigInput>) => void;
}

export function AgentPolicies({
  config,
  agentId,
  onConfigChange,
}: AgentPoliciesProps) {
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
        toast.success("Policies saved successfully");
      } else {
        toast.error(result.error || "Failed to save");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleAction = (actionId: string) => {
    const currentActions = config.allowedActions;
    const newActions = currentActions.includes(actionId)
      ? currentActions.filter((a) => a !== actionId)
      : [...currentActions, actionId];
    onConfigChange({ allowedActions: newActions });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">📋</span>
          Policies & Permissions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Allowed Actions */}
        <div className="space-y-3">
          <Label>Allowed Actions</Label>
          <p className="text-sm text-muted-foreground">
            Select what your agent is allowed to do
          </p>
          <div className="grid gap-2 md:grid-cols-2">
            {availableActions.map((action) => {
              const isSelected = config.allowedActions.includes(action.id);
              return (
                <button
                  key={action.id}
                  onClick={() => toggleAction(action.id)}
                  className={`flex items-start gap-3 p-3 rounded-lg border text-left transition-all ${
                    isSelected
                      ? "bg-primary/10 border-primary"
                      : "hover:bg-accent"
                  }`}
                >
                  <div
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                      isSelected
                        ? "bg-primary border-primary text-primary-foreground"
                        : "border-muted-foreground"
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3" />}
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-sm">{action.label}</span>
                    <p className="text-xs text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Discount Policy */}
        <div className="space-y-3">
          <Label>Discount Policy</Label>
          <RadioGroup
            value={config.discountPolicy}
            onValueChange={(value: DiscountPolicy) =>
              onConfigChange({ discountPolicy: value })
            }
            className="space-y-2"
          >
            <div className="flex items-center space-x-2 rounded-lg border p-3">
              <RadioGroupItem value="never" id="discount-never" />
              <Label htmlFor="discount-never" className="cursor-pointer flex-1">
                <span className="font-medium">🚫 Never</span>
                <p className="text-xs text-muted-foreground">
                  Agent cannot offer or apply discounts
                </p>
              </Label>
            </div>
            <div className="flex items-center space-x-2 rounded-lg border p-3">
              <RadioGroupItem value="allowed" id="discount-allowed" />
              <Label
                htmlFor="discount-allowed"
                className="cursor-pointer flex-1"
              >
                <span className="font-medium">✅ Allowed</span>
                <p className="text-xs text-muted-foreground">
                  Agent can apply discounts directly
                </p>
              </Label>
            </div>
            <div className="flex items-center space-x-2 rounded-lg border p-3">
              <RadioGroupItem value="approval" id="discount-approval" />
              <Label
                htmlFor="discount-approval"
                className="cursor-pointer flex-1"
              >
                <span className="font-medium">⏳ Requires Approval</span>
                <p className="text-xs text-muted-foreground">
                  Agent can suggest discounts, but they need manager approval
                </p>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Max Discount */}
        {config.discountPolicy !== "never" && (
          <div className="space-y-2">
            <Label htmlFor="maxDiscount">Maximum Discount (%)</Label>
            <Input
              id="maxDiscount"
              type="number"
              min={0}
              max={100}
              value={config.maxDiscountPercent || 0}
              onChange={(e) =>
                onConfigChange({
                  maxDiscountPercent: parseInt(e.target.value) || 0,
                })
              }
              className="w-32"
            />
            <p className="text-xs text-muted-foreground">
              The maximum discount percentage the agent can offer (0-100)
            </p>
          </div>
        )}

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Policies"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
