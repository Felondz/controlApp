# Database Schema - ControlApp

Complete documentation of the database schema and relationships between models.

## 📋 Table of Contents

1. [General Description](#general-description)
2. [Tables](#tables)
3. [Relationships](#relationships)
4. [Indexes](#indexes)
5. [Useful Queries](#useful-queries)
6. [Migrations](#migrations)

---

## 📊 General Description

ControlApp uses **MySQL 8.0** with the following features:

- ✅ Many-to-Many relationships
- ✅ Soft Deletes (logical deletion)
- ✅ Timestamps (created_at, updated_at)
- ✅ UUID and autoincrement IDs
- ✅ Indexes for optimization
- ✅ Foreign keys with cascades

### Entity-Relationship Diagram

```
┌─────────────────┐
│     USERS       │
├─────────────────┤
│ id (PK)         │
│ name            │
│ email (UNIQUE)  │
│ password        │
│ email_verified  │
│ created_at      │
└─────────────────┘
        │ 1
        │
        │ M
        ├──────────────────┬────────────────────┬──────────────────┐
        │                  │                    │                  │
        ▼ 1                ▼ M                  ▼ M                ▼ M
┌──────────────────┐ ┌──────────────┐ ┌──────────────────┐ ┌──────────────────┐
│   PROJECTS       │ │ INVITATIONS  │ │ PROJECT_USER     │ │   CATEGORIES     │
├──────────────────┤ ├──────────────┤ ├──────────────────┤ ├──────────────────┤
│ id (PK)          │ │ id (PK)      │ │ project_id (FK)  │ │ id (PK)          │
│ name             │ │ project_id   │ │ user_id (FK)     │ │ name             │
│ currency         │ │ email        │ │ role             │ │ project_id (FK)  │
│ user_id (FK)     │ │ status       │ │                  │ │ color            │
│ deleted_at       │ │ created_at   │ │ created_at       │ │ icon             │
│ created_at       │ │              │ │                  │ │ deleted_at       │
│ updated_at       │ │              │ │                  │ │ created_at       │
└──────────────────┘ └──────────────┘ └──────────────────┘ └──────────────────┘
        │ 1                                                         │ M
        │                                                           │
        │ M                                                         │ 1
        │                                                           ▼
        └──────────────────────────┬──────────────────────────┐    │
                                   │                          │    │
                                   ▼                          ▼    │
                            ┌──────────────┐         ┌────────────────────┐
                            │   ACCOUNTS   │         │ TRANSACTIONS       │
                            ├──────────────┤         ├────────────────────┤
                            │ id (PK)      │ 1       │ id (PK)            │
                            │ name         │◄────────│ account_id (FK)    │
                            │ type         │ M       │ category_id (FK)   │
                            │ balance      │         │ description        │
                            │ project_id   │         │ amount             │
                            │ deleted_at   │         │ type (income/exp)  │
                            │ created_at   │         │ date               │
                            │ updated_at   │         │ deleted_at         │
                            └──────────────┘         │ created_at         │
                                                     │ updated_at         │
                                                     └────────────────────┘
```

---

## 📑 Tables

### 1. USERS
 
 System user table.
 
 ```sql
 CREATE TABLE users (
   id bigint UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
   name varchar(255) NOT NULL,
   email varchar(255) UNIQUE NOT NULL,
   email_verified_at timestamp NULL,
   password varchar(255) NOT NULL,
   remember_token varchar(100) NULL,
   is_super_admin boolean NOT NULL DEFAULT false,
   locale varchar(5) NOT NULL DEFAULT 'es',
   profile_photo_path varchar(2048) NULL,
   global_theme varchar(50) NOT NULL DEFAULT 'purple-modern',
   created_at timestamp NULL,
   updated_at timestamp NULL,
   
   INDEX idx_email (email),
   INDEX idx_created_at (created_at)
 );
 ```
 
 **Fields:**
 | Field | Type | Description |
 |-------|------|-------------|
 | `id` | bigint UNSIGNED | Auto-incremented unique ID |
 | `name` | varchar(255) | User full name |
 | `email` | varchar(255) | Unique email for login |
 | `email_verified_at` | timestamp | Email verification date |
 | `password` | varchar(255) | Encrypted password (bcrypt) |
 | `remember_token` | varchar(100) | "Remember me" token |
 | `is_super_admin` | boolean | Indicates if user is super admin |
 | `locale` | varchar(5) | Language preference (es/en) |
 | `profile_photo_path` | varchar(2048) | Profile photo path |
 | `global_theme` | varchar(50) | Preferred global theme |
 | `created_at` | timestamp | Creation date |
 | `updated_at` | timestamp | Last update date |
 
 ---
 
 ### 2. PROJECTS
 
 Financial projects table.
 
 ```sql
 CREATE TABLE projects (
   id bigint UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
   name varchar(255) NOT NULL,
   description text NULL,
   currency varchar(3) NOT NULL DEFAULT 'COP',
   user_id bigint UNSIGNED NOT NULL,
   is_personal boolean NOT NULL DEFAULT false,
   modules json NULL,
   color varchar(7) NULL,
   icon varchar(50) NULL,
   image_path varchar(2048) NULL,
   theme varchar(50) NOT NULL DEFAULT 'purple-modern',
   typography varchar(50) NOT NULL DEFAULT 'sans',
   deleted_at timestamp NULL,
   created_at timestamp NULL,
   updated_at timestamp NULL,
   
   FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
   INDEX idx_user_id (user_id),
   INDEX idx_deleted_at (deleted_at),
   INDEX idx_created_at (created_at)
 );
 ```
 
 **Fields:**
 | Field | Type | Description |
 |-------|------|-------------|
 | `id` | bigint UNSIGNED | Unique ID |
 | `name` | varchar(255) | Project name |
 | `description` | text | Project description |
 | `currency` | varchar(3) | Currency code (USD, MXN, etc) |
 | `user_id` | bigint UNSIGNED | Owner (FK to users) |
 | `is_personal` | boolean | Indicates if it's a personal project |
 | `modules` | json | Active modules (finance, tasks) |
 | `color` | varchar(7) | Identifying color |
 | `icon` | varchar(50) | Icon or emoji |
 | `image_path` | varchar(2048) | Cover image path |
 | `theme` | varchar(50) | Specific color theme |
 | `typography` | varchar(50) | Specific typography |
 | `deleted_at` | timestamp | Soft delete date |
 | `created_at` | timestamp | Creation date |
 | `updated_at` | timestamp | Last update date |
 
 **Features:**
 - Soft delete: not actually deleted
 - Belongs to one owner user
 - Can have multiple members via `project_user`

---

### 3. PROJECT_USER

Pivot table: many-to-many relationship between projects and users.

```sql
CREATE TABLE project_user (
  project_id bigint UNSIGNED NOT NULL,
  user_id bigint UNSIGNED NOT NULL,
  role varchar(50) NOT NULL DEFAULT 'member',
  created_at timestamp NULL,
  
  PRIMARY KEY (project_id, user_id),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
);
```

**Valid roles:**
- `admin` - Full project control
- `member` - Basic access

---

### 4. CATEGORIES

Transaction categories table.

```sql
CREATE TABLE categories (
  id bigint UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  project_id bigint UNSIGNED NOT NULL,
  name varchar(255) NOT NULL,
  color varchar(7) NOT NULL DEFAULT '#000000',
  icon varchar(2) NULL,
  deleted_at timestamp NULL,
  created_at timestamp NULL,
  updated_at timestamp NULL,
  
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  INDEX idx_project_id (project_id),
  INDEX idx_deleted_at (deleted_at)
);
```

---

### 5. ACCOUNTS

Bank/financial accounts table.

```sql
CREATE TABLE accounts (
  id bigint UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  project_id bigint UNSIGNED NOT NULL,
  name varchar(255) NOT NULL,
  type varchar(50) NOT NULL,
  balance decimal(10, 2) NOT NULL DEFAULT 0.00,
  deleted_at timestamp NULL,
  created_at timestamp NULL,
  updated_at timestamp NULL,
  
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  INDEX idx_project_id (project_id),
  INDEX idx_type (type),
  INDEX idx_deleted_at (deleted_at)
);
```

**Valid types:**
- `bank` - Bank account
- `cash` - Cash money
- `card` - Credit/debit card
- `digital` - Digital wallet, PayPal, etc.

---

### 6. TRANSACTIONS

Financial transactions table.

```sql
CREATE TABLE transactions (
  id bigint UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  account_id bigint UNSIGNED NOT NULL,
  category_id bigint UNSIGNED NOT NULL,
  description varchar(255) NOT NULL,
  amount decimal(10, 2) NOT NULL,
  type varchar(50) NOT NULL,
  date date NOT NULL,
  deleted_at timestamp NULL,
  created_at timestamp NULL,
  updated_at timestamp NULL,
  
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  INDEX idx_account_id (account_id),
  INDEX idx_category_id (category_id),
  INDEX idx_type (type),
  INDEX idx_date (date),
  INDEX idx_deleted_at (deleted_at)
);
```

**Valid types:**
- `income` - Money coming in
- `expense` - Money going out

---

## 🔗 Relationships

### Eloquent Relationships

```php
// User
class User {
    public function projects() {
        return $this->hasMany(Project::class);
    }
    
    public function memberProjects() {
        return $this->belongsToMany(Project::class, 'project_user');
    }
}

// Project
class Project {
    public function owner() {
        return $this->belongsTo(User::class, 'user_id');
    }
    
    public function members() {
        return $this->belongsToMany(User::class, 'project_user');
    }
    
    public function categories() {
        return $this->hasMany(Category::class);
    }
    
    public function accounts() {
        return $this->hasMany(Account::class);
    }
}

// Account
class Account {
    public function transactions() {
        return $this->hasMany(Transaction::class);
    }
}

// Transaction
class Transaction {
    public function account() {
        return $this->belongsTo(Account::class);
    }
    
    public function category() {
        return $this->belongsTo(Category::class);
    }
}
```

---

## 📇 Indexes

### Indexes by Table

| Table | Index | Fields | Purpose |
|-------|--------|--------|----------|
| users | PRIMARY | id | Primary key |
| users | UNIQUE | email | Quick user lookup |
| projects | idx_user_id | user_id | Relationship |
| projects | idx_deleted_at | deleted_at | Soft delete |
| categories | idx_project_id | project_id | Relationship |
| accounts | idx_project_id | project_id | Relationship |
| transactions | idx_account_id | account_id | Relationship |
| transactions | idx_category_id | category_id | Relationship |
| transactions | idx_date | date | Date range |

---

## 📝 Useful Queries

### Dashboard Summary

```sql
-- Complete financial summary
SELECT 
    p.id,
    p.name,
    p.currency,
    COUNT(DISTINCT pu.user_id) as members,
    COUNT(DISTINCT a.id) as accounts,
    SUM(a.balance) as total_balance,
    COUNT(DISTINCT cat.id) as categories
FROM projects p
LEFT JOIN project_user pu ON p.id = pu.project_id
LEFT JOIN accounts a ON p.id = a.project_id AND a.deleted_at IS NULL
LEFT JOIN categories cat ON p.id = cat.project_id AND cat.deleted_at IS NULL
WHERE p.user_id = 1 AND p.deleted_at IS NULL
GROUP BY p.id, p.name, p.currency;
```

### Monthly Report

```sql
-- Expenses by category this month
SELECT 
    c.name,
    c.icon,
    SUM(t.amount) as total,
    COUNT(t.id) as transactions
FROM transactions t
JOIN categories c ON t.category_id = c.id
WHERE t.account_id IN (
    SELECT id FROM accounts WHERE project_id = 1
)
AND t.type = 'expense'
AND MONTH(t.date) = MONTH(NOW())
AND YEAR(t.date) = YEAR(NOW())
AND t.deleted_at IS NULL
GROUP BY c.id, c.name, c.icon
ORDER BY total DESC;
```

---

## 🔄 Migrations

### Running Migrations

```bash
# Run all pending migrations
php artisan migrate

# Rollback last migration
php artisan migrate:rollback

# Reset database (drop + migrate)
php artisan migrate:reset

# Migrate + seed
php artisan migrate:fresh --seed
```

---

## 🔒 Data Integrity

### Foreign Keys

All foreign keys have:
- `ON DELETE CASCADE` - Delete related records
- `ON UPDATE CASCADE` - Update references

### Soft Deletes

Records are not deleted, marked with `deleted_at`:

```php
// Normal query (excludes soft deleted)
$active = Project::all();

// Include soft deleted
$all = Project::withTrashed()->get();

// Only soft deleted
$deleted = Project::onlyTrashed()->get();

// Restore
$project->restore();

// Permanently delete
$project->forceDelete();
```

---

**Last Updated**: November 15, 2025
