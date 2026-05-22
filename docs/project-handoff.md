# Organics by Awan Farms - Project Handoff

This document summarizes the complete current state of the project so work can continue even if the chat history is lost.

## Project Name

**Agentic AI-Based Dairy Farm Delivery & Management System**

## Business Context

The project is for **Organics by Awan Farms**, a dairy farm delivery business that supplies cow milk and buffalo milk to customers at home.

Confirmed business data:

* Brand name: Organics by Awan Farms
* Cow Milk: PKR 330 / liter
* Buffalo Milk: PKR 430 / liter
* Primary WhatsApp/order number: 0339-5235323
* Primary market: Lahore
* Existing data source: `data/organics-awanfarm-source.xlsx`

Important delivery areas from source data/assets:

* Model Town
* Bahria
* Bahria Sector B
* Bahria Sector D
* Cantt
* Izmir Town
* Askari 11
* Phase 5
* Gulberg
* Johar Town
* Iqbal Town
* State Life
* Calvary Ground
* Harbanspura

## Current Tech Stack

* Next.js App Router
* TypeScript
* Tailwind CSS
* React client components for MVP interactions
* Prisma schema prepared
* SQLite intended for local MVP database
* Local deterministic AI agent API for demo
* OpenAI API key field prepared in `.env`

## Important Commands

Use `npm.cmd` on Windows PowerShell if `npm` is blocked by execution policy.

```powershell
cd "C:\Users\jamsh\Desktop\new project"
npm.cmd install
npm.cmd run dev
```

Open:

```text
http://localhost:3000
```

Build check:

```powershell
npm.cmd run build
```

If CSS or `.next` cache breaks:

```powershell
taskkill /F /IM node.exe
rmdir /s /q .next
npm.cmd run dev
```

## Environment File

Current `.env` format:

```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="demo-secret-change-before-production"
OPENAI_API_KEY=""
```

If using OpenAI later, replace:

```env
OPENAI_API_KEY="your_new_key_here"
```

Changing/deleting an API key does not delete project files or this local app.

## Files and Folders Created

Main app:

* `app/page.tsx`
* `app/layout.tsx`
* `app/globals.css`
* `app/dashboard/admin/page.tsx`
* `app/dashboard/customer/page.tsx`
* `app/dashboard/rider/page.tsx`
* `app/operations/page.tsx`
* `app/agents/page.tsx`
* `app/api/agents/route.ts`
* `app/presentation/page.tsx`

Components:

* `components/app-header.tsx`
* `components/stat-card.tsx`
* `components/admin-dashboard-client.tsx`
* `components/operations-client.tsx`
* `components/agents-client.tsx`

Data and utilities:

* `lib/demo-data.ts`
* `lib/utils.ts`
* `lib/agents/agent-service.ts`

Database:

* `prisma/schema.prisma`
* `prisma/seed.ts`

Docs:

* `docs/organics-awanfarm-analysis.md`
* `docs/nextjs-build-prompt.md`
* `docs/project-handoff.md`

Assets:

* `assets/brand/*`
* `public/brand/*`
* `assets/brand/manifest.md`

User behavior file:

* `skills.md`

## Current Working Routes

```text
/
/dashboard/admin
/dashboard/customer
/dashboard/rider
/operations
/agents
/presentation
/api/agents
```

## What Has Been Completed

### 1. Project Setup

Completed:

* Next.js project scaffold created manually
* TypeScript configured
* Tailwind CSS configured
* ESLint config added
* `.env.example` and `.env` added
* `package.json` scripts added
* Local dev server tested
* Production build tested successfully

### 2. Brand Assets

Completed:

* Farm images copied from Downloads into project
* Images copied into `public/brand` for browser access
* Asset manifest created
* Brand direction documented

### 3. Public Website

Completed route:

```text
/
```

Includes:

* Brand header
* Hero section
* Product/pricing section
* Delivery areas
* Referral offer
* WhatsApp CTA
* Cow milk and buffalo milk pricing

