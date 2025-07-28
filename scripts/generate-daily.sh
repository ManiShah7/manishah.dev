#!/bin/bash
PROJECT_DIR="/home/manishah/manishah.dev"
LOG_FILE="$PROJECT_DIR/logs/daily-post.log"

cd "$PROJECT_DIR"

echo "$(date): Starting daily post generation" >> "$LOG_FILE"

# Make sure Ollama is running
if ! pgrep -x "ollama" > /dev/null; then
    echo "$(date): Starting Ollama..." >> "$LOG_FILE"
    ollama serve &
    sleep 10
fi

# Check if Next.js dev server is running, if not start it
if ! curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "$(date): Starting Next.js app..." >> "$LOG_FILE"
    npm run dev > /dev/null 2>&1 &
    sleep 20
fi

# Generate the post
echo "$(date): Generating new blog post..." >> "$LOG_FILE"
RESPONSE=$(curl -X POST http://localhost:3000/api/generate-post \
  -H "Content-Type: application/json" \
  -d '{}' \
  --max-time 300 \
  -s)

echo "$(date): API Response: $RESPONSE" >> "$LOG_FILE"

# Check if we have new posts to commit
if [ -d .git ]; then
    git add content/posts/
    if git diff --staged --quiet; then
        echo "$(date): No new posts generated" >> "$LOG_FILE"
    else
        echo "$(date): Committing and pushing new post..." >> "$LOG_FILE"
        git commit -m "Add daily blog post $(date +%Y-%m-%d)"
        git push origin main
        echo "$(date): Successfully pushed to GitHub" >> "$LOG_FILE"
    fi
fi

echo "$(date): Daily post generation complete!" >> "$LOG_FILE"