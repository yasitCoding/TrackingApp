export type Habit = {
  id: string;
  user_id: string;
  name: string;
  target: string | null;
  sort_order: number;
  created_at: string;
};

export type DayLog = {
  id: string;
  user_id: string;
  habit_id: string;
  occurred_on: string;
  done: boolean;
  created_at: string;
};
