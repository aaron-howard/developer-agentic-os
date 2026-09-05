export type IntegrationStatus = "connected" | "available" | "disabled" | "error";

export type IntegrationAdapterStatus = {
  id: string;
  name: string;
  kind: "local" | "scm" | "issue-tracker" | "chat" | "email" | "observability" | "cloud";
  required: boolean;
  status: IntegrationStatus;
  capabilities: string[];
  setup?: string;
  message: string;
};