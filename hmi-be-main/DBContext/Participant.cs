using LLMWrapper.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LLMWrapper.DBContext
{
    public class Participant
    {
        [Key]
        public Guid Id { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ParticipantNumber { get; set; } // incremental id
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // general fields
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string Email { get; set; }
        public long MatriculationNumber { get; set; }
        public int Age { get; set; }
        public Gender Gender { get; set; }
        public bool HasPreviousLLMExperience { get; set; }
        public LLMFrequency LLMUsageFrequency { get; set; } // likert value
        public PromptConfidence PromptConfidence { get; set; } // Likert value
        public bool HasProgrammingExperience { get; set; }
    }
}
