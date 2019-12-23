-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Dec 23, 2019 at 05:53 AM
-- Server version: 10.1.13-MariaDB
-- PHP Version: 7.0.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ia_project`
--

-- --------------------------------------------------------

--
-- Table structure for table `answers`
--

CREATE TABLE `answers` (
  `id` int(11) NOT NULL,
  `answer` text NOT NULL,
  `correct` tinyint(1) NOT NULL,
  `question_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `candidates`
--

CREATE TABLE `candidates` (
  `id` int(11) NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `cv_link` varchar(255) DEFAULT NULL,
  `phone` varchar(16) DEFAULT NULL,
  `username` varchar(25) NOT NULL,
  `approval` tinyint(1) NOT NULL DEFAULT '0',
  `position_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `candidates`
--

INSERT INTO `candidates` (`id`, `full_name`, `email`, `password`, `cv_link`, `phone`, `username`, `approval`, `position_id`) VALUES
(19, 'Md Maruf Billah', 'maruf.fci@gmail.com', '12345', 'some', '123456789', 'marufi', 0, 4),
(24, 'Md Maruf Billah', 'maruf@gmail.com', '12345', NULL, NULL, 'maruf', 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `candidates_answers`
--

CREATE TABLE `candidates_answers` (
  `id` int(11) NOT NULL,
  `candidate_id` int(11) DEFAULT NULL,
  `exam_id` int(11) DEFAULT NULL,
  `answers` text COMMENT 'JSON array of question object, question object includes: question_id, answer_id, mark. If not marked, and answer_id == -1, then skipped'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `candidates_exams`
--

CREATE TABLE `candidates_exams` (
  `id` int(11) NOT NULL,
  `candidate_id` int(11) DEFAULT NULL,
  `deadline` date NOT NULL,
  `sequence` int(11) NOT NULL DEFAULT '0',
  `exam_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `exams`
--

CREATE TABLE `exams` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `exams`
--

INSERT INTO `exams` (`id`, `name`, `description`) VALUES
(18, 'exam 2', 'exam 2 description');

-- --------------------------------------------------------

--
-- Table structure for table `hrs`
--

CREATE TABLE `hrs` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `hrs`
--

INSERT INTO `hrs` (`id`, `email`, `password`, `name`) VALUES
(1, 'me@marufi.com', '12345', 'Maruf');

-- --------------------------------------------------------

--
-- Table structure for table `positions`
--

CREATE TABLE `positions` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `positions`
--

INSERT INTO `positions` (`id`, `name`, `description`) VALUES
(1, 'Cloud Architect', NULL),
(2, 'Computer Systems Analyst', NULL),
(3, 'Help Desk Technician', NULL),
(4, 'IT Support Specialist', NULL),
(5, 'Chief Technology Officer (CTO)', NULL),
(6, 'Information Security', NULL),
(7, 'Senior Software Engineer', NULL),
(8, 'Software Developer', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `id` int(11) NOT NULL,
  `question` text NOT NULL,
  `exam_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(64) NOT NULL,
  `user_id` int(11) NOT NULL,
  `user_type` varchar(28) NOT NULL,
  `expire` varchar(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `user_type`, `expire`) VALUES
('4403b0470f1c37ba5855cb6dbc4190ed66c620df03645b1f0a1e6f320d18582f', 19, 'candidate', '1577149805'),
('618cc839e6944a4920b629c0468ae607493f478bf056d35cca304542e802c38a', 1, 'hr', '1577157341');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `answers`
--
ALTER TABLE `answers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `question_id` (`question_id`);

--
-- Indexes for table `candidates`
--
ALTER TABLE `candidates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `position_id` (`position_id`);

--
-- Indexes for table `candidates_answers`
--
ALTER TABLE `candidates_answers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `exam_id` (`exam_id`),
  ADD KEY `candidate_id` (`candidate_id`) USING BTREE;

--
-- Indexes for table `candidates_exams`
--
ALTER TABLE `candidates_exams`
  ADD PRIMARY KEY (`id`),
  ADD KEY `candidate_id` (`candidate_id`),
  ADD KEY `exam_id` (`exam_id`);

--
-- Indexes for table `exams`
--
ALTER TABLE `exams`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `hrs`
--
ALTER TABLE `hrs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `positions`
--
ALTER TABLE `positions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `exam_id` (`exam_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `answers`
--
ALTER TABLE `answers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `candidates`
--
ALTER TABLE `candidates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;
--
-- AUTO_INCREMENT for table `candidates_answers`
--
ALTER TABLE `candidates_answers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `candidates_exams`
--
ALTER TABLE `candidates_exams`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `exams`
--
ALTER TABLE `exams`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;
--
-- AUTO_INCREMENT for table `hrs`
--
ALTER TABLE `hrs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `positions`
--
ALTER TABLE `positions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT for table `questions`
--
ALTER TABLE `questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `answers`
--
ALTER TABLE `answers`
  ADD CONSTRAINT `answer_question_fk` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `candidates`
--
ALTER TABLE `candidates`
  ADD CONSTRAINT `candidate_position_fk` FOREIGN KEY (`position_id`) REFERENCES `positions` (`id`) ON DELETE SET NULL ON UPDATE SET NULL;

--
-- Constraints for table `candidates_answers`
--
ALTER TABLE `candidates_answers`
  ADD CONSTRAINT `answer_candidate_fk` FOREIGN KEY (`candidate_id`) REFERENCES `candidates` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `answer_exam_fk` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `candidates_exams`
--
ALTER TABLE `candidates_exams`
  ADD CONSTRAINT `candidate_answer_candidate_fk` FOREIGN KEY (`candidate_id`) REFERENCES `candidates` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `candidate_answer_exam_fk` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `question_exam_fk` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
