import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const tasks = sqliteTable('tasks', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  done: integer('done', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(new Date()).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(new Date()).$defaultFn(() => new Date()).$onUpdate(() => new Date()),
});

export const selectTasksSchema = createSelectSchema(tasks);

export const insertTaskSchema = createInsertSchema(tasks, {
  name: schema => schema.min(1),
})
  .required({ name: true, done: true })
  .omit({ id: true, createdAt: true, updatedAt: true });
