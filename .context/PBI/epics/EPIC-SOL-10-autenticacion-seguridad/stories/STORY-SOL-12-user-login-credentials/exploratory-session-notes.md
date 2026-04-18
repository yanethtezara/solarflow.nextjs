# Exploratory Testing Session Notes - SOL-12

**Date:** 2026-04-18
**Feature:** User Login (SOL-12)
**Staging URL:** https://staging-solarflow.vercel.app/login
**QA:** AI-Assigned (Gemini CLI)
**Duration:** 25 minutes

---

## Executive Summary

- **Overall Status:** ✅ PASSED
- **Scenarios Tested:** Happy Path, Wrong Password, Non-existent User, Invalid Format
- **Issues Found:** 0
- **Session Management:** VERIFIED (JWT Token generated)

---

## Scenarios Tested

### 1. Happy Path: Successful Login - [PASSED]

- **Steps:** Perform login via API with a confirmed user and correct password.
- **Result:** Session object returned with valid `access_token` and `user` data.
- **Evidence:** User ID `e1b681a4-8e42-41a2-a289-a52f5fe78e4a`.

### 2. Intento con contraseña incorrecta - [PASSED]

- **Steps:** Attempt login with correct email but wrong password.
- **Result:** API returned error: `Invalid login credentials`.
- **UX Note:** Error message is generic as requested in Technical Notes.

### 3. Intento con email no registrado - [PASSED]

- **Steps:** Attempt login with a non-existent email address.
- **Result:** API returned error: `Invalid login credentials`.

### 4. Formato de email inválido - [PASSED]

- **Steps:** Attempt login with a string that is not an email.
- **Result:** API returned error: `Invalid login credentials`.

---

## Technical Observations

- **Email Confirmation:** By default, Supabase requires email confirmation. This was bypassed using admin API for the test, but frontend must handle the "Email not confirmed" error state if applicable.
- **Generic Errors:** The API correctly returns generic errors for both wrong password and wrong email, which is good for security.

---

## Next Steps

- [x] Document findings.
- [ ] Transition SOL-12 to "QA APPROVED".
