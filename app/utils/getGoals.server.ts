import type { Tables } from '#/types/database';

import { db } from './kysely.server';

export async function getGoals() {
  const goals = await db
    .selectFrom('goal')
    .selectAll()
    .where('active', '=', true)
    .orderBy('created_at', 'desc')
    .execute();

  return goals;
}

export async function getGoalProgress(currentNetWorth: number) {
  const goals = await getGoals();

  return goals.map((goal: Tables<'goal'>) => ({
    ...goal,
    progress: Math.min((currentNetWorth / goal.target) * 100, 100),
    remaining: Math.max(goal.target - currentNetWorth, 0),
    achieved: currentNetWorth >= goal.target,
  }));
}
