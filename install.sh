#!/bin/bash
set -e

PLAYBOOK_DIR="$HOME/.claude/playbook"
COMMANDS_DIR="$HOME/.claude/commands"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "Installing ai-playbook..."

# Create directories
mkdir -p "$PLAYBOOK_DIR/rules"
mkdir -p "$PLAYBOOK_DIR/templates"
mkdir -p "$COMMANDS_DIR"

# Copy rules
cp -r "$SCRIPT_DIR/rules/"* "$PLAYBOOK_DIR/rules/"
echo "  Rules     → ~/.claude/playbook/rules/"

# Copy templates
cp -r "$SCRIPT_DIR/templates/"* "$PLAYBOOK_DIR/templates/"
echo "  Templates → ~/.claude/playbook/templates/"

# Copy skill
cp "$SCRIPT_DIR/skills/nx-monorepo-setup.md" "$COMMANDS_DIR/nx-monorepo-setup.md"
echo "  Skill     → ~/.claude/commands/nx-monorepo-setup.md"

echo ""
echo "Done! Run /nx-monorepo-setup in Claude Code to scaffold a new project."
