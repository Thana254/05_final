CREATE TABLE `todos` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'unfinish',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deadline` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `todos` (`id`, `title`, `description`, `status`, `created_at`, `deadline`) VALUES
(1, 'Buy groceries', 'Buy vegetables, fruits, and milk', 'unfinish', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(2, 'Finish homework', 'Complete math and science assignments', 'finish', NOW(), DATE_ADD(NOW(), INTERVAL -1 DAY)), -- เลยกำหนด
(3, 'Clean the room', 'Organize desk and vacuum the floor', 'unfinish', NOW(), DATE_ADD(NOW(), INTERVAL 3 DAY)),
(4, 'Wash the car', 'Complete exterior wash and interior cleaning', 'unfinish', NOW(), DATE_ADD(NOW(), INTERVAL -2 DAY)), -- เลยกำหนด
(5, 'Read a book', 'Read at least 30 pages', 'finish', NOW(), DATE_ADD(NOW(), INTERVAL 5 DAY)),
(6, 'Call mom', 'Check in and update about my day', 'unfinish', NOW(), DATE_ADD(NOW(), INTERVAL -3 DAY)), -- เลยกำหนด
(7, 'Reply to emails', 'Respond to important work emails', 'finish', NOW(), DATE_ADD(NOW(), INTERVAL 2 DAY)),
(8, 'Do laundry', 'Wash, dry, and fold clothes', 'unfinish', NOW(), DATE_ADD(NOW(), INTERVAL 3 DAY)),
(9, 'Pay electricity bill', 'Pay via online banking', 'unfinish', NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY)),
(10, 'Prepare presentation slides', 'Slides for Monday’s meeting', 'unfinish', NOW(), DATE_ADD(NOW(), INTERVAL 5 DAY)),
(11, 'Exercise for 30 minutes', 'Light cardio and stretching', 'finish', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY)),
(12, 'Write journal entry', 'Reflect on today’s activities', 'finish', NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY));

ALTER TABLE `todos`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `todos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;