### 4. Admin Dashboard

Completed route:

```text
/dashboard/admin
```

Includes:

* KPI cards
* Total income
* Net profit
* Active customers
* Today liters
* Customer/subscription creation form
* Monthly bill estimation
* Generate today's deliveries button
* Customer ledger
* Delivery board
* Mark delivered button
* AI alert for payment contradiction
* Link to operations page

Current limitation:

* Uses React state, so new data resets on refresh.

### 5. Customer Dashboard

Completed route:

```text
/dashboard/customer
```

Includes:

* Subscription view
* Daily quantity
* Rate
* Monthly bill
* Request extra milk button
* Pause delivery button
* WhatsApp support CTA

Current limitation:

* Static demo screen only.

### 6. Rider Dashboard

Completed route:

```text
/dashboard/rider
```

Includes:

* Today route
* Customer cards
* Area
* Product
* Quantity
* Call button
* Delivered button

Current limitation:

* Static demo screen only.

### 7. Operations Module

Completed route:

```text
/operations
```

Includes:

* Orders table
* Payment status
* Delivery status
* Mark paid button
* Mark delivered button
* Expense tracker
* Add expense form
* Live totals:
  * Total orders
  * Paid amount
  * Pending amount
  * Expenses

Current limitation:

* Uses React state, so changes reset on refresh.

### 8. Agentic AI Demo

Completed route:

```text
/agents
```

Completed API:

```text
POST /api/agents
```

Implemented demo agents:

* Customer Support Agent
* Delivery Planning Agent
* Finance Agent

The agents currently work without OpenAI key. They use deterministic logic from `lib/agents/agent-service.ts`.

Example prompts:

```text
Model Town mein daily 2 liter cow milk ka monthly bill?
```

```text
Aaj ki deliveries ka route plan bana do
```

```text
May ka finance summary aur pending payments batao
```

Current limitation:

* Not connected to real OpenAI yet.
* Does not store conversations in database yet.

### 9. Presentation Page

Completed route:

```text
/presentation
```

Includes:

* Project overview
* Tech stack
* System modules
* Automation flow
* Agentic AI design
* Live demo script
* MVP status
* Future upgrade direction

This page is useful for presenting the project to the teacher.

### 10. Documentation

Completed:

* Deep business analysis doc
* Next.js build prompt
* Asset manifest
* Handoff document

## Current Demo Flow

Use this flow while presenting:

1. Open public website:

```text
http://localhost:3000
```

2. Show milk prices:

* Cow Milk: PKR 330 / liter
* Buffalo Milk: PKR 430 / liter

3. Open Admin Dashboard:

```text
http://localhost:3000/dashboard/admin
```

4. Add a customer subscription:

Example:

```text
Customer: 52 E Model Town
Area: Model Town
Product: Cow Milk
Quantity: 2
Frequency: Daily
```

5. Click:

```text
Add Customer Subscription
```

6. Click:

```text
Generate Today's Deliveries
```

7. Mark a delivery as delivered.

8. Open Operations:

```text
http://localhost:3000/operations
```

9. Mark order as paid/delivered.

10. Add expense:

Example:

```text
Type: Fuel
Amount: 500
Note: Model Town route petrol
```

11. Open Agents:

```text
http://localhost:3000/agents
```

12. Run Customer Support, Delivery Planning, and Finance Agent prompts.

13. Open Presentation:

```text
http://localhost:3000/presentation
```

Explain project architecture and future scope.

## Known Issues

### 1. PowerShell `npm` Policy Issue

Problem:

```text
npm.ps1 cannot be loaded because running scripts is disabled
```

Solution:

Use:

```powershell
npm.cmd run dev
```

Or set policy:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

### 2. CSS Sometimes Loads as Raw HTML

Cause:

* Multiple Next dev servers
* Stale `.next` cache

Fix:

