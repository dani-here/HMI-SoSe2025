using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LLMWrapper.Migrations
{
    /// <inheritdoc />
    public partial class IntegrationTestingUpdates : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FinalSurvey_Participants_ParticipantId",
                table: "FinalSurvey");

            migrationBuilder.DropForeignKey(
                name: "FK_LLMRequestLogs_Participants_ParticipantId",
                table: "LLMRequestLogs");

            migrationBuilder.DropForeignKey(
                name: "FK_TaskSurveys_Participants_ParticipantId",
                table: "TaskSurveys");

            migrationBuilder.DropIndex(
                name: "IX_TaskSurveys_ParticipantId",
                table: "TaskSurveys");

            migrationBuilder.DropIndex(
                name: "IX_LLMRequestLogs_ParticipantId",
                table: "LLMRequestLogs");

            migrationBuilder.DropIndex(
                name: "IX_FinalSurvey_ParticipantId",
                table: "FinalSurvey");

            migrationBuilder.AddColumn<bool>(
                name: "ThumbsUp",
                table: "LLMRequestLogs",
                type: "bit",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: new Guid("3fa85f64-5717-4562-b3fc-2c963f66afa6"),
                column: "Data",
                value: "Summer is upon us! While you’ve been enjoying the weather we’ve put together a slate of new product features, events, and content to add to your summer reading list. You’ll find projects from the community built on Pinecone, updates to Pinecone Assistant, a new webinar, new customer stories, and more good stuff. \\n EMO Hannover 2025 is the window to the future of industry. From September 22 to 26, 2025, the metalworking industry will converge in Hannover. Global upheavals, new technologies, and transformations in energy supply, mobility, and production are challenging companies worldwide – here you'll find the answers: with innovations, strategies, and solutions. Anyone who wants to be at the forefront of metalworking and production technology can't miss EMO. Those who aren't there are missing out on the future. \\n Hello from France,\r\nThis could be a historic moment—or it could all yet fall apart. The presidents of America and Russia are to meet in Alaska on August 15th. Details could easily change before Friday, but the current plan is to exclude Ukraine’s leader, Volodymyr Zelensky, and his European backers from the summit. Already Mr Trump—a poor negotiator—has suggested some territory could be swapped. That sounds like a concession even before talks begin. Such an outcome may be inevitable at the end of talks, but it’s an odd thing to offer before they begin. You can read our story analysing the proposed summit.\r\n");

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: new Guid("6b5c4d3e-2f1a-9e8d-7c6b-5a4f3e2d1c0f"),
                column: "Description",
                value: "Perform addition of two numbers using recursion.");

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: new Guid("9c8d7e6f-5a4b-3c2d-1e0f-9a8b7c6d5e4f"),
                column: "Data",
                value: "Choose a random novel tech product you can think of (e.g. new VR glasses, a trendy new phone with glass body, a new classic watch with tech features etc.)");

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: new Guid("a7b3c9d1-e8f4-4a2b-9c6d-1e3f5a7b9c2d"),
                column: "Data",
                value: "Tested and practical, you can bring it with you on vacation to check the weight of your suitcase. The airline has a weight limit. Once you're finished packing your suitcase, check the weight to see if it's overweight or if it's the right size. Great, super easy, and instead of using a bathroom scale. \n The side pocket is a bit tight for bottles and other things. If it rains, there is no tab to drain the water. As a result, it will stop there. The coating can easily be damaged by shocks and settling. We don't know how strong protection will be then. Certainly not as strong as a truck trap. Therefore, the backpack from Outdoor Adventures falls more into the urban lifestyle category.");

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: new Guid("d4e5f6a7-b8c9-4d3e-9f1a-2b3c4d5e6f70"),
                columns: new[] { "Data", "Name" },
                values: new object[] { "The unbridled excitement for the release of GPT-5 reminded me of the hoopla around product announcements when Steve Jobs was CEO of Apple. Certainly, everyone in marketing and PR knows the drill. When it comes to news, the first three letters, N, E and W, pack an oversized punch. Just writing NEW in caps almost makes me giddy. It taps into what cognitive scientists have known for decades. People are drawn to novelty. There's no better illustration of this obsession than in an old children's story by Benjamin Elkin. \"Something New\" tells the tale of a bad king who has everything but wants more. So he threatens his nemesis, the good king, and vows to take the good king's gold away unless he can show his evil counterpart something brand-name new. Sound familiar? It reminds me of the way tech companies are always trying to one-up each other or stealing each other's ideas and people when they can't. And you and me? Well, we're sitting on the sidelines cheering on the next big thing.\r\n", "Text Summarization" });

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: new Guid("e4d5c6b7-a8f9-0e1d-2c3b-4a5f6e7d8c90"),
                column: "Data",
                value: "Three friends — Alice, Bob, and Charlie — are wearing hats that are either red or blue. They can all see each other’s hats but not their own. Alice sees Bob and Charlie both wearing red hats and says, \"I don’t know what color my hat is.\" Then Bob hears this and says, \"I don’t know what color my hat is either.\" Then Charlie hears both and says, \"Now I know what color my hat is.\"\r\nQuestion:\r\nWhat color is Charlie’s hat and how does he know? Explain your reasoning step-by-step.\r\n");

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: new Guid("f0e1d2c3-b4a5-6f7e-8d9c-0b1a2f3e4d5c"),
                column: "Data",
                value: "You can choose any genre (e.g. thriller, sci-fi, fantasy, horror etc.) that you are excited about.");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ThumbsUp",
                table: "LLMRequestLogs");

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: new Guid("3fa85f64-5717-4562-b3fc-2c963f66afa6"),
                column: "Data",
                value: "");

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: new Guid("6b5c4d3e-2f1a-9e8d-7c6b-5a4f3e2d1c0f"),
                column: "Description",
                value: "Perform addition using recursion.");

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: new Guid("9c8d7e6f-5a4b-3c2d-1e0f-9a8b7c6d5e4f"),
                column: "Data",
                value: "");

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: new Guid("a7b3c9d1-e8f4-4a2b-9c6d-1e3f5a7b9c2d"),
                column: "Data",
                value: "lorem ipsum");

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: new Guid("d4e5f6a7-b8c9-4d3e-9f1a-2b3c4d5e6f70"),
                columns: new[] { "Data", "Name" },
                values: new object[] { "lorem ipsum...", "Text summarization" });

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: new Guid("e4d5c6b7-a8f9-0e1d-2c3b-4a5f6e7d8c90"),
                column: "Data",
                value: "");

            migrationBuilder.UpdateData(
                table: "Tasks",
                keyColumn: "Id",
                keyValue: new Guid("f0e1d2c3-b4a5-6f7e-8d9c-0b1a2f3e4d5c"),
                column: "Data",
                value: "");

            migrationBuilder.CreateIndex(
                name: "IX_TaskSurveys_ParticipantId",
                table: "TaskSurveys",
                column: "ParticipantId");

            migrationBuilder.CreateIndex(
                name: "IX_LLMRequestLogs_ParticipantId",
                table: "LLMRequestLogs",
                column: "ParticipantId");

            migrationBuilder.CreateIndex(
                name: "IX_FinalSurvey_ParticipantId",
                table: "FinalSurvey",
                column: "ParticipantId");

            migrationBuilder.AddForeignKey(
                name: "FK_FinalSurvey_Participants_ParticipantId",
                table: "FinalSurvey",
                column: "ParticipantId",
                principalTable: "Participants",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_LLMRequestLogs_Participants_ParticipantId",
                table: "LLMRequestLogs",
                column: "ParticipantId",
                principalTable: "Participants",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TaskSurveys_Participants_ParticipantId",
                table: "TaskSurveys",
                column: "ParticipantId",
                principalTable: "Participants",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
