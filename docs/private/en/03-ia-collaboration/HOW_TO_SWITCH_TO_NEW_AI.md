# 🎯 GUIDE: How to Switch to a New AI - Step by Step

**Your exact roadmap to onboard a new AI in the next session**

---

## 📋 Situation

You finished your session with one AI (say Copilot). Now you want to work with another AI (say Claude) or the same one but in a new conversation.

**Problem**: The new AI doesn't know the project

**Solution**: This document guides you exactly what to do

---

## ✅ Checklist: Before Switching AI

### Step 1: Verify everything is in order (1 min)

```bash
# Run the final tests
./vendor/bin/sail artisan test --env=testing --no-coverage 2>&1 | tail -20

# You should see:
# Tests: 163 passed
```

If something is missing or tests don't pass:
- ❌ DON'T switch AI
- ✅ DO fix it first
- ✅ DO document in CHANGELOG_DETAILED.md

---

## 🚀 Procedure: Onboard New AI

### Option 1: QUICK (5 minutes)
**For small or urgent changes**

#### Step 1: Open ONBOARDING_FOR_NEW_AIs.md
```
File: /docs/03-ia-collaboration/ONBOARDING_FOR_NEW_AIs.md
```

#### Step 2: Copy completely the content
- Select ALL text
- Copy to clipboard

#### Step 3: Open chat with new AI
- ChatGPT: https://chat.openai.com
- Claude: https://claude.ai
- Copilot: VS Code or copilot.microsoft.com
- Other: [Their URL]

#### Step 4: Create new conversation/chat

#### Step 5: Paste the content of ONBOARDING_FOR_NEW_AIs.md

#### Step 6: Send this message:

```
I've been developing a Laravel project.
The document below contains all the guidelines on how the project works and how I should work.

Please read it COMPLETELY and let me know when you understand.
This is critical for us to work correctly.

[Here paste the complete content of ONBOARDING_FOR_NEW_AIs.md]
```

#### Step 7: Wait for confirmation
The AI will say something like:
```
✅ I have read completely the document (X words).
I understand:
- Project structure
- Technology stack (Laravel + MySQL + RefreshDatabase)
- Behavior norms
- How to run tests
- Essential commands
- Examples of previous work

I'm ready. What do you need?
```

#### Step 8: Describe your task
```
Now I need: [your task]
Here is the context:
[Your additional context if necessary]
```

---

### Option 2: COMPLETE (15 minutes) ⭐ RECOMMENDED
**For complex changes or when you want maximum confidence**

#### Steps 1-7: Follow Option 1

#### Step 8: Copy LATEST ENTRIES from CHANGELOG_DETAILED.md

```
File: /docs/01-core/CHANGELOG_DETAILED.md
Copy: The last 10-15 entries (last 2-4 weeks)
```

#### Step 9: Send to the AI:

```
Here's the recent history of changes for more context:

[Paste the latest entries from CHANGELOG_DETAILED.md]
```

#### Step 10: Copy RELEVANT SECTIONS of AI_GUIDELINES.md

If your task is complex:

```
File: /docs/03-ia-collaboration/AI_GUIDELINES.md
Copy: 
  - Section "4 Development Phases" 
  - Section "3 Work Flows" (the applicable one)
  - Section "Checklist" (the applicable one)
```

#### Step 11: Send to the AI:

```
Here are the specific norms for this type of task:

[Paste the sections]
```

#### Step 12: Describe your task
```
I need [your task]. 
```

---

### Option 3: MAXIMUM CONFIDENCE (20-30 minutes)
**For very critical changes or large refactors**

#### Steps 1-11: Follow Option 2

#### Step 12: Copy DATABASE SCHEMA (optional)

```
File: /docs/02-development/DATABASE.md
Copy: Table of models and relationships
```

#### Step 13: Copy RELEVANT ENDPOINTS (if necessary)

```
File: /docs/02-development/API.md
Copy: The endpoints I'm going to modify
```

#### Step 14: Copy RELATED TESTS

