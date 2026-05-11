# 🗄️ Database — Suit for Fun

MySQL 8 schema and seed data.

## Setup

1. Make sure MySQL 8 is running locally.
2. Connect as root (or any user with `CREATE DATABASE` and `CREATE USER` privileges):

```bash
mysql -u root -p
```

3. (Recommended) Create a dedicated app user:

```sql
CREATE USER 'suit_app'@'localhost' IDENTIFIED BY 'change-me-in-production';
GRANT ALL PRIVILEGES ON suit_for_fun.* TO 'suit_app'@'localhost';
FLUSH PRIVILEGES;
```

4. Run the schema (this drops and recreates the DB — dev only):

```bash
mysql -u root -p < schema.sql
```

5. Run the seed:

```bash
mysql -u root -p < seed.sql
```

## Verify

```bash
mysql -u root -p -e "USE suit_for_fun; SELECT id, name, email FROM users;"
```

You should see 5 demo users.

## Demo accounts

All seed users share the password **`demo123`** (bcrypt-hashed in the DB, never stored in plaintext).

| Email | Name |
|-------|------|
| `dana@example.com` | דנה כהן |
| `yoav@example.com` | יואב לוי |
| `maya@example.com` | מאיה שטרן |
| `itay@example.com` | איתי אברמוב |
| `roni@example.com` | רוני גולן |

## Schema overview

- **`users`** — registered plaintiffs. Email is `UNIQUE`. Passwords stored as bcrypt hashes only.
- **`posts`** — lawsuits. `charges` is a `JSON` array, `author_id` is a foreign key with `ON DELETE CASCADE`. Vote tallies (`guilty_votes`, `innocent_votes`) are denormalized counters updated inside a transaction with the `votes` table.
- **`votes`** — bonus jury votes. `UNIQUE(post_id, user_id)` ensures one vote per user per post.

## Reset

To wipe everything and start over:

```bash
mysql -u root -p < schema.sql && mysql -u root -p < seed.sql
```
