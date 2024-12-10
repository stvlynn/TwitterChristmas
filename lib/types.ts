export type Style = 
  | 'realistic'
  | 'anime'
  | 'watercolor'
  | 'oil-painting'
  | 'pencil-sketch'
  | 'pop-art'
  | 'cyberpunk';

export interface PortraitResponse {
  task_id: string;
  workflow_run_id: string;
  data: {
    id?: string;
    workflow_id?: string;
    status?: string;
    outputs: {
      img: Array<{
        url: string;
        dify_model_identity?: string;
        id?: string;
        type?: string;
        filename?: string;
      }>;
      prompt: string;
    };
    error?: string | null;
    elapsed_time?: number;
    total_tokens?: number;
    created_at?: number;
    finished_at?: number;
  };
}