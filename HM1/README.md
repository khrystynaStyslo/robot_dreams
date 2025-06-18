# Habit Tracker CLI

A command-line habit tracking application built with TypeScript and Node.js.

## Installation

1. Clone the repository
2. Install dependencies:
```bash
  pnpm install
```

## Usage

Run the application using:
```bash
  npx tsx index.ts [command] [options]
```

### Available Commands

#### Add a new habit
```bash
  npx tsx index.ts add --name "Exercise" --freq daily
  npx tsx index.ts add --name "Read" --freq weekly
  npx tsx index.ts add --name "Review Goals" --freq monthly
```

#### List all habits
```bash
  npx tsx index.ts list
```

#### Mark a habit as done
```bash
  npx tsx index.ts done --id <habit_id>
```

#### Delete a habit
```bash
  npx tsx index.ts delete --id <habit_id>
```

#### Update a habit
```bash
  npx tsx index.ts update --id <habit_id> --name "New Name"
  npx tsx index.ts update --id <habit_id> --freq weekly
  npx tsx index.ts update --id <habit_id> --name "Updated Name" --freq daily
```

#### View statistics
```bash
  npx tsx index.ts stats

  npx tsx index.ts stats --period 7

  npx tsx index.ts stats --period 30
```

### Frequency Options
- `daily` - Expected to be done every day
- `weekly` - Expected to be done once per week
- `monthly` - Expected to be done once per month

## Examples

```bash
  npx tsx index.ts add --name "Morning Workout" --freq daily
  npx tsx index.ts add --name "Weekly Review" --freq weekly

  npx tsx index.ts list
  npx tsx index.ts done --id 1
  npx tsx index.ts stats --period 7
```