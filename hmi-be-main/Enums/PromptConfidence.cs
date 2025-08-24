namespace LLMWrapper.Enums
{
    public enum PromptConfidence
    {
        NotAtAllConfident = 1,  // "I have no idea what I'm doing"
        SlightlyConfident = 2,  // "I'm unsure but trying"
        ModeratelyConfident = 3, // "I have some experience but need improvement"
        VeryConfident = 4,      // "I usually write good prompts"
        ExtremelyConfident = 5  // "I'm an expert at crafting effective prompts"
    }
}
