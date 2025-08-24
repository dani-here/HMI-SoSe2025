namespace LLMWrapper.Models
{
    public class LLMConfig
    {
        public int MinResponseMs { get; set; }
        public int MaxAllowedParticipants { get; set; }
        public required string OpenAPIKey { get; set; }
        public required string DefaultModel { get; set; }
        public required string MasterPrompt { get; set; }
        public required string OpenAIBaseUrl { get; set; }
    }
}
