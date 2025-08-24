using LLMWrapper.DBContext;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace LLMWrapper.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class SurveyController(StudyDbContext context) : ControllerBase
    {
        [HttpPost("task")]
        public async Task<IActionResult> SubmitTaskSurvey([FromBody] TaskSurvey survey)
        {
            if (survey == null)
                return BadRequest("Survey data is required.");

            context.TaskSurveys.Add(survey);
            await context.SaveChangesAsync();
            return Ok(new { survey.Id });
        }

        [HttpPost("final")]
        public async Task<IActionResult> SubmitFinalSurvey([FromBody] FinalSurvey survey)
        {
            if (survey == null)
                return BadRequest("Survey data is required.");

            context.FinalSurvey.Add(survey);
            await context.SaveChangesAsync();
            return Ok(new { survey.Id });
        }
    }
}