```
File: /tests/Feature/[Your module]/[Your test].php
Copy: The code of the related test
```

#### Step 15: Send to AI:

```
Here's the database schema, endpoints and related tests:

[Paste schema]
[Paste endpoints]
[Paste tests]
```

#### Step 16: Describe your task
```
I need [your task]. 
The task is critical because [reason].
```

---

## 🎯 Quick Guide by Task Type

### If you want: Add a new model

**Use**: Option 2 + docs/02-development/DATABASE.md

```
1. Option 2 (15 min)
2. Paste the schema from DATABASE.md
3. Describe: "I need to add model X with fields Y"
4. AI understands complete context
```

### If you want: Fix a bug

**Use**: Option 2 + latest entries CHANGELOG_DETAILED.md

```
1. Option 2 (15 min)
2. Paste last 5-10 changes from CHANGELOG
3. Describe: "Tests are failing in X because Y"
4. AI understands what worked before
```

### If you want: Add an endpoint

**Use**: Option 2 + docs/02-development/API.md

```
1. Option 2 (15 min)
2. Paste similar endpoints from API.md
3. Describe: "I need endpoint for X"
4. AI sees existing patterns
```

### If you want: Complete refactor (critical)

**Use**: Option 3

```
1. Option 3 (20-30 min)
2. Paste everything: Schema, endpoints, tests
3. Describe: "Refactor X. It's critical because Y"
4. AI has 100% complete context
```

---

## ⚠️ Common Mistakes to Avoid

### ❌ Mistake 1: NOT pasting ONBOARDING_FOR_NEW_AIs.md

```
❌ BAD: "Hi, I need you to do X"
✅ GOOD: "Here's the project context [paste ONBOARDING]"
```

**Result**:
- ❌ AI without context → Mediocre work
- ✅ AI with context → Excellent work

---

### ❌ Mistake 2: Requesting changes WITHOUT validating tests

```
❌ BAD: "Make this change and done"
✅ GOOD: "Make this change then run: 
         ./vendor/bin/sail artisan test"
```

**Result**:
- ❌ Unvalidated changes → Bugs
- ✅ Validated changes → Confidence

---

### ❌ Mistake 3: Not documenting after

```
❌ BAD: AI finishes work and you don't document
✅ GOOD: AI finishes + You document in CHANGELOG_DETAILED.md
```

**Result**:
- ❌ Lose history → Confusion
- ✅ Documented → Next AI understands what happened

---

### ❌ Mistake 4: Switching AI without updating CHANGELOG

```
❌ BAD: Switch to new AI without previous AI knowing what was done
✅ GOOD: Update CHANGELOG_DETAILED.md before switching
```

**Result**:
- ❌ New AI repeats work
- ✅ New AI continues from where it left off

---

## 📝 Template: Initial Message to New AI

Copy and adapt this message:

```
=== PROJECT CONTEXT ===

I've been developing a Laravel project called ControlApp with a previous AI.
The project is well-structured and documented.

Please, read completely the following document (it's critical):

[PASTE COMPLETELY: /docs/ONBOARDING_FOR_NEW_AIs.md]

Once you've read it, respond:
✅ "I've read X words of the onboarding and I understand:"
✅ List what you understood
✅ "I'm ready to work"

After that I'll tell you my task.
```

---

## 🔄 Complete Work Cycle

### With AI #1 (Your previous session)

```
Day 1: You work with Copilot
├─ You make changes
├─ You validate with tests
├─ You document in CHANGELOG_DETAILED.md
└─ You finish
```

### Switching AI (This document)

```
Day 2: You switch to Claude
├─ You read this document (5 min)
├─ You onboard Claude (5-15 min depending on option)
└─ You continue where Copilot left off
```

### With AI #2 (New session)

```
Day 2+: You work with Claude
├─ Claude has complete context
├─ You make more changes
├─ You validate with tests
├─ You document in CHANGELOG_DETAILED.md
└─ You finish
```

---

## 📊 Summary: Time vs Quality

