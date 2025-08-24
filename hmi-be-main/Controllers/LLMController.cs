using LLMWrapper.DBContext;
using LLMWrapper.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Diagnostics;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace LLMWrapper.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class LLMController(
        StudyDbContext context,
        IOptions<LLMConfig> llmConfig,
        IHttpClientFactory httpClientFactory
        ) : ControllerBase
    {
        private readonly LLMConfig _llmConfig = llmConfig.Value;

        [HttpPost("gpt")]
        public async Task<ActionResult<LLMResponseDto>> CallGpt([FromBody] LLMRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(request.Prompt))
                return BadRequest("Prompt is required.");

            if (!context.Participants.Any(p => p.Id == request.ParticipantId))
                return BadRequest("Participant not found. Please register first.");

            if (!context.Tasks.Any(o => o.Id == request.TaskId))
                return BadRequest("Task not found. Please specify correct task.");

            // max participant limit
            if (context.Participants.Count() >= _llmConfig.MaxAllowedParticipants)
                return BadRequest("Maximum participant limit reached. No more participants allowed.");

            var stopwatch = Stopwatch.StartNew();
            var client = httpClientFactory.CreateClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _llmConfig.OpenAPIKey);

            // fetching logs from the database & process them in memory
            var logs = context.LLMRequestLogs
                .Where(l => l.TaskId == request.TaskId && l.ParticipantId == request.ParticipantId)
                .OrderBy(l => l.RequestTime)
                .ToList();

            var history = logs
                .SelectMany(l => new[]
                {
                    new { role = "user", content = l.Prompt },
                    string.IsNullOrEmpty(l.LLMResponse) ? null : new { role = "assistant", content = l.LLMResponse }
                })
                .Where(x => x != null) // filtering nulls
                .ToList();

            // current user prompt
            history.Add(new { role = "user", content = request.Prompt });

            var messages = new List<object>
            {
                new { role = "system", content = _llmConfig.MasterPrompt }
            };
            messages.AddRange(history);

            var apiRequest = new
            {
                model = _llmConfig.DefaultModel,
                messages
            };

            var content = new StringContent(JsonSerializer.Serialize(apiRequest), Encoding.UTF8, "application/json");
            var apiResponse = await client.PostAsync(_llmConfig.OpenAIBaseUrl, content);

            string llmResponse = string.Empty;
            int promptTokens = 0, completionTokens = 0;

            if (apiResponse.IsSuccessStatusCode)
            {
                using var responseStream = await apiResponse.Content.ReadAsStreamAsync();
                using var doc = await JsonDocument.ParseAsync(responseStream);

                llmResponse = doc.RootElement
                    .GetProperty("choices")[0]
                    .GetProperty("message")
                    .GetProperty("content")
                    .GetString() ?? "";

                if (doc.RootElement.TryGetProperty("usage", out JsonElement usage))
                {
                    promptTokens = usage.GetProperty("prompt_tokens").GetInt32();
                    completionTokens = usage.GetProperty("completion_tokens").GetInt32();
                }
            }
            else
            {
                llmResponse = $"Error: {apiResponse.StatusCode}";
            }

            stopwatch.Stop();
            var elapsedMs = stopwatch.ElapsedMilliseconds;

            if (elapsedMs < _llmConfig.MinResponseMs)
                await System.Threading.Tasks.Task.Delay(_llmConfig.MinResponseMs - (int)elapsedMs);

            // logging request and response
            var log = new LLMRequestLog
            {
                Prompt = request.Prompt,
                LLMResponse = llmResponse,
                ResponseDurationMs = elapsedMs,
                ResponseTime = DateTime.UtcNow,
                ParticipantId = request.ParticipantId,
                TaskId = request.TaskId,
                ModelUsed = _llmConfig.DefaultModel,
                RequestTime = DateTime.UtcNow.AddMilliseconds(-elapsedMs),
                InputTokens = promptTokens,
                OutputTokens = completionTokens,
            };
            context.LLMRequestLogs.Add(log);
            await context.SaveChangesAsync();

            return Ok(new LLMResponseDto
            {
                Id = log.Id,
                Response = llmResponse,
                DurationMs = elapsedMs
            });
        }

        [HttpPost("feedback")]
        public async Task<ActionResult> SubmitFeedback([FromBody] LLMFeedbackDto feedback)
        {
            var log = await context.LLMRequestLogs.FindAsync(feedback.LogId);

            if (log == null)
                return NotFound("Log entry not found.");

            log.ThumbsUp = feedback.ThumbsUp;
            await context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Feedback recorded successfully.",
                LogId = log.Id,
                log.ThumbsUp
            });
        }
    }
}