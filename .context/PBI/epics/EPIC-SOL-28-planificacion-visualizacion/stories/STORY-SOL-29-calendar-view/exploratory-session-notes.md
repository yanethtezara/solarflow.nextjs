# Exploratory Testing Session Notes - SOL-28 (Planificación)

**Date:** 2026-04-18
**Feature:** Planning and Visualization (Calendar)
**QA:** AI-Assigned (Gemini CLI)
**Status:** ⚠️ PARTIAL PASS (Features Missing)

---

## Executive Summary

The monthly calendar view is functional and correctly synchronized with the jobs database. It supports month navigation and provides a shortcut to create jobs with pre-filled dates. However, two key scope items are missing: the Weekly View (SOL-29) and the List/Calendar view toggle (SOL-30).

---

## Scenarios Tested

### 1. Happy Path: Calendar Data Sync - [PASSED]

- **Steps:** Create a job for a future date (e.g., 2026-06-15) and fetch jobs for that month.
- **Result:** The job appears correctly in the dataset with its date and client name.

### 2. Month Navigation - [PASSED]

- **Steps:** Verify existence of `prevMonth` and `nextMonth` logic in code.
- **Result:** Code handles state updates for month transitions correctly.

### 3. Create Job Shortcut - [PASSED]

- **Steps:** Check for the "+" link in each day cell.
- **Result:** Every day has a link to `/dashboard/instalaciones/nuevo` with the `fecha` query parameter.

### 4. Weekly View - [FAILED]

- **Actual:** No "Vista Semanal" option found in code or UI.
- **Expected:** Option to toggle between Monthly and Weekly view.

### 5. View Toggle (List/Calendar) - [FAILED]

- **Actual:** No toggle found. The calendar is a separate page instead of a view option in the jobs list.
- **Expected:** Button to switch between list and calendar modes.

---

## Issues Found

### Bug 1: [SOL-39] Scope: Weekly View and View Toggle are missing

- **Severity:** Minor/Medium (Missing Scope)
- **Description:** Requirements for weekly visualization (SOL-29) and list/calendar toggle (SOL-30) were not implemented in the current deployment.

---

## Next Steps

- [ ] Implement `WeeklyView` component.
- [ ] Add view toggle in `/dashboard/instalaciones` to switch to calendar mode.
- [ ] Add `data-testid` attributes to calendar elements for better automation.
- [ ] Re-test after scope completion.