| Option | Time | Confidence | Use |
|--------|------|-----------|-----|
| Option 1 | 5 min | 70% | Small changes |
| Option 2 | 15 min | 95% ⭐ | Normal changes |
| Option 3 | 20-30 min | 99% | Critical changes |
| NO onboarding | 0 min | 30% ❌ | DON'T USE |

**Recommendation**: Use **Option 2** always (only 15 minutes)

---

## 🎯 Final Summary

### When You Switch AI, ALWAYS:

```
1. ✅ Verify tests pass (131/131)
2. ✅ Copy ONBOARDING_FOR_NEW_AIs.md
3. ✅ Paste in new AI chat
4. ✅ Wait for confirmation
5. ✅ Describe your task
6. ✅ Validate changes with tests
7. ✅ Document in CHANGELOG_DETAILED.md

✅ Done. Next AI will know what happened.
```

---

## 💡 Pro Tips

### Tip 1: Create Bookmark
Save this path in favorites:
```
/home/guarox/Documentos/proyectos-personales/controlApp/docs/03-ia-collaboration/ONBOARDING_FOR_NEW_AIs.md
```

This way you access it quickly next time.

### Tip 2: Copy to Clipboard Directly
```bash
cat /home/guarox/Documentos/proyectos-personales/controlApp/docs/03-ia-collaboration/ONBOARDING_FOR_NEW_AIs.md | xclip -selection clipboard
```

Then just paste in chat.

### Tip 3: Create Alias in .bashrc
```bash
alias ia-onboard='cat ~/Documentos/proyectos-personales/controlApp/docs/03-ia-collaboration/ONBOARDING_FOR_NEW_AIs.md | xclip -selection clipboard && echo "✅ Copied to clipboard"'
```

Then use: `ia-onboard`

---

## ❓ Frequently Asked Questions

### Q: What if I switch AI mid-session?

**A**: It's normal. Follow the procedure:

```
1. Finish with AI #1 (validate tests, document)
2. Onboard AI #2 (15 min)
3. Continue

The new AI will understand where the previous one left off.
```

---

### Q: What's the minimum recommended option?

**A**: **Option 2** (15 minutes)

```
✅ It's the perfect balance between time and confidence
✅ Avoids 95% of errors
✅ Only 15 minutes
✅ VERY worth it
```

---

### Q: What if I don't do onboarding?

**A**: Problems:

```
❌ AI doesn't know norms → Incorrect work
❌ AI doesn't know structure → Changes in wrong place
❌ AI doesn't know DB → Wrong queries
❌ AI doesn't know testing → Useless tests
❌ AI doesn't know history → Repeats work

Result: Loss of 5+ hours.
```

**Moral**: 15 minutes of onboarding saves HOURS.

---

### Q: Should I read ALL documents?

**A**: NO, just:

- ✅ ONBOARDING_FOR_NEW_AIs.md (mandatory)
- ✅ Latest entries CHANGELOG_DETAILED.md (recommended)
- ✅ AI_GUIDELINES.md if task is complex (optional)
- ✅ Others only if necessary

---

### Q: How do I validate that AI understands?

**A**: Ask a question:

```
"How many tests does the project have?"
Correct answer: "131 tests"

"Why RefreshDatabase?"
Correct answer: "To isolate tests and not touch production"

"What's the MorphMap alias for Proyecto?"
Correct answer: "'proyecto'"
```

If it fails: AI didn't read well. Ask it to read again.

---

## 🎉 Conclusion

**Switching AI is EASY if you do onboarding.**

You have:

✅ A ready document (ONBOARDING_FOR_NEW_AIs.md)
✅ Clear procedure (this document)
✅ Options depending on urgency (1-3)
✅ Exact examples (above)
✅ Checklist (above)

**Next time you switch AI:**

1. Read this document (5 min)
2. Follow the procedure (5-30 min depending on option)
3. Work with confidence ✅

---

**Last Updated**: November 16, 2025
**Version**: 1.0.0
**Type**: Procedure Guide
**Audience**: You (when you switch AI)
