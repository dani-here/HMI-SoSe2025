using LLMWrapper.Enums;

namespace LLMWrapper.Models
{
    public class RegisterParticipantRequestDto
    {
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string Email { get; set; }
        public long MatriculationNumber { get; set; }
        public int Age { get; set; }
        public Gender Gender { get; set; }
        public bool HasPreviousLLMExperience { get; set; }
        public LLMFrequency LLMUsageFrequency { get; set; }
        public PromptConfidence PromptConfidence { get; set; }
        public bool HasProgrammingExperience { get; set; }
    }
}
