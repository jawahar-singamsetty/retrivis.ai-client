export interface Project {
  id: string;
  name: string;
  description: string | null;
  clerk_id: string;
  created_at: string;
}

export interface Chat {
  id: string;
  title: string;
  project_id: string;
  clerk_id: string;
  created_at: string;
}

export interface ProjectDocument {
  id: string;
  project_id: string;
  filename: string;
  s3_key: string;
  file_size: number;
  file_type: string;
  processing_status?: string;
  task_id?: string | null;
  source_type?: string;
  source_url?: string | null;
  processing_details?: Record<string, unknown>;
  clerk_id: string;
  created_at: string;
}

export interface ProjectSettings {
  id?: string;
  project_id?: string;
  embedding_model: string;
  rag_strategy: string;
  agent_type: string;
  chunks_per_search: number;
  final_context_size: number;
  similarity_threshold: number;
  number_of_queries: number;
  reranking_enabled: boolean;
  reranking_model: string;
  vector_weight: number;
  keyword_weight: number;
  created_at?: string;
}
