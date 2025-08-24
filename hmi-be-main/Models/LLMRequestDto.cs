using System.ComponentModel.DataAnnotations;

namespace LLMWrapper.Models
{
    public class LLMRequestDto
    {
        [Required]
        public Guid ParticipantId { get; set; }
        [Required]
        public string Prompt { get; set; } = string.Empty;
        [Required]
        public Guid TaskId { get; set; }
    }
}