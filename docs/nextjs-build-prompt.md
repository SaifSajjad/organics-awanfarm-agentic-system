# Optimized Next.js Build Prompt

Build a complete AI-powered dairy delivery and management system for **Organics by Awan Farms**.

## Business Context

Organics by Awan Farms is a farm-fresh dairy delivery business serving Lahore. It sells cow milk and buffalo milk through daily subscriptions, weekly/custom subscriptions, and one-time orders. The business currently tracks customers, weekly deliveries, monthly subscriptions, expenses, payments, and route notes in Excel.

## Confirmed Product Pricing

* Cow Milk: PKR 330 / liter
* Buffalo Milk: PKR 430 / liter

## Brand Positioning

Use a fresh, premium, family-trust brand direction:

* Pure Milk. Pure Promise.
* From Our Farm to Your Home.
* Pure. Fresh. Trusted.
* 100% natural
* No preservatives
* No additives
* Daily morning delivery
* Farm fresh

Primary WhatsApp number:

`0339-5235323`

## Existing Business Data

Use the workbook:

`data/organics-awanfarm-source.xlsx`

Important May dashboard values:

* Monthly subscription income: PKR 40,920
* Weekly subscription income: PKR 56,440
* Total income: PKR 97,360
* Expenses: PKR 13,770
* Net profit: PKR 83,590
* Active customers: 9
* Pending payments: PKR 97,360

Known issue:

Some rows show `Paid` while payment received is blank and pending amount still exists. The app must prevent this contradiction.

## Delivery Areas

Build delivery-area support for:

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

Primary market:

Lahore.

## Tech Stack

* Next.js App Router
* TypeScript
* Tailwind CSS
* shadcn/ui
* Prisma
* PostgreSQL
* Auth.js / NextAuth
* Role-based access control
* OpenAI API compatible AI agent layer

## Roles

1. Customer
2. Rider
3. Farm staff
4. Admin/owner

## Public Website Pages

* Home
* Products
* Subscription Plans
* Delivery Areas
* About Farm
* Quality Promise
* Refer and Save
* Contact / WhatsApp Order

## Customer Dashboard

Features:

* View active subscription
* Select cow/buffalo milk
* Set daily, weekly, or custom delivery days
* Pause/resume subscription
* Request extra milk
* View bill
* View payment status
* Report missed delivery
* Submit complaint
* Refer another customer

## Admin Dashboard

Features:

* Today required liters
* Cow milk required
* Buffalo milk required
* Active subscriptions
* Today deliveries
* Monthly income
* Monthly expenses
* Net profit
* Pending payments
* Customer list
* Subscription management
* One-time order management
* Rider assignment
* Route planning
* Payment reconciliation
* Expense tracker
* Excel import/review tool

## Rider Dashboard

Mobile-first:

* Today assigned route
* Customer name and phone
* Address and area
* Product type
* Quantity
* Payment status
* Call/WhatsApp customer
* Mark delivered
* Mark missed
* Add delivery note
* Collect payment

## AI Agents

### Customer Support Agent

Answers customer questions about pricing, delivery areas, products, subscriptions, missed delivery, complaints, and referral offers.

### Order Agent

Turns WhatsApp-style customer messages into structured draft orders and subscriptions.

### Delivery Planning Agent

Groups deliveries by area, suggests rider routes, calculates total liters, and flags incomplete addresses.

### Finance Agent

Summarizes pending payments, expenses, revenue, profit, and detects payment contradictions.

### Marketing Agent

Creates WhatsApp broadcast messages, Instagram captions, referral campaign copy, and product promotions using the brand tone.

## Database Models

Create Prisma models for:

* User
* Customer
* Address
* Product
* Subscription
* SubscriptionSchedule
* Order
* OrderItem
* Delivery
* Route
* Rider
* Payment
* Expense
* Complaint
* Referral
* AiConversation
* AiAgentAction

## Visual Assets

Use assets from:

`assets/brand`

Recommended hero assets:

* `pure-love-model-town.png`
* `pure-promise-landscape.png`
* `pure-promise-portrait.png`

Recommended pricing assets:

* `pure-farm-milk-pricing-poster.png`
* `milk-bottles-field-pricing.png`
* `natural-milk-price-square.png`

Referral asset:

* `refer-and-save-monthly-bill.png`

## MVP Build Order

1. Project setup
2. Design system and brand theme
3. Public website
4. Product/pricing data
5. Admin dashboard shell
6. Customer/order/subscription models
7. Delivery rider panel
8. Expense/payment tracker
9. AI agents
10. Excel import and data cleanup

