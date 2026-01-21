# Build Production Grade AI Agents Using State Machines

Author: Alan Walsh  
Role: AI Automator  
Format: Notes + transcript excerpts (from YouTube captions; accuracy depends on original captions)

---

## Why state machines for AI agents?

If you want an AI agent to reliably follow a **real business process** (applications, returns, troubleshooting, intake, onboarding), you typically need a **state machine**.

Basic chat agents often:
- Lose track of **where they are** in a workflow
- Forget what has already been **collected**
- Skip required steps or validations
- Struggle to resume after interruptions

A state machine solves this by giving the agent a **deterministic checklist**:
- Each step has a defined purpose
- Each step can enforce validation before progressing
- You can add restart and escalation paths for edge cases
- You can store state outside the conversation, if needed

---

## What you’ll learn

- What state machines are and why agents need them in workflows
- Two approaches in n8n:
  - **Approach 1:** State machine within execution
  - **Approach 2:** State machine using data tables or a database
- Validation loops
- Restart and escalation logic for edge cases
- Persistent state using:
  - a configuration table
  - a session tracking table
- Guard conditions and subworkflows for step-specific actions
- How to choose the right approach for your use case

---

## What state machine agents unlock

### Applies to both Approach 1 and Approach 2

- **Guaranteed step completion**  
  No skipped steps. Required data must be collected before moving forward.

- **Deterministic validation**  
  Business rules and data checks happen at each step, not only when the LLM “feels like it”.

- **Graceful exit paths**  
  Restart and escalation routes prevent users from being stuck in loops or dead ends.

### Additional benefits for Approach 2

- **Clear progress tracking**  
  Know where each user is in the process, what has been collected, what is missing.

- **Observability**  
  Log every interaction, extracted field, and transition for debugging, reporting, compliance.

- **Resume on failure**  
  If something breaks mid-process, you can resume from persisted state instead of restarting.

---

## Two approaches to state management in n8n

## Approach 1: State machine within execution

### When to use
Good for **simple, single-session** workflows with few steps and minimal validation complexity.

### Core idea
Each step is represented directly in the n8n workflow:
- An agent extracts and validates step data
- A `Respond to Chat` node pauses execution and waits for the user reply
- Routing handles invalid input, restart, or escalation

### How it works
- Each step has its own agent that extracts and validates information
- `Respond to Chat` node with **Wait for user reply** pauses execution between steps
- Validation can happen via the **Respond to Chat tool** attached to each agent
- Routes exist for restarting and escalating conversations

---

### The Respond to Chat tool (key feature)
When attached as a tool to an agent, it allows the agent to:
- message the user
- **wait for user reply**
- re-prompt for missing or invalid info **without manual wiring**

If your model is not reliably tool-calling:
- use a more hardwired validation flow (example: output includes `valid: true/false` and you loop manually in the workflow)

---

### Restart and escalation logic
Production agents need clear exit paths.

Two common exit routes:
- **Restart**: user wants to start over or revert to a previous step  
- **Escalation**: repeated failures or unresolvable edge cases, route to human support

Example pattern:
- Add booleans to agent output, like:
  - `restart`
  - `escalateToSupport`
- Route via Switch/IF nodes to:
  - reset to step 1
  - end chat and provide support instructions

---

### Limitations of Approach 1
- No persistence layer: state does not survive across sessions
- Cannot reliably resume after workflow errors
- Can get cumbersome with many steps or validations
- Less suitable for long-running, complex interactions

---

## Approach 2A: State machine using data tables

### When to use
Use when you need:
- long-running interactions
- persistence across sessions
- observability and easier debugging
- a scalable approach for many steps

### Core idea
Instead of wiring each step as its own node chain, define the workflow steps in a **configuration table** and persist progress in a **session tracking table**.

You maintain:
1) **Configuration Table**  
   Defines steps, questions, validation rules, and step-specific agent instructions.

2) **Session Tracking Table**  
   Stores current step, retry counts, and extracted data per session.

---

### Key tip: automatic mapping
For automatic column mapping in n8n data table updates:
- ensure `configuration.name` matches the corresponding column name in the session table.

If names do not match, “map automatically” will fail.

---

### Example: configuration table schema

| Column | Type | Description |
|---|---|---|
| id | integer | Step number |
| name | string | Field key (must match session table columns) |
| question | string | Prompt to ask user |
| validationRules | string | Text rules injected into agent prompt |
| agentInstructions | string | Additional guidance, troubleshooting, tone |

---

### Example: session tracking table schema

| Column | Type | Description |
|---|---|---|
| sessionId | string | Unique chat/session identifier |
| status | string | open / submitted / escalated / closed |
| currentStepIndex | integer | Current step id |
| retryCount | integer | Must be integer |
| orderNumber | string | Extracted field |
| returnReason | string | Extracted field |
| resolutionType | string | Extracted field |
| customerEmail | string | Extracted field |
| escalationMessage | string | Stored if escalated |

