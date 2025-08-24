using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LLMWrapper.DBContext
{
    public class LLMRequestLog
    {
        [Key]
        public Guid Id { get; set; }

        [ForeignKey("Participant")]
        public Guid ParticipantId { get; set; }

        [ForeignKey("Task")]
        public Guid TaskId { get; set; }
        public virtual Task? Task { get; set; } 

        public string Prompt { get; set; } = string.Empty;
        public string LLMResponse { get; set; } = string.Empty;
        public DateTime RequestTime { get; set; } = DateTime.UtcNow;
        public DateTime ResponseTime { get; set; } = DateTime.UtcNow;
        public long ResponseDurationMs { get; set; }
        public string? ModelUsed { get; set; }
        public string? AdditionalMetadata { get; set; }
        public int InputTokens { get; set; } = 0;
        public int OutputTokens { get; set; } = 0;
        public bool? ThumbsUp { get; set; } // true = thumbs up, false = thumbs down, null = not rated
    }
}