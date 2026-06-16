import Anthropic from '@anthropic-ai/sdk';

let client = null;
function getClient() {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  if (!client) client = new Anthropic({ apiKey: key });
  return client;
}

// Rule-based fallback so the app works without an API key.
// Produces a concrete daily directive that varies slightly across the 30 days
// to keep the checklist feeling intentional rather than copy-pasted.
function ruleBasedExpand(title, profileType) {
  const days = [];
  for (let i = 1; i <= 30; i++) {
    const tone = profileType === 'child'
      ? `Day ${i} of 30 — ${title}.`
      : `Day ${i} of 30: ${title}.`;
    days.push(tone);
  }
  return days;
}

export async function expandGoalToDailyChecklist({ title, category, profileType }) {
  const c = getClient();
  if (!c) return ruleBasedExpand(title, profileType);

  const model = process.env.ANTHROPIC_MODEL || 'claude-opus-4-7';
  const audience = profileType === 'child'
    ? 'a Muslim child (ages roughly 7-12)'
    : 'a practicing adult Muslim';

  const system =
    'You produce Ramadan goal checklists that are concrete, measurable, actionable, ' +
    'and religiously sound for Sunni Muslims. You never give vague advice. You never use ' +
    'percentages or cumulative metrics. Each daily entry stands on its own as a single ' +
    'concrete action a person can do that day. You return strict JSON only.';

  const user =
    `Goal title: "${title}"\nCategory: ${category}\nAudience: ${audience}\n\n` +
    `Expand this single goal into exactly 30 daily action items, one for each day of Ramadan ` +
    `(Day 1 through Day 30). Each item must be one short sentence describing a concrete action ` +
    `that can be performed on that specific day. The items should progress naturally across the ` +
    `month (e.g. building up, varying the focus, or reinforcing). Do not include the day number ` +
    `inside the sentence — it will be prefixed for display.\n\n` +
    `Return JSON of the exact form: {"days": ["…", "…", … 30 strings total]}`;

  try {
    const resp = await c.messages.create({
      model,
      max_tokens: 1500,
      system,
      messages: [{ role: 'user', content: user }],
    });
    const text = resp.content?.[0]?.type === 'text' ? resp.content[0].text : '';
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return ruleBasedExpand(title, profileType);
    const parsed = JSON.parse(match[0]);
    if (!Array.isArray(parsed.days) || parsed.days.length < 30) {
      return ruleBasedExpand(title, profileType);
    }
    return parsed.days.slice(0, 30).map(String);
  } catch (err) {
    console.warn('[ai] expansion failed, using fallback:', err.message);
    return ruleBasedExpand(title, profileType);
  }
}
