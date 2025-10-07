import axios from 'axios';

// AgentX Configuration (provide key via VITE_AGENTX_KEY; avoid hardcoding secrets)
const AGENTX_CONFIG = {
  widgetKey: import.meta.env.VITE_AGENTX_KEY || '',
  scriptSrc: 'https://storage.googleapis.com/agentx-cdn-01/agentx-chat.js'
};

// TypeScript interfaces
export interface ChatResponse {
  id: string;
  content: string;
  timestamp: string;
}

// AgentX Service
export class AgentXService {
  private apiKey: string = '';
  private isInitialized = false;

  async initialize(apiKey?: string): Promise<boolean> {
    try {
      this.apiKey = apiKey || AGENTX_CONFIG.widgetKey;
      if (!this.apiKey) {
        console.warn('[AgentX] No widget key provided (VITE_AGENTX_KEY). Running in fallback mode.');
      }
      
      if (!document.getElementById('chatBubbleRoot')) {
        const div = document.createElement('div');
        div.setAttribute('id', 'chatBubbleRoot');
        document.body.appendChild(div);
      }

      if (this.apiKey) {
        (window as any).agx = this.apiKey;
        await this.loadAgentXScript();
      }
      
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize AgentX:', error);
      return false;
    }
  }

  private loadAgentXScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.querySelector('script[src*="agentx-chat.js"]')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = AGENTX_CONFIG.scriptSrc;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load AgentX script'));
      document.head.appendChild(script);
    });
  }

  isReady(): boolean {
    return this.isInitialized;
  }

  async sendMessage(message: string): Promise<ChatResponse | null> {
    try {
      const response = await axios.post('/api/v1/agentx/chat', {
        message,
        context: { source: 'StorySwap2.0' }
      });

      if (response.data) {
        return {
          id: response.data.id || 'msg-' + Date.now(),
          content: response.data.content || response.data.message,
          timestamp: response.data.timestamp || new Date().toISOString()
        };
      }

      return null;
    } catch (error: any) {
      console.error('[AgentX] sendMessage failed:', error?.message || error);
      return {
        id: 'fallback-' + Date.now(),
        content: "I'm here to brainstorm trips with you. Share a mood or place to begin!",
        timestamp: new Date().toISOString()
      };
    }
  }

  openChat(): void {
    const button = document.querySelector('#chatBubbleRoot button');
    if (button) (button as HTMLElement).click();
  }
}

export const agentXService = new AgentXService();
export default agentXService;
