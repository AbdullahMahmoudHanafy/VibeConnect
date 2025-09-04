drop database if exists social_app;
CREATE DATABASE social_app;
USE social_app;

-- Users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255)
) ENGINE=InnoDB;

-- Posts
CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    text TEXT,
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    shares_count INT DEFAULT 0,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY(user_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE post_likes (
    user_id INT,
    post_id INT,
    PRIMARY KEY(user_id, post_id),
    FOREIGN KEY(post_id) REFERENCES posts(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
) ENGINE=InnoDB;

DELIMITER //

CREATE TRIGGER trg_post_likes_after_insert
AFTER INSERT ON post_likes
FOR EACH ROW
BEGIN
    UPDATE posts
    SET likes_count = likes_count + 1
    WHERE id = NEW.post_id;
END;
//

CREATE TRIGGER trg_post_likes_after_delete
AFTER DELETE ON post_likes
FOR EACH ROW
BEGIN
    UPDATE posts
    SET likes_count = likes_count - 1
    WHERE id = OLD.post_id;
END;
//

DELIMITER ;



CREATE TABLE comments (
	id INT,
    user_id INT,
	post_id INT,
    text TEXT,
    likes_count INT DEFAULT 0,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id, user_id, post_id),
    FOREIGN KEY (post_id) REFERENCES posts(id)
) ENGINE=InnoDB;

DELIMITER //

CREATE TRIGGER trg_comments_after_insert
AFTER INSERT ON comments
FOR EACH ROW
BEGIN
    UPDATE posts
    SET comments_count = comments_count + 1
    WHERE id = NEW.post_id;
END;
//

CREATE TRIGGER trg_comments_after_delete
AFTER DELETE ON comments
FOR EACH ROW
BEGIN
    UPDATE posts
    SET comments_count = comments_count - 1
    WHERE id = OLD.post_id;
END;
//

DELIMITER ;


CREATE TABLE post_shares (
    user_id INT,   -- the user who shares
    post_id INT,   -- the post being shared
    PRIMARY KEY(user_id, post_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (post_id) REFERENCES posts(id)
) ENGINE=InnoDB;

DELIMITER //

-- Increment after insert
CREATE TRIGGER trg_post_shares_after_insert
AFTER INSERT ON post_shares
FOR EACH ROW
BEGIN
    UPDATE posts
    SET shares_count = shares_count + 1
    WHERE id = NEW.post_id;
END;
//

-- Decrement after delete
CREATE TRIGGER trg_post_shares_after_delete
AFTER DELETE ON post_shares
FOR EACH ROW
BEGIN
    UPDATE posts
    SET shares_count = shares_count - 1
    WHERE id = OLD.post_id;
END;
//

DELIMITER ;

-- Comment likes table
CREATE TABLE comment_likes (
    user_id INT,
    post_id INT,
    comment_id INT,
    comment_user_id INT,
    PRIMARY KEY (user_id, post_id, comment_id, comment_user_id),
    FOREIGN KEY (comment_id, comment_user_id, post_id) REFERENCES comments(id, user_id, post_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Trigger: increment likes_count when like is added
DELIMITER //
CREATE TRIGGER trg_comment_like_insert
AFTER INSERT ON comment_likes
FOR EACH ROW
BEGIN
    UPDATE comments
    SET likes_count = likes_count + 1
    WHERE id = NEW.comment_id AND user_id = NEW.comment_user_id AND post_id = NEW.post_id;
END//
DELIMITER ;

-- Trigger: decrement likes_count when like is removed
DELIMITER //
CREATE TRIGGER trg_comment_like_delete
AFTER DELETE ON comment_likes
FOR EACH ROW
BEGIN
    UPDATE comments
    SET likes_count = likes_count - 1
    WHERE id = OLD.comment_id AND user_id = OLD.comment_user_id AND post_id = OLD.post_id;
END//
DELIMITER ;


-- Followers (self M-M)
CREATE TABLE follows (
    follower_id INT,
    following_id INT,
    PRIMARY KEY(follower_id, following_id),
    FOREIGN KEY(follower_id) REFERENCES users(id),
    FOREIGN KEY(following_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- Notifications (1-M)
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    text TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    friend_request_id INT DEFAULT -1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- Friends (self M-M)
CREATE TABLE friends (
    user_id INT,
    friend_id INT,
    PRIMARY KEY(user_id, friend_id),
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(friend_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- Favourites (M-M)
CREATE TABLE favourites (
    user_id INT,
    fav_user_id INT,
    PRIMARY KEY(user_id, fav_user_id),
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(fav_user_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- Chats (M-M between users)
CREATE TABLE chats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    person1_id INT,
    person2_id INT,
    FOREIGN KEY(person1_id) REFERENCES users(id),
    FOREIGN KEY(person2_id) REFERENCES users(id)
) ENGINE=InnoDB;


-- Chats (1-M for users each has it's own chat with ai)
CREATE TABLE ai_chats (
	user_id INT,
    message_id INT,
    text TEXT,
    is_response BOOLEAN,
    PRIMARY KEY(user_id, message_id),
    FOREIGN KEY(user_id) REFERENCES users(id)
) ENGINE=InnoDB;



