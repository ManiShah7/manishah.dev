#!/bin/bash
PROJECT_DIR="/home/manishah/manishah.dev"
LOG_FILE="$PROJECT_DIR/logs/test-post.log"

cd "$PROJECT_DIR"

echo "$(date): Starting test post generation" >> "$LOG_FILE"

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

# Generate the post (TEST MODE - NO PUSH)
echo "$(date): Generating test blog post..." >> "$LOG_FILE"
RESPONSE=$(curl -X POST http://localhost:3000/api/generate-post \
  -H "Content-Type: application/json" \
  -d '{}' \
  --max-time 300 \
  -s)

echo "$(date): API Response: $RESPONSE" >> "$LOG_FILE"
echo "Test post generation complete - check content/posts/ directory"
echo "$(date): Test post generation complete!" >> "$LOG_FILE"