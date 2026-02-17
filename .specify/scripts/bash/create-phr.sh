#!/bin/bash
# Create PHR (Prompt History Record) file
# Usage: create-phr.sh --title "<title>" --stage <stage> [--feature <name>] --json

set -e

TITLE=""
STAGE=""
FEATURE=""
JSON_OUTPUT=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --title)
            TITLE="$2"
            shift 2
            ;;
        --stage)
            STAGE="$2"
            shift 2
            ;;
        --feature)
            FEATURE="$2"
            shift 2
            ;;
        --json)
            JSON_OUTPUT=true
            shift
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Validate required arguments
if [[ -z "$TITLE" || -z "$STAGE" ]]; then
    echo "Error: --title and --stage are required"
    exit 1
fi

# Generate slug from title
SLUG=$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | tr -cd 'a-z0-9-')

# Generate ID (timestamp-based)
ID=$(date +%Y%m%d-%H%M%S)

# Determine output directory based on stage
case $STAGE in
    constitution)
        OUTPUT_DIR=".specify/history/prompts/constitution"
        ;;
    spec|plan|tasks|red|green|refactor|explainer|misc)
        if [[ -n "$FEATURE" ]]; then
            OUTPUT_DIR=".specify/history/prompts/${FEATURE}"
        else
            OUTPUT_DIR=".specify/history/prompts/misc"
        fi
        ;;
    general)
        OUTPUT_DIR=".specify/history/prompts/general"
        ;;
    *)
        OUTPUT_DIR=".specify/history/prompts/misc"
        ;;
esac

# Create directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Generate filename
FILENAME="${ID}-${SLUG}.md"
OUTPUT_PATH="${OUTPUT_DIR}/${FILENAME}"

# Get current date in ISO format
DATE=$(date -Iseconds)

# Create PHR file
cat > "$OUTPUT_PATH" << EOF
<!--
PHR: Prompt History Record
ID: ${ID}
Stage: ${STAGE}
Title: ${TITLE}
Feature: ${FEATURE:-N/A}
-->

# ${TITLE}

**ID:** \`${ID}\`  
**Stage:** \`${STAGE}\`  
**Date:** ${DATE}  
**Feature:** ${FEATURE:-N/A}  

---

## Prompt

{{PROMPT_TEXT}}

---

## Response Summary

{{RESPONSE_TEXT}}

---

## Artifacts Created

- [ ] {{List files created or modified}}

---

## Follow-up

- [ ] {{Any follow-up tasks}}
EOF

# Output result
if [[ "$JSON_OUTPUT" == true ]]; then
    echo "{\"id\": \"${ID}\", \"path\": \"${OUTPUT_PATH}\", \"stage\": \"${STAGE}\", \"title\": \"${TITLE}\"}"
else
    echo "PHR created: ${OUTPUT_PATH}"
    echo "  ID: ${ID}"
    echo "  Stage: ${STAGE}"
    echo "  Title: ${TITLE}"
fi
