---
category: agent
path: '/agents/:id'
title: 'Delete an agent'
type: 'DELETE'

layout: nil
---

Deletes an agent from the database.

### Request

* **`:id`** is the id the agent to delete.
* The headers must include a **valid authentication token**.
* **The body is omitted**.

### Response

Status **`204 No Content`**.  Delete was successful.  No body content.

For errors responses, see the [response status codes documentation](#response-status-codes).