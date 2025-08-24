using Microsoft.EntityFrameworkCore;

namespace LLMWrapper.DBContext
{
    public class StudyDbContext(DbContextOptions<StudyDbContext> options) : DbContext(options)
    {
        public DbSet<Task> Tasks { get; set; }
        public DbSet<TaskSurvey> TaskSurveys { get; set; }
        public DbSet<FinalSurvey> FinalSurvey { get; set; }
        public DbSet<Participant> Participants { get; set; }
        public DbSet<LLMRequestLog> LLMRequestLogs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Task>().HasData(
            new Task
            {
                Id = Guid.Parse("3fa85f64-5717-4562-b3fc-2c963f66afa6"),
                Type = "Labeling",
                Name = "Spam Detection",
                Data = "Sample 1: Summer is upon us! While you’ve been enjoying the weather we’ve put together a slate of new product features, events, and content to add to your summer reading list. You’ll find projects from the community built on Pinecone, updates to Pinecone Assistant, a new webinar, new customer stories, and more good stuff. \r\n\r\nSample 2: EMO Hannover 2025 is the window to the future of industry. From September 22 to 26, 2025, the metalworking industry will converge in Hannover. Global upheavals, new technologies, and transformations in energy supply, mobility, and production are challenging companies worldwide – here you'll find the answers: with innovations, strategies, and solutions. Anyone who wants to be at the forefront of metalworking and production technology can't miss EMO. Those who aren't there are missing out on the future. \r\n\r\nSample 3: \r\nHello from France,\r\nThis could be a historic moment—or it could all yet fall apart. The presidents of America and Russia are to meet in Alaska on August 15th. Details could easily change before Friday, but the current plan is to exclude Ukraine’s leader, Volodymyr Zelensky, and his European backers from the summit. Already Mr Trump—a poor negotiator—has suggested some territory could be swapped. That sounds like a concession even before talks begin. Such an outcome may be inevitable at the end of talks, but it’s an odd thing to offer before they begin. You can read our story analysing the proposed summit.\r\n",
                Description = "Classify and explain why the following three email excerpts as spam or not spam."
            },
            new Task
            {
                Id = Guid.Parse("a7b3c9d1-e8f4-4a2b-9c6d-1e3f5a7b9c2d"),
                Type = "Labeling",
                Name = "Sentiment Analysis",
                Description = "Label the sentiment (positive/negative/neutral) for reviews.",
                Data = "Task 1: Tested and practical, you can bring it with you on vacation to check the weight of your suitcase. The airline has a weight limit. Once you're finished packing your suitcase, check the weight to see if it's overweight or if it's the right size. Great, super easy, and instead of using a bathroom scale. \r\n\r\nTask 2: The side pocket is a bit tight for bottles and other things. If it rains, there is no tab to drain the water. As a result, it will stop there. The coating can easily be damaged by shocks and settling. We don't know how strong protection will be then. Certainly not as strong as a truck trap. Therefore, the backpack from Outdoor Adventures falls more into the urban lifestyle category."
            },
            new Task
            {
                Id = Guid.Parse("d4e5f6a7-b8c9-4d3e-9f1a-2b3c4d5e6f70"),
                Type = "Analytical",
                Name = "Text Summarization",
                Description = "Summarize the article in exactly 3 sentences.",
                Data = "The unbridled excitement for the release of GPT-5 reminded me of the hoopla around product announcements when Steve Jobs was CEO of Apple. Certainly, everyone in marketing and PR knows the drill. When it comes to news, the first three letters, N, E and W, pack an oversized punch. Just writing NEW in caps almost makes me giddy. It taps into what cognitive scientists have known for decades. People are drawn to novelty. There's no better illustration of this obsession than in an old children's story by Benjamin Elkin. \"Something New\" tells the tale of a bad king who has everything but wants more. So he threatens his nemesis, the good king, and vows to take the good king's gold away unless he can show his evil counterpart something brand-name new. Sound familiar? It reminds me of the way tech companies are always trying to one-up each other or stealing each other's ideas and people when they can't. And you and me? Well, we're sitting on the sidelines cheering on the next big thing.\r\n"
            },
            new Task
            {
                Id = Guid.Parse("1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d"),
                Type = "Analytical",
                Name = "Pro/Con Analysis",
                Description = "List advantages and disadvantages of vaccination."
            },
            new Task
            {
                Id = Guid.Parse("f0e1d2c3-b4a5-6f7e-8d9c-0b1a2f3e4d5c"),
                Type = "Creative",
                Name = "Story Opening",
                Data = "You can choose any genre (e.g. thriller, sci-fi, fantasy, horror etc.) that you are excited about.",
                Description = "Write an engaging opening paragraph."
            },
            new Task
            {
                Id = Guid.Parse("9c8d7e6f-5a4b-3c2d-1e0f-9a8b7c6d5e4f"),
                Type = "Creative",
                Name = "Social Media Post",
                Data = "Choose a random novel tech product you can think of (e.g. new VR glasses, a trendy new phone with glass body, a new classic watch with tech features etc.)",
                Description = "Write a tweet for a tech product launch."
            },
            new Task
            {
                Id = Guid.Parse("6b5c4d3e-2f1a-9e8d-7c6b-5a4f3e2d1c0f"),
                Type = "Procedural",
                Name = "Simple Programming",
                Description = "Perform addition of two numbers using recursion."
            },
            new Task
            {
                Id = Guid.Parse("e4d5c6b7-a8f9-0e1d-2c3b-4a5f6e7d8c90"),
                Type = "Procedural",
                Name = "Logic Puzzle",
                Data = "Three friends — Alice, Bob, and Charlie — are wearing hats that are either red or blue. They can all see each other’s hats but not their own. Alice sees Bob and Charlie both wearing red hats and says, \"I don’t know what color my hat is.\" Then Bob hears this and says, \"I don’t know what color my hat is either.\" Then Charlie hears both and says, \"Now I know what color my hat is.\"\r\nQuestion:\r\nWhat color is Charlie’s hat and how does he know? Explain your reasoning step-by-step.\r\n",
                Description = "Solve the hat color puzzle."
            }
        );
        }
    };
}
