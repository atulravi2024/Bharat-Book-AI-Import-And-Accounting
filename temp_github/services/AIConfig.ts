
export interface AIProvider {
    id: string;
    name: string;
    defaultModel: string;
    models: string[];
    baseUrl?: string;
    description: string;
}

export const EXTERNAL_PROVIDERS: AIProvider[] = [
    {
        id: 'openai',
        name: 'OpenAI',
        defaultModel: 'gpt-4o',
        models: [
            'gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo',
            'gpt-3.5-turbo-0125', 'gpt-4-0125-preview', 'gpt-4-vision-preview'
        ],
        baseUrl: 'https://api.openai.com/v1/chat/completions',
        description: 'Industry standard models from OpenAI.'
    },
    {
        id: 'groq',
        name: 'Groq',
        defaultModel: 'groq/compound-mini',
        models: [
            'llama-3.3-70b-versatile', 
            'llama-3.1-8b-instant',
            'groq/compound',
            'groq/compound-mini',
            'openai/gpt-oss-120b',
            'openai/gpt-oss-20b',
            'whisper-large-v3',
            'whisper-large-v3-turbo'
        ],
        baseUrl: 'https://api.groq.com/openai/v1/chat/completions',
        description: 'Ultra-fast inference for Llama, Compound and GPT-OSS.'
    },
    {
        id: 'anthropic',
        name: 'Anthropic',
        defaultModel: 'claude-3-5-sonnet-20240620',
        models: [
            'claude-3-5-sonnet-20240620', 'claude-3-opus-20240229', 
            'claude-3-sonnet-20240229', 'claude-3-haiku-20240307',
            'claude-2.1', 'claude-2.0'
        ],
        baseUrl: 'https://api.anthropic.com/v1/messages',
        description: 'Advanced reasoning models with Claude.'
    },
    {
        id: 'openrouter',
        name: 'OpenRouter',
        defaultModel: 'meta-llama/llama-3-70b-instruct',
        models: [
            'meta-llama/llama-3-70b-instruct',
            'meta-llama/llama-3-8b-instruct',
            'google/gemini-pro-1.5',
            'google/gemini-flash-1.5',
            'anthropic/claude-3.5-sonnet',
            'mistralai/mistral-large',
            'mistralai/pixtral-12b',
            'qwen/qwen-2-72b-instruct',
            'gryphe/mythomax-l2-13b',
            'nousresearch/hermes-3-llama-3.1-405b'
        ],
        baseUrl: 'https://openrouter.ai/api/v1/chat/completions',
        description: 'Unified API for dozens of open and closed models.'
    },
    {
        id: 'mistral',
        name: 'Mistral AI',
        defaultModel: 'mistral-large-latest',
        models: ['mistral-large-latest', 'mistral-medium-latest', 'mistral-small-latest', 'codestral-latest'],
        baseUrl: 'https://api.mistral.ai/v1/chat/completions',
        description: 'European high-performance open-weight models.'
    },
    {
        id: 'deepseek',
        name: 'DeepSeek',
        defaultModel: 'deepseek-chat',
        models: ['deepseek-chat', 'deepseek-coder'],
        baseUrl: 'https://api.deepseek.com/chat/completions',
        description: 'Cost-efficient and capable models from DeepSeek.'
    },
    {
        id: 'together',
        name: 'Together AI',
        defaultModel: 'meta-llama/Llama-3-70b-chat-hf',
        models: [
            'meta-llama/Llama-3-70b-chat-hf',
            'meta-llama/Llama-3-8b-chat-hf',
            'mistralai/Mixtral-8x7B-Instruct-v0.1',
            'databricks/dbrx-instruct'
        ],
        baseUrl: 'https://api.together.xyz/v1/chat/completions',
        description: 'Leading platform for open-source model inference.'
    },
    {
        id: 'perplexity',
        name: 'Perplexity',
        defaultModel: 'llama-3-sonar-large-32k-online',
        models: ['llama-3-sonar-large-32k-online', 'llama-3-sonar-small-32k-online'],
        baseUrl: 'https://api.perplexity.ai/chat/completions',
        description: 'Search-grounded LLM completions.'
    },
    {
        id: 'fireworks',
        name: 'Fireworks AI',
        defaultModel: 'accounts/fireworks/models/llama-v3-70b-instruct',
        models: ['llama-v3-70b-instruct', 'mixtral-8x22b-instruct', 'starcoder-16b', 'dbrx-instruct'],
        baseUrl: 'https://api.fireworks.ai/inference/v1/chat/completions',
        description: 'Blazing fast inference and fine-tuned models.'
    },
    {
        id: 'deepinfra',
        name: 'DeepInfra',
        defaultModel: 'meta-llama/Meta-Llama-3-70B-Instruct',
        models: ['meta-llama/Meta-Llama-3-70B-Instruct', 'mistralai/Mixtral-8x22B-Instruct-v0.1', 'microsoft/WizardLM-2-8x22B'],
        baseUrl: 'https://api.deepinfra.com/v1/openai/chat/completions',
        description: 'Affordable and scalable open-source model hosting.'
    },
    {
        id: 'cerebras',
        name: 'Cerebras',
        defaultModel: 'llama3.1-70b',
        models: ['llama3.1-70b', 'llama3.1-8b'],
        baseUrl: 'https://api.cerebras.ai/v1/chat/completions',
        description: 'World fastest inference specialized for Llama models.'
    },
    {
        id: 'sambanova',
        name: 'SambaNova',
        defaultModel: 'Meta-Llama-3.1-70B-Instruct',
        models: ['Meta-Llama-3.1-405B-Instruct', 'Meta-Llama-3.1-70B-Instruct', 'Llama-3.2-1B-Instruct'],
        baseUrl: 'https://api.sambanova.ai/v1/chat/completions',
        description: 'High-performance computing for ultra-large models.'
    },
    {
        id: 'xai',
        name: 'xAI (Grok)',
        defaultModel: 'grok-beta',
        models: ['grok-beta', 'grok-1'],
        baseUrl: 'https://api.x.ai/v1/chat/completions',
        description: 'Advanced reasoning and humor from Elon Musk xAI.'
    },
    {
        id: 'cohere',
        name: 'Cohere',
        defaultModel: 'command-r-plus',
        models: ['command-r-plus', 'command-r', 'command-light'],
        baseUrl: 'https://api.cohere.ai/v1/chat',
        description: 'Enterprise AI focused on RAG and tool-use.'
    },
    {
        id: 'replicate',
        name: 'Replicate',
        defaultModel: 'meta/llama-3-70b-instruct',
        models: ['meta/llama-3-70b-instruct', 'mistralai/mixtral-8x7b-instruct-v0.1', 'replicate/flan-t5-xl'],
        baseUrl: 'https://api.replicate.com/v1/chat/completions',
        description: 'Run machine learning models with a simple cloud API.'
    },
    {
        id: 'octoai',
        name: 'OctoAI',
        defaultModel: 'meta-llama-3-70b-instruct',
        models: ['meta-llama-3-70b-instruct', 'mixtral-8x22b-finetuned', 'hermes-2-pro-llama-3-8b'],
        baseUrl: 'https://api.octoai.cloud/v1/chat/completions',
        description: 'Effortless model optimization and execution.'
    },
    {
        id: 'anyscale',
        name: 'Anyscale',
        defaultModel: 'meta-llama/Meta-Llama-3-70B-Instruct',
        models: ['meta-llama/Meta-Llama-3-70B-Instruct', 'mistralai/Mixtral-8x7B-Instruct-v0.1'],
        baseUrl: 'https://api.endpoints.anyscale.com/v1/chat/completions',
        description: 'Production-ready LLM endpoints powered by Ray.'
    },
    {
        id: 'lepton',
        name: 'Lepton AI',
        defaultModel: 'llama3-70b',
        models: ['llama3-70b', 'llama3-8b', 'mixtral-8x7b'],
        baseUrl: 'https://api.lepton.ai/v1/chat/completions',
        description: 'Simple and fast deployment for AI applications.'
    },
    {
        id: 'cloudflare',
        name: 'Cloudflare Workers AI',
        defaultModel: '@cf/meta/llama-3-70b-instruct',
        models: ['@cf/meta/llama-3-70b-instruct', '@cf/mistral/mistral-7b-instruct-v0.1'],
        baseUrl: 'https://api.cloudflare.com/client/v4/accounts/{account_id}/ai/v1/chat/completions',
        description: 'Run models globally on the Cloudflare edge network.'
    },
    {
        id: 'ai21',
        name: 'AI21 Labs',
        defaultModel: 'jamba-1.5-large',
        models: ['jamba-1.5-large', 'jamba-1.5-mini'],
        baseUrl: 'https://api.ai21.com/studio/v1/chat/completions',
        description: 'Pioneering Large Language Models from AI21.'
    },
    {
        id: 'abacus',
        name: 'Abacus.ai',
        defaultModel: 'abacus-giraffe-70b',
        models: ['abacus-giraffe-70b', 'abacus-llama-3-8b'],
        baseUrl: 'https://api.abacus.ai/api/v1/openai/chat/completions',
        description: 'End-to-end AI platform for custom model training.'
    },
    {
        id: 'predibase',
        name: 'Predibase',
        defaultModel: 'meta-llama-3-70b-instruct',
        models: ['meta-llama-3-70b-instruct', 'mistral-7b-v0.1'],
        baseUrl: 'https://api.predibase.com/v1/openai/chat/completions',
        description: 'Scalable infrastructure for fine-tuning and hosting.'
    },
    {
        id: 'lambda',
        name: 'Lambda Labs',
        defaultModel: 'hermes-2-pro-llama-3-8b',
        models: ['hermes-2-pro-llama-3-8b'],
        baseUrl: 'https://api.lambdalabs.com/v1/chat/completions',
        description: 'GPU-accelerated cloud for deep learning.'
    },
    {
        id: 'runpod',
        name: 'RunPod',
        defaultModel: 'llama-3-70b',
        models: ['llama-3-70b', 'mistral-7b'],
        baseUrl: 'https://api.runpod.ai/v1/openai/chat/completions',
        description: 'Serverless GPU instances for inference.'
    },
    {
        id: 'huggingface',
        name: 'Hugging Face',
        defaultModel: 'meta-llama/Llama-3-70b-chat-hf',
        models: ['Llama-3-70b-chat-hf', 'Mixtral-8x7B-Instruct-v0.1', 'StarCoder2-15b'],
        baseUrl: 'https://api-inference.huggingface.co/v1/chat/completions',
        description: 'Inference API for thousands of open models.'
    },
    {
        id: 'modzy',
        name: 'Modzy',
        defaultModel: 'llama-3-70b',
        models: ['llama-3-70b'],
        baseUrl: 'https://api.modzy.com/v1/openai/chat/completions',
        description: 'Secure enterprise AI deployment platform.'
    },
    {
        id: 'monsterapi',
        name: 'MonsterAPI',
        defaultModel: 'llama-3-70b-instruct',
        models: ['llama-3-70b-instruct', 'mixtral-8x7b-instruct'],
        baseUrl: 'https://api.monsterapi.ai/v1/openai/chat/completions',
        description: 'Simplified API for high-performance open-source models.'
    },
    {
        id: 'nim',
        name: 'NVIDIA NIM',
        defaultModel: 'meta/llama3-70b-instruct',
        models: ['meta/llama3-70b-instruct', 'nvidia/nemotron-4-340b-instruct', 'z-ai/glm-4-9b', 'z-ai/glm4.7'],
        baseUrl: 'https://integrate.api.nvidia.com/v1',
        description: 'Optimized inference microservices from NVIDIA.'
    },
    {
        id: 'cerebras_exp',
        name: 'Cerebras Exp',
        defaultModel: 'llama3.1-405b-experimental',
        models: ['llama3.1-405b-experimental'],
        baseUrl: 'https://api.cerebras.ai/v1/chat/completions',
        description: 'Experimental high-scale inference blocks.'
    },
    {
        id: '9router',
        name: '9router',
        defaultModel: 'llama-3-70b',
        models: ['llama-3-70b', 'gpt-4o-mini', 'claude-3-5-sonnet'],
        baseUrl: 'http://localhost:20128/v1',
        description: 'Local high-performance AI routing. No API key required.'
    },
    {
        id: 'vertex',
        name: 'Google Vertex AI',
        defaultModel: 'gemini-1.5-pro',
        models: ['gemini-1.5-pro', 'gemini-1.5-flash', 'claude-3-5-sonnet@20240620', 'meta/llama3-70b'],
        baseUrl: 'https://{region}-aiplatform.googleapis.com/v1/projects/{project_id}/locations/{region}/publishers/google/models/{model_id}:streamGenerateContent',
        description: 'Enterprise AI on Google Cloud Platform.'
    },
    {
        id: 'azure',
        name: 'Azure OpenAI',
        defaultModel: 'gpt-4o',
        models: ['gpt-4o', 'gpt-35-turbo', 'gpt-4-turbo'],
        baseUrl: 'https://{resource-name}.openai.azure.com/openai/deployments/{deployment-id}/chat/completions?api-version=2024-02-15-preview',
        description: 'Microsoft Azure hosted OpenAI models.'
    },
    {
        id: 'aws_bedrock',
        name: 'AWS Bedrock',
        defaultModel: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
        models: [
            'anthropic.claude-3-5-sonnet-20240620-v1:0',
            'meta.llama3-70b-instruct-v1:0',
            'amazon.titan-text-premier-v1:0',
            'cohere.command-r-plus-v1:0'
        ],
        baseUrl: 'https://bedrock-runtime.{region}.amazonaws.com/model/{modelId}/invoke',
        description: 'Amazon Web Services fully managed foundation models.'
    },
    {
        id: 'inferless',
        name: 'Inferless',
        defaultModel: 'llama-3-70b',
        models: ['llama-3-70b', 'mistral-large'],
        baseUrl: 'https://api.inferless.com/v1/deployments/{deployment_id}/tasks',
        description: 'Serverless inference for customized LLMs.'
    },
    {
        id: 'gradient',
        name: 'Gradient AI',
        defaultModel: 'nous-hermes-2-llama-3-70b',
        models: ['nous-hermes-2-llama-3-70b', 'llama-3-8b'],
        baseUrl: 'https://api.gradient.ai/projects/{project_id}/models/{model_id}/complete',
        description: 'Fine-tuning and inference platform for open models.'
    },
    {
        id: 'baseten',
        name: 'Baseten',
        defaultModel: 'llama-3-70b',
        models: ['llama-3-70b', 'mistral-7b'],
        baseUrl: 'https://model-{model_id}.api.baseten.co/v1/chat/completions',
        description: 'Production-ready infrastructure for ML models.'
    },
    {
        id: 'beam',
        name: 'Beam.cloud',
        defaultModel: 'llama-3-70b',
        models: ['llama-3-70b'],
        baseUrl: 'https://api.beam.cloud/v1/chat/completions',
        description: 'Optimized GPU compute for LLM tasks.'
    },
    {
        id: 'bannana',
        name: 'Banana.dev',
        defaultModel: 'llama-3-70b',
        models: ['llama-3-70b'],
        baseUrl: 'https://api.banana.dev/v1/chat/completions',
        description: 'Scalable serverless GPU infrastructure.'
    },
    {
        id: 'voyage',
        name: 'Voyage AI',
        defaultModel: 'voyage-2',
        models: ['voyage-2', 'voyage-code-2'],
        baseUrl: 'https://api.voyageai.com/v1/embeddings',
        description: 'Specialized embedding and retrieval models.'
    },
    {
        id: 'jina',
        name: 'Jina AI',
        defaultModel: 'jina-embeddings-v2-base-en',
        models: ['jina-embeddings-v2-base-en', 'jina-reranker-v1-base-en'],
        baseUrl: 'https://api.jina.ai/v1/embeddings',
        description: 'Advanced search and retrieval engine models.'
    },
    {
        id: 'writer',
        name: 'Writer',
        defaultModel: 'palmyra-x-003',
        models: ['palmyra-x-003', 'palmyra-med'],
        baseUrl: 'https://api.writer.com/v1/chat/completions',
        description: 'Full-stack generative AI for the enterprise.'
    },
    {
        id: 'nlp_cloud',
        name: 'NLP Cloud',
        defaultModel: 'dolphin-llama-3-70b',
        models: ['dolphin-llama-3-70b', 'finetuned-llama-3-70b'],
        baseUrl: 'https://api.nlpcloud.io/v1/gpu/{model}/chat',
        description: 'High performance NLP API based on open models.'
    },
    {
        id: 'textsynth',
        name: 'TextSynth',
        defaultModel: 'llama3_70b',
        models: ['llama3_70b', 'mistral_7b', 'falcon_180b'],
        baseUrl: 'https://api.textsynth.com/v1/engines/{engine}/completions',
        description: 'Simple and fast API for various open-source models.'
    },
    {
        id: 'segmind',
        name: 'Segmind',
        defaultModel: 'llama-3-70b',
        models: ['llama-3-70b', 'stable-diffusion-xl'],
        baseUrl: 'https://api.segmind.com/v1/chat/completions',
        description: 'Fast and reliable AI model APIs.'
    },
    {
        id: 'hive',
        name: 'Hive AI',
        defaultModel: 'hive-llama-3',
        models: ['hive-llama-3'],
        baseUrl: 'https://api.thehive.ai/api/v2/task/chat/completions',
        description: 'Content moderation and specialized AI services.'
    },
    {
        id: 'neuralspace',
        name: 'NeuralSpace',
        defaultModel: 'bhashini-translation',
        models: ['bhashini-translation', 'llama-3-indic'],
        baseUrl: 'https://api.neuralspace.ai/v2/chat/completions',
        description: 'AI platform focused on localized Indian languages.'
    },
    {
        id: 'petals',
        name: 'Petals (Decentralized)',
        defaultModel: 'meta-llama/Llama-3-70b-instruct',
        models: ['meta-llama/Llama-3-70b-instruct', 'tiiuae/falcon-180B-chat'],
        baseUrl: 'https://chat.petals.dev/api/v1/chat/completions',
        description: 'Distributed inference via P2P network.'
    },
    {
        id: 'novita',
        name: 'Novita AI',
        defaultModel: 'meta-llama/llama-3-70b-instruct',
        models: ['meta-llama/llama-3-70b-instruct', 'meta-llama/llama-3-8b-instruct', 'mistralai/mistral-7b-instruct'],
        baseUrl: 'https://api.novita.ai/v1/openai/chat/completions',
        description: 'Stable Diffusion and LLM APIs for developers.'
    },
    {
        id: 'friendli',
        name: 'FriendliAI',
        defaultModel: 'llama-3-70b-instruct',
        models: ['llama-3-70b-instruct', 'llama-3-8b-instruct', 'mixtral-8x7b-instruct'],
        baseUrl: 'https://api.friendli.ai/v1/chat/completions',
        description: 'High-throughput inference engine for LLMs.'
    },
    {
        id: 'upstage',
        name: 'Upstage',
        defaultModel: 'solar-1-mini-chat',
        models: ['solar-1-mini-chat', 'solar-1-mini-grounded-chat'],
        baseUrl: 'https://api.upstage.ai/v1/solar/chat/completions',
        description: 'Korean AI leader specializing in Solar models.'
    },
    {
        id: 'ollama',
        name: 'Ollama (Local)',
        defaultModel: 'llama3',
        models: ['llama3', 'mistral', 'gemma2', 'phi3'],
        baseUrl: 'http://localhost:11434/v1/chat/completions',
        description: 'Run your own models locally on your hardware.'
    },
    {
        id: 'lm_studio',
        name: 'LM Studio (Local)',
        defaultModel: 'loaded_model',
        models: ['loaded_model'],
        baseUrl: 'http://localhost:1234/v1/chat/completions',
        description: 'OpenAI-compatible local server for LLMs.'
    },
    {
        id: 'vllm',
        name: 'vLLM (Private Host)',
        defaultModel: 'model_id',
        models: ['model_id'],
        baseUrl: 'http://your-server-ip:8000/v1/chat/completions',
        description: 'Connect to your private instances running vLLM.'
    }
];

export const INTERNAL_GEMINI_MODELS = [
    { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash (Latest & Fast)' },
    { id: 'gemini-2.0-flash-thinking-exp', name: 'Gemini 2.0 Flash Thinking (Deep Reasoning)' },
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro (High Intelligence)' },
    { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash (Stable Performance)' },
    { id: 'gemini-1.5-flash-8b', name: 'Gemini 1.5 Flash-8B (Ultra Fast)' }
];
