namespace LLMWrapper.Models
{
    public class RegisterParticipantResponseDto
    {
        public Guid ParticipantId { get; set; }
        public int ParticipantNumber { get; set; }
        public List<string> TaskSequence { get; set; } = [];
        public List<DBContext.Task> TaskList { get; set; } = [];
    }
}
