package com.nexus.backend.features.notifications.repository;

import com.nexus.backend.features.authentication.model.User;
import com.nexus.backend.features.notifications.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipient(User recipient);

    List<Notification> findByRecipientOrderByCreationDateDesc(User user);
}
