using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace LLMWrapper.Migrations
{
    /// <inheritdoc />
    public partial class intialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Participants",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ParticipantNumber = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FirstName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MatriculationNumber = table.Column<long>(type: "bigint", nullable: false),
                    Age = table.Column<int>(type: "int", nullable: false),
                    Gender = table.Column<int>(type: "int", nullable: false),
                    HasPreviousLLMExperience = table.Column<bool>(type: "bit", nullable: false),
                    LLMUsageFrequency = table.Column<int>(type: "int", nullable: false),
                    PromptConfidence = table.Column<int>(type: "int", nullable: false),
                    HasProgrammingExperience = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Participants", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Tasks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Data = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tasks", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "FinalSurvey",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ParticipantId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    OverallTaskThoughts = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LLMExperienceDescription = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    HelpfulUnhelpfulMoments = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConfusingOrUnrealisticTasks = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LLMExpectationVariance = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SuggestedImprovements = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SurprisingLLMBehavior = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FeedbackProcessRating = table.Column<int>(type: "int", nullable: true),
                    FoundFeedbackRepetitive = table.Column<bool>(type: "bit", nullable: true),
                    FoundFeedbackHelpful = table.Column<bool>(type: "bit", nullable: true),
                    CompletionDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    SurveyDuration = table.Column<double>(type: "float", nullable: false),
                    TotalStudyTime = table.Column<double>(type: "float", nullable: false),
                    FinalSurveyJSON = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AdditionalComments = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FinalSurvey", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FinalSurvey_Participants_ParticipantId",
                        column: x => x.ParticipantId,
                        principalTable: "Participants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TaskSurveys",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ParticipantId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TaskType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FinalOutputSatisfaction = table.Column<int>(type: "int", nullable: false),
                    LLMOutputAccuracy = table.Column<int>(type: "int", nullable: false),
                    RequiredPromptRevisionsForAccuracy = table.Column<int>(type: "int", nullable: false),
                    FinalOutputSatisfactory = table.Column<bool>(type: "bit", nullable: false),
                    WouldUseCurrentLLMOutputInRealWorld = table.Column<bool>(type: "bit", nullable: false),
                    ParticipantTaskSurveyJSON = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PoorLLMOutputRemarks = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SurveyDuration = table.Column<double>(type: "float", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TaskSurveys", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TaskSurveys_Participants_ParticipantId",
                        column: x => x.ParticipantId,
                        principalTable: "Participants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LLMRequestLogs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ParticipantId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TaskId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Prompt = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LLMResponse = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RequestTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ResponseTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ResponseDurationMs = table.Column<long>(type: "bigint", nullable: false),
                    ModelUsed = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AdditionalMetadata = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    InputTokens = table.Column<int>(type: "int", nullable: false),
                    OutputTokens = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LLMRequestLogs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LLMRequestLogs_Participants_ParticipantId",
                        column: x => x.ParticipantId,
                        principalTable: "Participants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_LLMRequestLogs_Tasks_TaskId",
                        column: x => x.TaskId,
                        principalTable: "Tasks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Tasks",
                columns: new[] { "Id", "Data", "Description", "Name", "Type" },
                values: new object[,]
                {
                    { new Guid("1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d"), "", "List advantages and disadvantages of vaccination.", "Pro/Con Analysis", "Analytical" },
                    { new Guid("3fa85f64-5717-4562-b3fc-2c963f66afa6"), "", "Classify and explain why the following three email excerpts as spam or not spam.", "Spam Detection", "Labeling" },
                    { new Guid("6b5c4d3e-2f1a-9e8d-7c6b-5a4f3e2d1c0f"), "", "Perform addition using recursion.", "Simple Programming", "Procedural" },
                    { new Guid("9c8d7e6f-5a4b-3c2d-1e0f-9a8b7c6d5e4f"), "", "Write a tweet for a tech product launch.", "Social Media Post", "Creative" },
                    { new Guid("a7b3c9d1-e8f4-4a2b-9c6d-1e3f5a7b9c2d"), "lorem ipsum", "Label the sentiment (positive/negative/neutral) for reviews.", "Sentiment Analysis", "Labeling" },
                    { new Guid("d4e5f6a7-b8c9-4d3e-9f1a-2b3c4d5e6f70"), "lorem ipsum...", "Summarize the article in exactly 3 sentences.", "Text summarization", "Analytical" },
                    { new Guid("e4d5c6b7-a8f9-0e1d-2c3b-4a5f6e7d8c90"), "", "Solve the hat color puzzle.", "Logic Puzzle", "Procedural" },
                    { new Guid("f0e1d2c3-b4a5-6f7e-8d9c-0b1a2f3e4d5c"), "", "Write an engaging opening paragraph.", "Story Opening", "Creative" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_FinalSurvey_ParticipantId",
                table: "FinalSurvey",
                column: "ParticipantId");

            migrationBuilder.CreateIndex(
                name: "IX_LLMRequestLogs_ParticipantId",
                table: "LLMRequestLogs",
                column: "ParticipantId");

            migrationBuilder.CreateIndex(
                name: "IX_LLMRequestLogs_TaskId",
                table: "LLMRequestLogs",
                column: "TaskId");

            migrationBuilder.CreateIndex(
                name: "IX_TaskSurveys_ParticipantId",
                table: "TaskSurveys",
                column: "ParticipantId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FinalSurvey");

            migrationBuilder.DropTable(
                name: "LLMRequestLogs");

            migrationBuilder.DropTable(
                name: "TaskSurveys");

            migrationBuilder.DropTable(
                name: "Tasks");

            migrationBuilder.DropTable(
                name: "Participants");
        }
    }
}
