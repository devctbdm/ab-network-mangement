# AB-Network Employee Management System (ABEMS)

A full-stack employee management dashboard built with **Next.js 16**, **React 19**, **Prisma**, and **PostgreSQL**. This application serves a dual purpose: a public-facing ISP landing page for "AB-Network" and a comprehensive role-based employee management system.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **UI Library** | React 19 |
| **Language** | TypeScript 5 (strict mode) |
| **Styling** | Tailwind CSS v4 + shadcn/ui (Radix Nova) |
| **Database** | PostgreSQL + Prisma ORM v7 |
| **Auth** | Custom JWT (jose) + bcryptjs |
| **Charts** | recharts |
| **Tables** | @tanstack/react-table |
| **Animation** | motion (Framer Motion v12) |
| **Icons** | lucide-react |
| **Excel Export** | xlsx |
| **Notifications** | sonner |

---

## Project Structure

```
src/
├── actions/          # Server Actions (business logic)
│   ├── auth.ts       # Login/logout
│   ├── attendance.ts # Attendance CRUD
│   ├── leave.ts      # Leave management
│   ├── advance.ts    # Advance salary requests
│   ├── salary.ts     # Salary calculation & payroll
│   ├── dashboard.ts  # Admin dashboard data
│   ├── employee-dashboard.ts
│   ├── employee-stats.ts
│   ├── user.ts       # User management
│   ├── holiday.ts    # Holiday CRUD
│   ├── festival-bonus.ts
│   ├── report.ts     # Report generation
│   ├── settings.ts   # Global settings
│   ├── profile.ts    # Employee profile
│   └── admin-profile.ts
│
├── app/              # Next.js App Router pages
│   ├── (auth)/login/           # Login page
│   ├── (dashboard)/admin/      # Admin dashboard (7 sub-pages)
│   ├── (dashboard)/employee/   # Employee dashboard (6 sub-pages)
│   ├── api/auth/               # API routes (session, logout)
│   ├── contact/                # Public contact page
│   ├── page.tsx                # Landing page (ISP marketing)
│   └── layout.tsx              # Root layout
│
├── components/       # React components
│   ├── ui/           # shadcn/ui primitives (sidebar, table, etc.)
│   ├── dashboard/    # Admin & employee dashboard widgets
│   └── employee/     # Employee-specific views
│
├── lib/              # Shared utilities
│   ├── auth.ts       # JWT helpers (sign/verify/hash)
│   ├── prisma.ts     # Singleton Prisma client
│   ├── salary-calc.ts # Salary calculation engine
│   ├── excel.ts      # Excel export utilities
│   └── constants.ts  # Navigation config, currency (BDT)
│
├── generated/prisma/ # Auto-generated Prisma client
├── hooks/            # Custom React hooks
└── types/            # TypeScript type definitions

prisma/
├── schema.prisma     # Database schema (10 models, 5 enums)
└── seed.ts           # Database seeder
```

---

## Features

### Role-Based Access

Three roles with distinct dashboards:

- **OWNER** — Full access to all admin features
- **ADMIN** — Same as OWNER (operational management)
- **EMPLOYEE** — Self-service features only

### Admin Dashboard (`/admin`)

- Summary cards (total employees, present/absent today, pending requests)
- Pending leave & advance salary approvals (inline Approve/Reject)
- Recent employees table
- Attendance trend chart (last 7 days via recharts)

### User Management (`/admin/users`)

- CRUD for all users (name, email, role, monthly salary, leave quota)

### Attendance Tracking (`/admin/attendance`)

- Monthly grid view per employee
- Date-range filtering & per-user filtering
- Mark/override attendance for any user on any date
- Holiday management (`/admin/attendance/holiday`)
- Excel export

### Leave Management (`/admin/leave`)

- View, approve, reject, delete leave requests

### Advance Salary (`/admin/advance`)

- View/approve/reject requests
- Create advances for any employee

### Salary & Payroll (`/admin/salary`)

- Monthly salary calculation with attendance deductions (daily rate = salary / 30)
- Advance deduction tracking
- Festival bonus processing (employees with 6+ months tenure)
- Payroll batch processing (calculate all employees at once)
- Mark salaries as paid
- Excel export (salary reports + individual payslips)

