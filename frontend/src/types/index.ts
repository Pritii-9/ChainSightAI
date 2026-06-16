export type StatusType = 'Critical Delay' | 'At Risk' | 'On Schedule';

export interface Mitigation {
  option: string;
  cost_implication: string;
  action_id: string;
}

export interface FinalAnswer {
  status: StatusType;
  root_cause: string;
  financial_impact: string;
  downstream_impact: string;
  prescriptive_mitigations: Mitigation[];
}

export interface CopilotResponse {
  thought_process: string[];
  final_answer: FinalAnswer;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  responsePayload?: CopilotResponse;
  timestamp: Date;
}

export interface RealtimeAlert {
  id: string;
  shipment_id: string;
  type: string;
  message: string;
  status_change: string;
  severity: 'critical' | 'high' | 'low';
}

export interface Shipment {
  id: string;
  origin: string;
  destination: string;
  status: string;
  eta: string;
  carrier: string;
  sla: string;
}
