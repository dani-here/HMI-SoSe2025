using LLMWrapper.DBContext;
using LLMWrapper.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Swashbuckle.AspNetCore.Annotations;

namespace LLMWrapper.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class ParticipantsController(
        StudyDbContext context,
        IOptions<LLMConfig> llmConfig,
        IOptions<List<List<string>>> latinSquareSequences) : ControllerBase
    {
        private readonly LLMConfig _llmConfig = llmConfig.Value;
        private readonly List<List<string>> _latinSquareSequences = latinSquareSequences.Value;

        [HttpGet("online-status")]
        [SwaggerOperation(Summary = "Returns whether API is online and accessible.")]
        public ActionResult<string> GetOnlineStatus()
        {
            return Ok("API is online & accessible.");
        }


        [HttpPost("register")]
        [SwaggerOperation(Summary = "Register a study participant", Description = "Returns a user id and latin square sequence.")]
        public async Task<ActionResult<RegisterParticipantResponseDto>> RegisterParticipant([FromBody] RegisterParticipantRequestDto request)
        {
            var existingParticipant = await context.Participants.FirstOrDefaultAsync(p => p.Email == request.Email);
            if (existingParticipant != null) 
                return Conflict("Participant already exists");

            // max participant limit
            if (context.Participants.Count() >= _llmConfig.MaxAllowedParticipants)
                return BadRequest("Maximum participant limit reached. No more participants allowed.");

            var participant = new Participant
            {
                Age = request.Age,
                Email = request.Email,
                Gender = request.Gender,
                LastName = request.LastName,
                FirstName = request.FirstName,
                PromptConfidence = request.PromptConfidence,
                LLMUsageFrequency = request.LLMUsageFrequency,
                MatriculationNumber = request.MatriculationNumber,
                HasPreviousLLMExperience = request.HasPreviousLLMExperience,
                HasProgrammingExperience = request.HasProgrammingExperience
            };

            context.Participants.Add(participant);
            await context.SaveChangesAsync();

            // shuffling latin square sequence
            int index = (participant.ParticipantNumber - 1) % _latinSquareSequences.Count;
            var assignedSequence = _latinSquareSequences[index];

            // task list 
            var allTasks = await context.Tasks.ToListAsync();
            var orderedTasks = assignedSequence
                .SelectMany(type => allTasks.Where(task => task.Type.Equals(type, StringComparison.OrdinalIgnoreCase)))
                .ToList();

            var response = new RegisterParticipantResponseDto
            {
                TaskList = orderedTasks,
                ParticipantId = participant.Id,
                TaskSequence = [.. assignedSequence],
                ParticipantNumber = participant.ParticipantNumber,
            };

            return Ok(response);
        }
    }

}
