CREATE TABLE `llm_settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`active_provider` text DEFAULT 'ollama' NOT NULL,
	`ollama_base_url` text DEFAULT 'http://localhost:11434',
	`ollama_model` text DEFAULT 'llama3.2',
	`groq_api_key` text,
	`groq_model` text DEFAULT 'llama3-groq-70b-8192-tool-use-preview',
	`openai_api_key` text,
	`openai_base_url` text DEFAULT 'https://api.openai.com/v1',
	`openai_model` text DEFAULT 'gpt-4o-mini',
	`custom_base_url` text,
	`custom_api_key` text,
	`custom_model` text,
	`temperature` real DEFAULT 0.7,
	`max_tokens` integer DEFAULT 2048,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_by` integer
);
