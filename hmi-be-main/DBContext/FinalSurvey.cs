using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LLMWrapper.DBContext
{
    public class FinalSurvey
    {
        [Key]
        public Guid Id { get; set; }

        // foreign key relationship
        [ForeignKey("Participant")]
        public Guid ParticipantId { get; set; }

        // core survey questions
        public string? OverallTaskThoughts { get; set; }  // what did you think about the tasks overall?
        public string? LLMExperienceDescription { get; set; }  // how would you describe your experience?
        public string? HelpfulUnhelpfulMoments { get; set; }  // helpful/unhelpful moments with elaboration
        public string? ConfusingOrUnrealisticTasks { get; set; }  // which tasks felt confusing/unrealistic
        public string? LLMExpectationVariance { get; set; }  // were responses as expected? Why/why not?
        public string? SuggestedImprovements { get; set; }  // suggested changes for improvement
        public string? SurprisingLLMBehavior { get; set; }  // positive/negative surprises

        // feedback experience (Likert scale 1-5)
        public int? FeedbackProcessRating { get; set; }  // 1=Very difficult, 5=Very easy
        public bool? FoundFeedbackRepetitive { get; set; }
        public bool? FoundFeedbackHelpful { get; set; }

        // metadata
        public DateTime CompletionDate { get; set; } = DateTime.UtcNow;
        public double SurveyDuration { get; set; }  // time taken to complete
        public double TotalStudyTime { get; set; }  // total time spent in study

        // additional logging
        public string? FinalSurveyJSON { get; set; }
        public string? AdditionalComments { get; set; }  // any other thoughts
    }
}
