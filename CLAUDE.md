# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A PostgreSQL database schema project for a restaurant discovery app. Users can search for restaurants, bookmark favorites, and post ratings/reviews. This is a consumer-facing app (like Tabelog or Yelp), not a restaurant management tool. The repository contains SQL files defining the schema, seed data, and migrations.

## Common Commands

```powershell
# Apply schema to a local PostgreSQL instance
psql -U postgres -d restaurant_db -f schema.sql

# Run all migrations in order
Get-ChildItem migrations\*.sql | Sort-Object Name | ForEach-Object { psql -U postgres -d restaurant_db -f $_.FullName }

# Reset and rebuild the database from scratch
psql -U postgres -c "DROP DATABASE IF EXISTS restaurant_db; CREATE DATABASE restaurant_db;"
psql -U postgres -d restaurant_db -f schema.sql

# Load seed data
psql -U postgres -d restaurant_db -f seeds\seed.sql

# Connect to the database interactively
psql -U postgres -d restaurant_db
```

## Architecture & File Organization

```
restaurant-DB/
├── schema.sql          # Canonical full schema (tables, indexes, constraints)
├── migrations/         # Incremental numbered migrations (e.g. 001_add_orders.sql)
├── seeds/              # Static reference data (menu items, categories, etc.)
└── views/              # Reusable SQL views (optional separate files)
```

- **schema.sql** is the source of truth for the full database structure. Migrations layer changes on top of it.
- Migration files are prefixed with a zero-padded number (`001_`, `002_`) to ensure deterministic ordering.
- Seed data is idempotent — use `INSERT ... ON CONFLICT DO NOTHING` or `ON CONFLICT DO UPDATE`.
- Seeds include sample restaurants and cuisine categories for local development.

## Schema Conventions

- All tables use `id SERIAL PRIMARY KEY` (or `BIGSERIAL` for high-volume tables like `reviews`).
- Timestamps: `created_at TIMESTAMPTZ DEFAULT NOW()`, `updated_at TIMESTAMPTZ DEFAULT NOW()`.
- Use a trigger or application layer to maintain `updated_at` automatically.
- Foreign key columns are named `<referenced_table_singular>_id` (e.g. `restaurant_id`, `user_id`).
- Ratings are stored as `NUMERIC(2, 1)` (e.g. 4.5), constrained between 1.0 and 5.0.
- Soft deletes use `deleted_at TIMESTAMPTZ` (NULL means active).

## Core Domain Entities

Expected key tables for a restaurant discovery app:

- **users** — registered users (email, display name, profile)
- **restaurants** — restaurant listings (name, address, phone, website, location coordinates)
- **categories** — cuisine types / genre tags (e.g. Italian, Ramen, Café)
- **restaurant_categories** — many-to-many join between restaurants and categories
- **bookmarks** — a user saving a restaurant to their list (user_id + restaurant_id, unique)
- **reviews** — a user's rating and comment on a restaurant (rating `NUMERIC(2,1)`, body text)
- **review_photos** — images attached to a review

Aggregate rating per restaurant should be computed via a view or materialized view over `reviews`, not stored as a column.
