"use server";

import { cookies } from "next/headers";
import { decodeJwt } from "@/lib/utils";
import { Agent, UpdateAgentPayload } from "@/global-types";
import { revalidatePath } from "next/cache";

export async function getAgent(): Promise<{
  agent: Agent | null;
  agentId: number | null;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("Authorization")?.value;

    if (!token) {
      return {
        agent: null,
        agentId: null,
        error: "Unauthorized: No token found",
      };
    }

    const payload = decodeJwt(token);
    if (!payload || !payload.tenant_id) {
      return {
        agent: null,
        agentId: null,
        error: "Unauthorized: Invalid token",
      };
    }

    // First, get the agent ID for this business/tenant
    const response = await fetch(
      `${process.env.MERCHANT_SERVICE_URL}/api/v1/agents/business/1`,
      {
        headers: {
          "Tenant-ID": payload.tenant_id,
          Cookie: `Authorization=${token}`,
        },
        cache: "no-store",
      }
    );

    // 403/404 means no agent exists for this tenant - return gracefully
    if (response.status === 403 || response.status === 404) {
      console.log(`No agent found for tenant: ${payload.tenant_id}`);
      return {
        agent: null,
        agentId: null,
        // No error - this is expected for tenants without agents
      };
    }

    if (!response.ok) {
      console.error(
        `Failed to fetch agent: ${response.status} ${response.statusText}`
      );
      return {
        agent: null,
        agentId: null,
        error: `Error fetching agent: ${response.statusText}`,
      };
    }

    const data = await response.json();
    return {
      agent: data.agent || null,
      agentId: data.agent_id || null,
    };
  } catch (error) {
    console.error("Error fetching agent:", error);
    return { agent: null, agentId: null, error: "Error loading agent." };
  }
}

export async function updateAgent(
  agentId: number,
  data: UpdateAgentPayload
): Promise<{ success: boolean; agent?: Agent; error?: string }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("Authorization")?.value;

    if (!token) {
      return { success: false, error: "Unauthorized: No token found" };
    }

    const payload = decodeJwt(token);
    if (!payload || !payload.tenant_id) {
      return { success: false, error: "Unauthorized: Invalid token" };
    }

    const response = await fetch(
      `${process.env.MERCHANT_SERVICE_URL}/api/v1/agents/agent/${agentId}/update`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Tenant-ID": payload.tenant_id,
          Cookie: `Authorization=${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    const resData = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        error: resData.message || "Failed to update agent",
      };
    }

    revalidatePath("/admin/dashboard/[slug]/agent/settings", "page");
    return { success: true, agent: resData.agent };
  } catch (error) {
    console.error("Error updating agent:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
