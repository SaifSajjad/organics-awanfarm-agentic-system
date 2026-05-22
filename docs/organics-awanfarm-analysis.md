# Organics by Awan Farms - Deep Project Analysis

## Source Files Added

### Data

* `data/organics-awanfarm-source.xlsx`

### Brand Assets

* `assets/brand/brand-collage-rice-wheat-milk.png`
* `assets/brand/brand-collage-rice-wheat-milk-alt.png`
* `assets/brand/refer-and-save-monthly-bill.png`
* `assets/brand/pure-farm-milk-pricing-poster.png`
* `assets/brand/milk-bottles-field-pricing.png`
* `assets/brand/pure-promise-landscape.png`
* `assets/brand/pure-promise-portrait.png`
* `assets/brand/pure-promise-farm-home.png`
* `assets/brand/natural-milk-price-square.png`
* `assets/brand/organic-awanfarms-poster.png`
* `assets/brand/pure-love-model-town.png`
* `assets/brand/ai-eraser-image.png`
* `assets/brand/pure-farm-milk-square.png`
* `assets/brand/premium-buffalo-milk-lahore.png`

---

## Brand Identity

### Primary Brand Name

Recommended standard:

**Organics by Awan Farms**

Observed variants in assets:

* Organics by Awan Farms
* Organics by AwanFarms
* Organics by AwanFarm
* Organics Awan Farms

Implementation decision:

Use **Organics by Awan Farms** everywhere in website UI, database seed data, invoices, WhatsApp templates, and admin dashboard.

### Brand Personality

The brand should feel:

* Fresh
* Natural
* Family-safe
* Premium but local
* Farm-direct
* Trustworthy
* Morning-delivery focused

### Visual Direction

The current assets strongly establish:

* Deep green as the main brand color
* White/cream background
* Fresh milk bottle photography
* Farm field backgrounds
* Cow and buffalo product distinction
* Natural icons: leaf, shield, delivery truck, family, cow/buffalo

Suggested UI style:

* Clean white dashboards with green accent actions
* Farm imagery for public website hero sections
* Practical, compact admin screens
* Premium cards for product pricing
* Mobile-first customer ordering flow

---

## Core Business Facts

### Products

Confirmed from image assets and Excel:

| Product | Price | Unit |
| --- | ---: | --- |
| Cow Milk | PKR 330 | per liter |
| Buffalo Milk | PKR 430 | per liter |

Potential future products from brand collage:

| Product | Status |
| --- | --- |
| Organic Rice | Future product / optional catalog item |
| Organic Wheat | Future product / optional catalog item |
| Cow and Buffalo Blend | Mentioned in one poster, needs confirmation |

### Product Claims Seen in Assets

Use carefully and consistently:

* 100% natural
* No preservatives
* No additives
* Chemical free
* Farm fresh
* Direct from farm
* Rich and nutritious
* Pure, fresh, sustainable
* Pure milk, pure promise
* From our farm to your home
* Daily morning delivery
* Healthy choice for your family
* Hygienically processed

Claims needing confirmation before final public launch:

* Organic
* Raw / untreated
* Delivered hot
* Chemical free
* Happy cows
* Sustainable farming

Reason:

These are strong health/quality claims. The website can use them, but the final copy should match actual farm process, certifications, and local compliance.

### Contact and Ordering

Primary number seen repeatedly:

**0339-5235323**

Other number seen in one referral poster:

**0304 1111 030**

Implementation decision:

Use `0339-5235323` as primary WhatsApp/order number unless owner confirms otherwise.

### Delivery Areas

Observed from assets:

* Lahore
* Model Town, Lahore
* "All over Lahore"
* Rawalpindi and Islamabad appears in one referral poster

Observed from Excel records:

* Model Town
* State Life
* Iqbal Town / Kashmir Block
* Dental Medical College
* Calvary Ground
* Cantt
* Bahria
* Bahria Sector B
* Bahria Sector D
* Izmir Town
* Askari 11
* Phase 5
* Gulberg
* Johar Town
* Harbanspura