### Reports (`/admin/reports`)

- Attendance, salary, and leave reports with date-range filtering
- Excel export

### Settings (`/admin/settings`)

- Global settings (company name, default working days, advance %, eid bonus)
- Per-month working day configuration
- Festival bonus creation/deletion

### Employee Dashboard (`/employee`)

- Personal attendance summary
- Leave quota remaining
- Advance salary taken
- Salary breakdown
- Quick actions (mark attendance, apply leave, request advance)

### Employee Self-Service

- **My Stats** — Attendance & salary history
- **My Attendance** — Personal monthly calendar view
- **Mark Attendance** — Self check-in (today only)
- **Leave** — Apply & view leave history
- **Advance Salary** — Request & view history
- **Settings** — Profile management

---

## Database Schema (Prisma)

| Model | Purpose |
|---|---|
| `User` | Employees & admins (role, salary, leave quota) |
| `Attendance` | Daily attendance (unique per user per date) |
| `Leave` | Leave requests (sick/casual/annual) |
| `AdvanceSalary` | Advance salary requests |
| `SalaryRecord` | Monthly salary records (unique per user per month) |
| `WorkingDaySetting` | Per-month working day count |
| `FestivalBonus` | Bonus definitions (percentage-based) |
| `FestivalBonusPayment` | Per-employee bonus payments |
| `Holiday` | Company holidays |
| `GlobalSetting` | Key-value settings store |
| `AuditLog` | Audit trail for actions |

---

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database

### Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your PostgreSQL connection string

# Generate Prisma client
npm run prisma generate

# Run database migrations
npm run prisma migrate dev

# Seed the database (creates default admin & sample data)
npm run prisma db seed

# Start development server
npm run dev
```

### Create Admin User

Run the seed script to create a default admin account:

```bash
npm run prisma db seed
```

The seed creates an `OWNER` account. Check `prisma/seed.ts` for credentials.

---

## Available Scripts

| Script | Command |
|---|---|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | `prisma generate && next build` |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Architecture Notes

### Authentication

Custom JWT-based authentication using the `jose` library. On login, a signed JWT is stored in a `ab_session` cookie (7-day expiry). Passwords are hashed with bcryptjs.

Server Actions use `verifySession()` from `src/lib/auth.ts` to protect all operations. Layouts check role-based access and redirect unauthorized users.

### Salary Calculation Logic

- Daily rate = `monthlySalary / 30`
- Attendance deduction = `absentDays × daily rate + halfDays × daily rate × 0.5`
- Advance deduction = sum of approved, undeducted advances
- Net payable = `grossSalary - attendanceDeduction - advanceDeduction + festivalBonus`

### Server Actions vs API Routes

Business logic is implemented as **Server Actions** (15 files in `src/actions/`). Only 3 traditional API routes exist:

- `GET /api/auth/session` — Returns current session user
- `POST /api/auth/logout` — Destroys session
- `[...nextauth]/route.ts` — NextAuth placeholder (unused)

### Build Pipeline

```bash
npm run build   # prisma generate → next build
```

TypeScript build errors are suppressed in `next.config.ts` (`ignoreBuildErrors: true`).

---

## Dependencies

Key packages at a glance:

| Package | Purpose |
|---|---|
| next 16 | Framework |
| prisma / @prisma/client 7 | ORM |
| jose | JWT signing/verification |
| bcryptjs | Password hashing |
| zod 4 | Schema validation |
| motion 12 | Animations |
| recharts | Charts |
| @tanstack/react-table 8 | Data tables |
| xlsx | Excel export |
| tailwindcss 4 | CSS framework |
| shadcn 4 | UI component system |

---

## Contributing

1. Ensure you have a PostgreSQL instance running
2. Copy `.env.example` to `.env` and configure `DATABASE_URL`
3. Run `npm install` then `npm run prisma migrate dev` to set up the database
4. Make your changes and test with `npm run dev`
5. Run `npm run build` before submitting to verify the build succeeds

---

## License

Private — internal use.
