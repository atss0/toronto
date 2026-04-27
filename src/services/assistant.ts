import api from './api';

export interface AssistantContext {
  city?: string;
  travel_style?: string;
  budget_level?: string;
  interests?: string[];
  location?: { latitude: number; longitude: number };
}

export interface SendMessagePayload {
  message: string;
  conversation_id?: string;
  context?: AssistantContext;
}

export interface ApiRouteCardStop {
  name: string;
  description: string;
}

export interface ApiRouteCard {
  title: string;
  distance: string;
  duration: string;
  image_url: string | null;
  stops: ApiRouteCardStop[];
}

export interface AssistantMessage {
  id: string;
  role: 'assistant';
  text: string;
  route_card: ApiRouteCard | null;
}

export interface SendMessageResult {
  conversation_id: string;
  message: AssistantMessage;
}

export interface Conversation {
  id: string;
  preview: string;
  message_count: number;
  created_at: string;
}

const assistantService = {
  sendMessage: (payload: SendMessagePayload) =>
    api.post<{ success: boolean; data: SendMessageResult }>('/assistant/chat', payload),

  getConversations: () =>
    api.get<{ success: boolean; data: Conversation[] }>('/assistant/conversations'),

  clearConversations: () =>
    api.delete<{ success: boolean; data: { message: string } }>('/assistant/conversations'),
};

export default assistantService;
