// Rotating prompts used when journal prompts are enabled.
// Frankl/Logotherapy questions are woven in naturally — no labels.

export const DAILY_PROMPTS = [
  "What would the man you're becoming do today?",
  "Who benefits when you choose differently? Name them.",
  "What are you building, beyond the streak?",
  "What did today ask of you that yesterday's version couldn't have given?",
  "If your sons asked you what this year was about, what would you say?",
  "What has become possible in the last week that wasn't before?",
  "Where did you show up fully today?",
  "What is the one thing only you can do for the people who depend on you?",
  "Name something that felt genuinely good today — not escaped, not numb, but actually good.",
  "What are you no longer willing to trade away?",
  "What does 'freedom' mean to you, right now, in practical terms?",
  "Who is one person you have been more present with recently?",
  "What would you do with your time if you had no urge to fill it?",
  "Is there something you've been putting off saying to someone? What is it?",
  "Describe yourself in three words as if you were writing about someone you respect.",
  "What are you genuinely curious about right now?",
  "What discomfort today was worth it?",
  "What is your life actually in service of?",
  "What does tomorrow need from you?",
  "What have you stopped numbing that you can now feel clearly?",
];

export function getDailyPrompt(dayOfYear) {
  return DAILY_PROMPTS[dayOfYear % DAILY_PROMPTS.length];
}
