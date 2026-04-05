package com.nexus.backend.features.feed.repository;

import com.nexus.backend.features.feed.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {
}