Notes:
- `retryCount` must be an integer.
- Each row represents one session (or one “transaction”) depending on your design.

---

### Typical workflow orchestration flow (high level)

1) **On chat message received**
2) Look up session row by sessionId  
   - if missing, create new row with `status=open`, `currentStepIndex=1`, `retryCount=0`
3) Query configuration table for `currentStepIndex`  
4) Run a single validation agent to:
   - analyze response
   - extract requested field
   - validate against rules
   - output:
     - `valid`
     - `extractedInformation`
     - `responseToUser`
     - `restart`
     - `escalateToSupport`
5) Route deterministically:
   - invalid -> respond with `responseToUser` and stay on same step
   - valid -> store extracted info and increment `currentStepIndex`
   - restart -> reset fields and set `currentStepIndex=1`, increment retryCount
   - escalate -> store escalation details and send support email
6) If no more steps -> mark `status=submitted` and take action (email, ticket creation, etc.)

---

## Approach 2B: Data tables with validation subworkflow

### Why 2B?
Approach 2A uses the same validation logic for every step.

If different steps require different validation logic, use a **subworkflow**:
- verify an order number exists in database
- validate email format
- call external APIs for one step only
- enforce guard conditions deterministically

Benefits:
- different validation logic per step
- guard conditions that enforce business rules
- cleaner main workflow
- security via scoped data access
- easier maintenance and updates

---

### Guard conditions example: order must exist in database
Pattern:
- In subworkflow:
  - If current field is `orderNumber`:
    1) extract order number from message
    2) query DB for existence
    3) if not found: return `valid=false` and a friendly prompt
    4) if found: return `valid=true` and continue

This enforces:
- the workflow cannot proceed until the order exists in your system.

---

## Comparing the approaches

| Topic | Approach 1: Within execution | Approach 2A/2B: Data tables or DB |
|---|---|---|
| Setup time | Fast | Medium |
| Complexity | Low at first | Higher upfront, scalable later |
| Persistence across sessions | No | Yes |
| Resume on failure | No | Yes (state stored externally) |
| Observability and debugging | Harder | Easy (one table view) |
| Lots of steps | Gets messy | Scales well |
| Step-specific validation | Possible but messy | Best with Approach 2B subworkflows |
| Best for | Simple, short workflows | Production, complex, long-running workflows |

Rule of thumb:
- Use **Approach 1** for simple, single-session flows with few steps.
- Move to **Approach 2** when you need persistence, observability, many steps, or complex validation.

---

## Advanced state management techniques (not in templates)

### Granular state transitions
Instead of strictly step 1 -> step 2 -> step 3, each state can have multiple valid next states.

Implementation idea:
- Add a column like `validTransitions` (list of allowed next step ids)
- Let the agent output `nextStep`
- Verify `nextStep` is in `validTransitions` before moving

### Substates
Model nested states under a main state.

Implementation idea:
- Separate `substates` table
- one-to-many relationship with configuration steps

### Database vs n8n data tables
As data modeling grows (joins, one-to-many relationships, integrity rules):
- prefer a real database like Postgres
- foreign keys and stronger constraints help avoid invalid state

---

## Templates and assets referenced

### Approach 1
- Main version: *State Machine Workflows - Approach 1 (Main Version)*
- Alternative hardwired validation flow: *State Machine Workflows - Example alternative workflow with hardwired validation*

### Approach 2A
- *Approach 2 - with single validation agent*
- Example CSVs (schema reference):
  - `Returns_agent_configuration.csv`
  - `Return_requests.csv`

### Approach 2B
- *Approach 2 - with Validation Sub-Workflow*
- *Validation Sub-Workflow*
- Orders table seed SQL:
  - `orders table.sql`
  - `orders_rows_data.sql`

---

## Notes from transcript (selected, paraphrased)

- Approach 1 can rely on chat history for retry counting, but it becomes unreliable for long-running conversations.
- Approach 2 stores `retryCount` in the session table, enabling deterministic escalation after exceeding retries.
- Subworkflows allow you to isolate sensitive data and only expose what is needed to the agent, such as checking an order number exists without exposing customer details.
- Completed states can bypass the LLM and respond directly: “Your response has been received. Open a new chat to process another return.”

---

## Appendix: Example agent output shape

Use a structured output parser with fields like:

```json
{
  "extractedInformation": "string",
  "valid": true,
  "responseToUser": "string",
  "restart": false,
  "escalateToSupport": false
}
```

Notes:
- `valid`, `restart`, `escalateToSupport` are booleans
- if the model is not reliably tool-calling, prefer hardwired validation loops

---

## Attribution and accuracy note

This documentation is derived from the provided article text and a YouTube transcript sourced from captions. Caption-based transcripts can contain errors or missing words.
