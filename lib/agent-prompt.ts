import { AgentConfigInput } from "@/global-types";

/**
 * Default configuration values for a new agent
 */
export const defaultAgentConfig: AgentConfigInput = {
  agentName: "AI Assistant",
  agentType: "sales",
  tone: "friendly",
  verbosity: 3,
  emojiUsage: "low",
  language: "en",
  businessDescription: "",
  allowedActions: ["view_products", "create_order", "answer_questions"],
  discountPolicy: "never",
  maxDiscountPercent: 0,
  greetingMessage: "Hello! How can I help you today?",
  escalationMessage:
    "I'll connect you with a human agent who can better assist you.",
  customInstructions: "",
};

/**
 * Available actions that the agent can perform
 */
export const availableActions = [
  {
    id: "view_products",
    label: "View Products",
    description: "Browse and search product catalog",
  },
  {
    id: "create_order",
    label: "Create Orders",
    description: "Help customers place orders",
  },
  {
    id: "apply_discount",
    label: "Apply Discounts",
    description: "Apply promotional discounts",
  },
  {
    id: "answer_questions",
    label: "Answer Questions",
    description: "Respond to customer inquiries",
  },
  {
    id: "check_order_status",
    label: "Check Order Status",
    description: "Look up order information",
  },
  {
    id: "process_returns",
    label: "Process Returns",
    description: "Handle return requests",
  },
] as const;

/**
 * Compiles an AgentConfigInput into a structured persona string.
 * The config is embedded as a JSON comment for decompilation.
 */
export function compilePrompt(config: AgentConfigInput): string {
  const toneDescriptions = {
    friendly: "warm, approachable, and conversational",
    professional: "formal, courteous, and business-like",
    casual: "relaxed, informal, and friendly",
  };

  const verbosityDescriptions = {
    1: "extremely concise, using minimal words",
    2: "brief but informative",
    3: "balanced between concise and detailed",
    4: "thorough and explanatory",
    5: "very detailed with comprehensive explanations",
  };

  const emojiDescriptions = {
    none: "Do not use any emojis.",
    low: "Occasionally use emojis sparingly for emphasis.",
    medium: "Use emojis moderately to add warmth to responses.",
  };

  const languageNames = {
    en: "English",
    si: "Sinhala",
    ta: "Tamil",
  };

  const agentTypeDescriptions = {
    sales:
      "a sales assistant focused on helping customers find products and complete purchases",
    support:
      "a customer support specialist helping with inquiries, issues, and after-sales service",
    general: "a versatile assistant handling both sales and support tasks",
  };

  const discountPolicyDescriptions = {
    never: "You are NOT allowed to offer or apply any discounts.",
    allowed: `You may offer discounts up to ${
      config.maxDiscountPercent || 0
    }% when appropriate.`,
    approval: `You may suggest discounts up to ${
      config.maxDiscountPercent || 0
    }%, but must note they require manager approval.`,
  };

  // Build the prompt
  const promptParts: string[] = [
    `You are ${config.agentName}, ${agentTypeDescriptions[config.agentType]}.`,
    "",
    "## Personality & Communication Style",
    `- Tone: Be ${toneDescriptions[config.tone]}.`,
    `- Verbosity: Keep responses ${verbosityDescriptions[config.verbosity]}.`,
    `- ${emojiDescriptions[config.emojiUsage]}`,
    `- Respond in ${languageNames[config.language]}.`,
    "",
    "## Business Context",
    config.businessDescription || "No specific business description provided.",
    "",
    "## Capabilities",
    `You can: ${config.allowedActions
      .map((a) => {
        const action = availableActions.find((av) => av.id === a);
        return action ? action.label : a;
      })
      .join(", ")}.`,
    "",
    "## Policies",
    discountPolicyDescriptions[config.discountPolicy],
    "",
    "## Messages",
    `Greeting: "${config.greetingMessage}"`,
    `Escalation: "${config.escalationMessage}"`,
  ];

  if (config.customInstructions) {
    promptParts.push(
      "",
      "## Additional Instructions",
      config.customInstructions
    );
  }

  const humanReadablePrompt = promptParts.join("\n");

  // Embed the config as a JSON comment for decompilation
  const configJson = JSON.stringify(config);
  return `<!--CONFIG:${configJson}-->\n${humanReadablePrompt}`;
}

/**
 * Decompiles a persona string back into an AgentConfigInput.
 * Falls back to defaults if parsing fails.
 */
export function decompilePrompt(persona: string): AgentConfigInput {
  if (!persona) {
    return { ...defaultAgentConfig };
  }

  // Try to extract embedded JSON config
  const configMatch = persona.match(/<!--CONFIG:(.*?)-->/);
  if (configMatch) {
    try {
      const parsed = JSON.parse(configMatch[1]);
      return {
        ...defaultAgentConfig,
        ...parsed,
      };
    } catch (e) {
      console.error("Failed to parse embedded config:", e);
    }
  }

  // If no embedded config, return defaults with the agent name if detectable
  const nameMatch = persona.match(/You are ([^,]+),/);
  if (nameMatch) {
    return {
      ...defaultAgentConfig,
      agentName: nameMatch[1].trim(),
    };
  }

  return { ...defaultAgentConfig };
}

/**
 * Generates a description from the config for the AgentDescription field
 */
export function generateDescription(config: AgentConfigInput): string {
  const typeLabels = {
    sales: "Sales Assistant",
    support: "Support Agent",
    general: "General Assistant",
  };

  return `${typeLabels[config.agentType]} - ${
    config.tone
  } tone, ${config.language.toUpperCase()} language`;
}
