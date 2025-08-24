using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace LLMWrapper.DBContext
{
    public class TaskSurvey
    {
        [Key]
        public Guid Id { get; set; }
        [ForeignKey("Participant")]
        public Guid ParticipantId { get; set; }

        public required string TaskType { get; set; }
        public required int FinalOutputSatisfaction { get; set; } // Likert value 1-5
        public required int LLMOutputAccuracy { get; set; } // Likert value 1-5
        public required int RequiredPromptRevisionsForAccuracy { get; set; } // Likert value 1-5
        
        public required bool FinalOutputSatisfactory { get; set; } // Yes/No
        public required bool WouldUseCurrentLLMOutputInRealWorld { get; set; } // Yes/No
        
        public string? ParticipantTaskSurveyJSON { get; set; }
        public required string PoorLLMOutputRemarks { get; set; }
        public double SurveyDuration { get; set; }  // time taken to complete
    }
}