```powershell
taskkill /F /IM node.exe
rmdir /s /q .next
npm.cmd run dev
```

Then hard refresh:

```text
Ctrl + Shift + R
```

### 3. Prisma DB Push Issue

Prisma schema was converted to string fields instead of enums because SQLite connector gave enum validation errors.

Still needs:

* Verify `prisma db push`
* Fix any schema engine issue
* Connect UI forms to database

### 4. Data Is Not Persistent Yet

Current MVP uses React state and static demo data.

Effect:

* Added customers/orders/expenses disappear after page refresh.

Next fix:

* Add localStorage persistence first
* Then connect Prisma database

## What Is Remaining

### High Priority

1. Add localStorage persistence

Purpose:

* Keep customer/order/expense data after refresh during demo.

Files likely affected:

* `components/admin-dashboard-client.tsx`
* `components/operations-client.tsx`

2. Fix Prisma database flow

Tasks:

* Run `npm.cmd run db:generate`
* Run `npm.cmd run db:push`
* Run `npm.cmd run db:seed`
* Resolve schema engine issue if it appears again

3. Connect backend APIs

Needed API routes:

* `GET/POST /api/customers`
* `GET/POST /api/orders`
* `GET/POST /api/expenses`
* `PATCH /api/orders/:id`
* `PATCH /api/deliveries/:id`

4. Add data persistence through Prisma

Replace local state with database calls.

### Medium Priority

5. Add auth

Roles:

* Admin
* Customer
* Rider
* Staff

Pages:

* Login
* Role-based redirects

6. Improve customer dashboard

Add:

* Real subscription form
* Delivery history
* Complaint form
* Pause/resume request
* Extra milk request

7. Improve rider dashboard

Add:

* State persistence
* Assigned route filter
* Delivery notes
* Payment collection

8. Add AI conversation history

Store:

* Agent type
* Prompt
* Response
* Timestamp

### Future Scope

9. Real OpenAI integration

Current agents are deterministic demo agents.

Future:

* Use `OPENAI_API_KEY`
* Add model call inside `lib/agents/agent-service.ts`
* Keep fallback deterministic mode if key is missing

10. WhatsApp integration

Future:

* Generate WhatsApp order link
* Send payment reminder messages
* Customer support automation

11. Excel import

Future:

* Parse `data/organics-awanfarm-source.xlsx`
* Import customers, orders, payments, and expenses
* Flag uncertain records for review

12. Reports

Add:

* Monthly income report
* Expense report
* Pending payments report
* Delivery performance report
* Customer growth report

## Recommended Next Work Order

Next immediate implementation order:

1. Add localStorage persistence
2. Add simple CRUD API routes
3. Fix Prisma DB push
4. Connect admin dashboard to database
5. Connect operations page to database
6. Add OpenAI optional integration
7. Add auth and roles
8. Polish UI for final demo

## Current MVP Status

The project is currently a **working 3-day MVP demo**.

It is suitable to show:

* Public dairy website
* Admin dashboard
* Subscription creation flow
* Delivery generation flow
* Operations board
* Payment/expense tracking
* AI agents demo
* Project architecture presentation

It is not yet a production system because:

* Data is not persistent
* Auth is not implemented
* Database is not connected to UI
* AI agents are deterministic, not live LLM agents
* WhatsApp API is not integrated

## Teacher Explanation

Use this explanation:

```text
This is an agentic AI-based dairy farm delivery and management system built in Next.js. It includes a public customer website, admin dashboard, operations module, customer dashboard, rider dashboard, and AI agents. The agents handle customer support, delivery planning, and finance insights. The current version is an MVP demo using local data, and the next phase is connecting the forms to Prisma database and real AI APIs.
```

## Short Demo Pitch

```text
This project is not only a dairy delivery website. It is a business automation platform where customer subscriptions generate deliveries, riders update delivery status, finance data updates pending payments and expenses, and AI agents summarize business operations and suggest next actions.
```

