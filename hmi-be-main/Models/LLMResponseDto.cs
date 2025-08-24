namespace LLMWrapper.Models
{
    public class LLMResponseDto
    {
        public Guid Id { get; set; }
        public long DurationMs { get; set; }
        public string Response { get; set; } = string.Empty;
    }
}