Implementation decision:

Initial website should position service as:

**Milk delivery across Lahore, with active routes in Model Town, Bahria, Cantt, Gulberg, Johar Town, Iqbal Town, State Life, and nearby areas.**

Rawalpindi/Islamabad should be hidden or marked as "coming soon" until confirmed.

---

## Excel Workbook Analysis

Workbook copied to:

`data/organics-awanfarm-source.xlsx`

Sheets found:

1. Dashboard
2. Monthly Subscriptions
3. Weekly Subscriptions
4. Expense Tracker
5. Sheet1

### Dashboard Summary

May is the active month.

| Metric | Value |
| --- | ---: |
| Monthly subscription income | PKR 40,920 |
| Weekly subscription income | PKR 56,440 |
| Total income | PKR 97,360 |
| Selected month expenses | PKR 13,770 |
| Payment received | PKR 0 |
| Pending amount | PKR 97,360 |
| Net profit | PKR 83,590 |
| Active customers | 9 |

Important issue:

The dashboard says total payment received is `0`, pending amount is `97,360`, but at least one monthly row is marked `Paid`. This means payment status and payment amount are not synchronized.

### Monthly Subscriptions

Confirmed active monthly customer:

| Customer / House | Month | Daily Qty | Rate | Days | Monthly Units | Monthly Cost | Payment Received | Pending | Status |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| 69 E Model Town | May | 4 | 330 | 31 | 124 | 40,920 | blank | 40,920 | Paid |

Issue:

`Payment Status = Paid`, but `Payment Received` is blank and `Pending Amount = 40,920`.

System rule needed:

If status is `Paid`, payment received must equal total cost and pending amount must be zero. The app should prevent contradictory states.

### Weekly Subscriptions

| Customer / Area | Month | Delivery Days | Qty | Rate | Deliveries/Week | Monthly Deliveries | Monthly Cost | Pending | Status |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| State Life | May | Saturday | 4 | 380 | 1 | 4 | 6,080 | 6,080 | Unpaid |
| 47L Model Town | May | Mon to Fri | 2 | 330 | 5 | 22 | 14,520 | 14,520 | Unpaid |
| Iqbal Town 654 Kashmir Block | May | Saturday | 4 | 330 | 1 | 4 | 5,280 | 5,280 | Unpaid |
| Dental Medical Collage | May | Saturday | 2 | 380 | 1 | 4 | 3,040 | 3,040 | Unpaid |
| G2 Calvary Groung | May | blank | 1 | 430 | blank | 9 | 3,870 | 3,870 | Unpaid |
| 33 D Model Town | May | blank | blank | blank | blank | blank | 1,290 | 1,290 | Unpaid |
| Unclear row | May | blank | blank | 430 | blank | 13 | 22,360 | 22,360 | Unpaid |

Issues:

* Some customer names/addresses are incomplete.
* Some delivery days are blank.
* Rates include 330, 380, and 430, so custom rates or mixed products exist.
* One row has customer name parsed incorrectly from a merged cell.
* Spelling should be normalized: "Collage" -> "College", "Groung" -> "Ground".

System rules needed:

* Customer name/house is required.
* Area is required.
* Product type should be explicit: Cow, Buffalo, Blend, Custom.
* Delivery pattern should be explicit: Daily, Mon-Fri, Saturday, custom days.
* App should calculate monthly deliveries automatically.

### Expenses

May expense entries include:

| Type | Amount | Notes |
| --- | ---: | --- |
| Miscellaneous | 1,500 | blank |
| Fuel / Transport | 900 | blank |
| Fuel / Transport | 850 | blank |
| Fuel / Transport | 1,500 | blank |
| blank | 850 | blank |
| Fuel / Transport | 500 | blank |
| Fuel / Transport | 1,220 | PETROL 500, Rider 330, village rider 380 |
| Fuel / Transport | 500 | Use by Ali |
| Packaging & Bottles | 2,000 | purchase bottles |
| Fuel / Transport | 500 | 17 May petrol Harbanspura and Model Town |
| Fuel / Transport | 1,000 | Model Town, Gulberg, village |
| blank | 1,400 | Rider 440, Model Town, Calvary, Johar Town, Bahria |
| Fuel / Transport | 350 | Baba sy liyay |
| Fuel / Transport | 1,200 | rider 400, Model Town 300, Bahria 500 |

