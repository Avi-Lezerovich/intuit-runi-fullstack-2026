-- ============================================================
--  Suit for Fun — Schema
--  Run this BEFORE seed.sql.
--  Drops existing DB if any. Use only in development.
-- ============================================================

DROP DATABASE IF EXISTS suit_for_fun;
CREATE DATABASE suit_for_fun
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE suit_for_fun;

-- ------------------------------------------------------------
-- users — registered "plaintiffs"
-- ------------------------------------------------------------
CREATE TABLE users (
  id          INT UNSIGNED      NOT NULL AUTO_INCREMENT,
  name        VARCHAR(255)      NOT NULL,
  email       VARCHAR(255)      NOT NULL,
  password    VARCHAR(255)      NOT NULL,           -- bcrypt hash ONLY
  created_at  TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_users_email (email),
  INDEX idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- posts — the lawsuits
-- ------------------------------------------------------------
CREATE TABLE posts (
  id              INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  title           VARCHAR(255)   NOT NULL,
  body            TEXT           NOT NULL,
  defendant       VARCHAR(255)   NOT NULL,
  location        VARCHAR(255)   DEFAULT NULL,
  charges         JSON           DEFAULT NULL,
  damages         VARCHAR(255)   DEFAULT NULL,
  author_id       INT UNSIGNED   NOT NULL,
  guilty_votes    INT UNSIGNED   NOT NULL DEFAULT 0,
  innocent_votes  INT UNSIGNED   NOT NULL DEFAULT 0,
  created_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_posts_author      (author_id),
  INDEX idx_posts_created_at  (created_at),
  CONSTRAINT fk_posts_author
    FOREIGN KEY (author_id) REFERENCES users (id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- votes — bonus: jury votes
-- One row per (post, user). UNIQUE constraint prevents double-voting.
-- ------------------------------------------------------------
CREATE TABLE votes (
  id        INT UNSIGNED                 NOT NULL AUTO_INCREMENT,
  post_id   INT UNSIGNED                 NOT NULL,
  user_id   INT UNSIGNED                 NOT NULL,
  side      ENUM('guilty','innocent')    NOT NULL,
  created_at TIMESTAMP                   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_post_user (post_id, user_id),
  INDEX idx_votes_post (post_id),
  INDEX idx_votes_user (user_id),
  CONSTRAINT fk_votes_post
    FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE,
  CONSTRAINT fk_votes_user
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
