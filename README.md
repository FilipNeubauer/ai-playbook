# ai-playbook

A reference library of coding rules, project structures, and Claude skills for AI-assisted development.

## Stacks

- **NestJS** — Backend API framework
- **Next.js** — Frontend/fullstack React framework
- **React Native Expo** — Mobile app framework

## Structure

```
shared/              Cross-stack rules and skills
nestjs/
  rules/             Rule files (code rules, folder structure, etc.)
  skills/            Claude skills (drizzle-migration, etc.)
nextjs/
  rules/
  skills/
react-native/
  rules/
  skills/
```

## Usage

Copy the relevant files into your project:

1. Copy files from `shared/rules/` into your project (applies to all stacks)
2. Copy the stack-specific rule files from `<stack>/rules/`
3. Copy or adapt skills from `<stack>/skills/`