Expense pattern:

Fuel/rider cost is a major recurring operational expense. The system should track route-wise cost and rider-wise cost separately.

Recommended expense categories:

* Milk purchase / production
* Fuel
* Rider payment
* Bottles / packaging
* Farm operations
* Refunds / adjustments
* Miscellaneous

### Sheet1 - One-Time / Raw Delivery Records

This sheet appears to track individual deliveries and quick sales.

Rows include:

| Area / Customer | Excel Date | Approx Date | Price | Qty | Notes |
| --- | ---: | --- | ---: | --- | --- |
| G2 house Cantt | 46148 | 2026-05-06 | 430 | 1L | blank |
| G2 house Cantt | 46152 | 2026-05-10 | 430 | 1L | petrol 430 |
| Bahria | 46153 | 2026-05-11 | 430 | 1L | blank |
| Izmir town | 46153 | 2026-05-11 | 330 | 1 L | petrol 850 |
| Askari 11 | 46153 | 2026-05-11 | 660 | 2 L | blank |
| Bahria Sector D | 46154 | 2026-05-12 | 860 | 2 L | petrol 500 |
| Bahria Sector B | 46155 | 2026-05-13 | 2580 | 6 L | bottles/riders/petrol notes |
| 52 E Model Town | 46155 | 2026-05-13 | 760 | 2 L | blank |
| Phase 5 | 46155 | 2026-05-13 | 660 | 2L | 500 use by Ali |
| 33 D model town | 46158 | 2026-05-16 | 860 | 2 L | with Ali |
| Gulberg | 46160 | 2026-05-18 | 430 | 1 L | unclear |
| Model Town R block | 46160 | 2026-05-18 | 760 | 2 L | with Ali |
| Bahria Sector B | 46160 | 2026-05-18 | 1720 | 4L | with Ali |
| 91 h3 johar town | 46162 | 2026-05-20 | 330 | 1 L | in expense |
| Gulberg | 46163 | 2026-05-21 | 430 | 1L | 250 petrol |

Interpretation:

This looks like ad hoc customer/order tracking. It should become an `Orders` table in the app, not remain separate from subscriptions.

---

## Business Model Analysis

### Current Model

The farm currently appears to run on three parallel streams:

1. Monthly daily subscriptions
2. Weekly/custom subscriptions
3. One-time orders / trial deliveries

This is a strong model, but the data needs one unified order system.

### Best System Structure

Use a single customer/order engine:

* Customer can have zero or many subscriptions.
* A subscription generates delivery orders.
* One-time order is simply an order without a subscription.
* Every delivery has a route, rider, status, and payment state.
* Payments can be collected per order or monthly.

### Main Operational Pain Points

1. Payment tracking is inconsistent.
2. Delivery notes are mixed with expense notes.
3. Rider/fuel expenses are not route-separated.
4. Weekly delivery patterns are not strict enough.
5. Product type is sometimes implied by price only.
6. Customer addresses are not standardized.
7. Brand messaging has multiple contact numbers and delivery-area claims.

---

## Recommended Next.js Product Requirements

### Public Website

Pages:

* Home
* Products
* Subscription Plans
* Delivery Areas
* About Farm
* Quality Promise
* Refer and Save
* Contact / WhatsApp Order

Public CTAs:

* Order on WhatsApp
* Start Daily Delivery
* Book Trial Bottle
* Check Delivery Area
* Refer a Neighbor

### Customer App

Features:

* Login/signup
* Address management
* Choose cow/buffalo milk
* Daily/weekly/custom subscription
* Pause/resume delivery
* Add extra bottle for tomorrow
* Monthly bill view
* Payment history
* Complaint/missed delivery report
* Referral code

