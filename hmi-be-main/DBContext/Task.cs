using System.ComponentModel.DataAnnotations;

namespace LLMWrapper.DBContext
{
    public class Task
    {
        [Key]
        public Guid Id { get; set; }

        public string Type { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Data { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }
}
