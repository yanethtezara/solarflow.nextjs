# Exploratory Testing Session Notes - SOL-16 & SOL-17

**Date:** 2026-04-18
**Feature:** Management of Entities (Clients & Companies)
**QA:** AI-Assigned (Gemini CLI)
**Status:** ⚠️ FAILED (Integrity Bug Found)

---

## Executive Summary

CRUD operations for both Clientes and Empresas are functional and correctly protected by RLS. However, a critical integrity bug was discovered: the system allows deleting a client even if they have associated jobs, which leads to automatic data loss due to a CASCADE rule in the database.

---

## Scenarios Tested

### 1. Happy Path: CRUD Clientes - [PASSED]

- **Create:** Client "Cliente User A" created successfully.
- **Read:** Client appears in list.
- **Update:** Updated details successfully.
- **Delete:** Deleted client without associations successfully.

### 2. Happy Path: CRUD Empresas - [PASSED]

- **Create:** Company "Empresa User A" created successfully.
- **Read:** Company appears in list.

### 3. RLS Privacy Verification - [PASSED]

- **Read:** User B CANNOT see User A's clients or companies.
- **Update:** User B attempt to update User A's client was BLOCKED.

### 4. Business Rule: Safe Deletion - [FAILED]

- **Scenario:** Delete client with jobs.
- **Actual:** Client deleted successfully, and the associated job was also deleted (CASCADE).
- **Expected:** Deletion should be blocked or return an error if jobs exist.

---

## Issues Found

### Bug 1: [SOL-37] Integrity: Client deletion with jobs not blocked

- **Severity:** High
- **Description:** Database has `ON DELETE CASCADE` on `trabajos_cliente_id_fkey`. This violates the business rule and causes data loss.

---

## Next Steps

- [ ] Fix DB foreign key constraint (change to RESTRICT/NO ACTION).
- [ ] Add logic in API/DB to block deletion if jobs exist.
- [ ] Re-test SOL-16 and SOL-17 after fix.
