# Security Review Checklist — SEC-15

## Environment & Secrets
- [x] All secrets in .env (JWT_SECRET, MONGO_URI, etc.)
- [x] .env added to .gitignore
- [x] .env.example provided for teammates
- [x] No hardcoded credentials anywhere in code

## HTTP Security
- [x] Helmet.js configured (sets 14 secure HTTP headers)
- [x] Request body size limited to 10kb
- [x] CORS should be locked to frontend URL in production

## Authentication
- [x] Passwords hashed with bcrypt (cost factor 12)
- [x] JWT tokens expire in 15 minutes
- [x] Refresh token rotation implemented
- [x] 2FA setup and verify endpoints working
- [x] Logout clears token cookie

## Input Security
- [x] Input validation on all routes (express-validator)
- [x] Request sanitization (strips HTML/script tags)
- [x] NoSQL injection prevention
- [x] Oversized payload rejection (413)

## Rate Limiting
- [x] Auth routes: 10 requests per 15 minutes
- [x] API routes: 100 requests per 15 minutes

## Fraud Detection
- [x] Risk scoring on every transaction
- [x] High value transactions flagged (>$10,000)
- [x] Unusual hour detection (midnight-5am)
- [x] Rapid transaction detection
- [x] New recipient detection

## Logging
- [x] All auth events logged (login, register, logout)
- [x] Failed login attempts logged
- [x] Fraud alerts logged
- [x] Logs excluded from git

## Pre-Production TODO
- [ ] Set NODE_ENV=production
- [ ] Lock CORS to frontend domain only
- [ ] Enable HTTPS
- [ ] Set up log rotation
- [ ] Regenerate all secrets
- [ ] Disable stack traces in error responses (already done in production mode)