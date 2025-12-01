CREATE TABLE `todos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('pending','finish') NOT NULL DEFAULT 'pending',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deadline` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `todos` (`title`, `description`, `status`, `deadline`) VALUES
('Buy groceries', 'Buy vegetables, fruits, and milk', 'pending', DATE_ADD(CURDATE(), INTERVAL 1 DAY)),
('Finish homework', 'Complete math and science assignments', 'finish', DATE_ADD(CURDATE(), INTERVAL -1 DAY)),
('Clean the room', 'Organize desk and vacuum the floor', 'pending', DATE_ADD(CURDATE(), INTERVAL 3 DAY)),
('Wash the car', 'Complete exterior wash and interior cleaning', 'pending', DATE_ADD(CURDATE(), INTERVAL -2 DAY)),
('Read a book', 'Read at least 30 pages', 'finish', DATE_ADD(CURDATE(), INTERVAL 5 DAY)),
('Call mom', 'Check in and update about my day', 'pending', DATE_ADD(CURDATE(), INTERVAL -3 DAY)),
('Reply to emails', 'Respond to important work emails', 'finish', DATE_ADD(CURDATE(), INTERVAL 2 DAY)),
('Do laundry', 'Wash, dry, and fold clothes', 'pending', DATE_ADD(CURDATE(), INTERVAL 3 DAY)),
('Pay electricity bill', 'Pay via online banking', 'pending', DATE_ADD(CURDATE(), INTERVAL 7 DAY)),
('Prepare presentation slides', 'Slides for Monday’s meeting', 'pending', DATE_ADD(CURDATE(), INTERVAL 5 DAY)),
('Exercise for 30 minutes', 'Light cardio and stretching', 'finish', DATE_ADD(CURDATE(), INTERVAL 1 DAY)),
('Write journal entry', 'Reflect on today’s activities', 'finish', DATE_ADD(CURDATE(), INTERVAL 1 DAY));