### Admin Dashboard

Must-have KPIs:

* Today required liters
* Cow milk liters required
* Buffalo milk liters required
* Active subscriptions
* Today deliveries
* Pending payments
* Monthly revenue
* Monthly expenses
* Net profit
* Top routes by demand
* Fuel/rider cost
* Complaints

### Delivery Rider Panel

Mobile-first:

* Today route
* Customer name/house
* Area
* Quantity
* Product type
* Payment status
* Call/WhatsApp customer
* Mark delivered
* Mark missed
* Add rider note
* Collect payment

### AI Agents

#### Customer Support Agent

Handles:

* Pricing questions
* Delivery area questions
* Subscription setup
* Pause/resume request
* Complaint intake
* Referral offer explanation

#### Order Agent

Handles:

* Converts chat into structured order
* Detects product, quantity, address, delivery frequency
* Creates draft order/subscription for admin approval

#### Delivery Planning Agent

Handles:

* Groups daily deliveries by area
* Flags incomplete addresses
* Suggests rider routes
* Calculates total liters by route

#### Finance Agent

Handles:

* Finds unpaid customers
* Explains monthly pending amount
* Summarizes expenses
* Detects contradictions like "Paid but amount pending"

#### Brand/Marketing Agent

Handles:

* Generates WhatsApp broadcast messages
* Creates caption drafts for Instagram
* Suggests campaigns like referral discount
* Keeps tone consistent with brand promise

---

## Database Model Inputs

Essential entities:

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

Important enums:

* ProductType: COW_MILK, BUFFALO_MILK, BLEND, RICE, WHEAT
* SubscriptionFrequency: DAILY, WEEKLY, CUSTOM_DAYS, ONE_TIME
* DeliveryStatus: PENDING, OUT_FOR_DELIVERY, DELIVERED, MISSED, CANCELLED
* PaymentStatus: UNPAID, PARTIAL, PAID, REFUNDED
* ExpenseType: FUEL, RIDER, PACKAGING, MILK_PURCHASE, FARM_OPS, MISC

---

## Data Cleanup Rules for App Import

Before importing Excel data into the database:

1. Normalize product type instead of relying only on price.
2. Convert all Excel serial dates to real dates.
3. Split notes into customer notes, rider notes, and expense notes.
4. Fix payment contradictions.
5. Require customer name, phone, area, and address.
6. Standardize area names.
7. Separate rider payment from fuel cost.
8. Mark uncertain records as `needs_review`.

---

## Website Copy Direction

Recommended hero:

**Pure Milk. Pure Promise.**

Supporting line:

Fresh cow and buffalo milk delivered from our farm to your home across Lahore.

Primary CTA:

**Order on WhatsApp**

Secondary CTA:

**Start Monthly Subscription**

Trust points:

* 100% pure and fresh
* No preservatives
* Daily morning delivery
* Cow and buffalo milk available
* Trusted by local families

Referral campaign:

**Refer & Save**

Offer:

Refer another home near your residence and get **10% off your monthly bill**.

Condition:

Within 5 KM of your residence.

---

## Recommended MVP Build Order

1. Public website with brand assets and WhatsApp order CTA
2. Product/pricing pages
3. Admin dashboard with customer/order/payment tables
4. Subscription engine
5. Delivery rider dashboard
6. Expense tracker
7. Payment reconciliation
8. AI customer support and admin insight agents
9. Excel import tool
10. Deployment

---

## Key Decisions Needed From Owner

1. Is `0339-5235323` the final WhatsApp number?
2. Is service only Lahore, or also Rawalpindi/Islamabad?
3. Is "organic" legally/certification-wise confirmed?
4. Are products raw, boiled, pasteurized, or just fresh farm milk?
5. Are bottles returnable glass bottles, plastic bottles, or both?
6. Is buffalo milk always PKR 430 and cow milk always PKR 330?
7. What are subscription rules for holidays and skipped deliveries?
8. Should customers pay daily, weekly, or monthly?

