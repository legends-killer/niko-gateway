create database `niko-prod` default character set utf8 collate utf8_general_ci;

use niko-prod;

-- ----------------------------
-- Table structure for ab_test
-- ----------------------------
DROP TABLE IF EXISTS `ab_test`;
CREATE TABLE `ab_test` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `method` varchar(255) NOT NULL DEFAULT 'get',
  `origin` varchar(255) NOT NULL DEFAULT '/' COMMENT 'gateway api',
  `server` varchar(255) NOT NULL DEFAULT 'localhost' COMMENT 'server url',
  `dest` varchar(255) NOT NULL DEFAULT '/' COMMENT 'micro service router',
  `suspend` tinyint(4) NOT NULL DEFAULT '0',
  `increase` int(11) NOT NULL COMMENT 'proxy ratio percent for 2 digits at each increasement',
  `current` int(11) NOT NULL COMMENT 'current proxy ratio',
  `timeGap` int(11) NOT NULL COMMENT 'increasement time gap hours',
  `comment` varchar(255) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_9bada810e70958ad6f4655b7c5` (`origin`,`method`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------
-- Table structure for api
-- ----------------------------
DROP TABLE IF EXISTS `api`;
CREATE TABLE `api` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `comment` varchar(255) NOT NULL,
  `allowGroup` varchar(255) NOT NULL,
  `method` varchar(255) NOT NULL DEFAULT 'get',
  `origin` varchar(255) NOT NULL DEFAULT '/' COMMENT 'gateway api',
  `server` varchar(255) NOT NULL COMMENT 'server address (and port)',
  `dest` varchar(255) NOT NULL COMMENT 'destination service api',
  `customHeader` varchar(2000) NOT NULL COMMENT 'custom headers',
  `switch` tinyint(4) NOT NULL DEFAULT '0',
  `abTest` tinyint(4) NOT NULL DEFAULT '0',
  `isPublic` tinyint(4) NOT NULL DEFAULT '0',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_1898842839d2081ec177f168bd` (`origin`,`method`,`switch`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------
-- Table structure for auth_log
-- ----------------------------
DROP TABLE IF EXISTS `auth_log`;
CREATE TABLE `auth_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `service` varchar(255) NOT NULL,
  `device` varchar(255) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------
-- Table structure for biz
-- ----------------------------
DROP TABLE IF EXISTS `biz`;
CREATE TABLE `biz` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `comment` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `api` varchar(255) NOT NULL DEFAULT 'localhost',
  `allowGroup` varchar(255) NOT NULL,
  `isOpen` tinyint(4) NOT NULL DEFAULT '1',
  `isPublic` tinyint(4) NOT NULL DEFAULT '0',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_ab6bbd35778fbfe9f469b7e633` (`api`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------
-- Table structure for group
-- ----------------------------
DROP TABLE IF EXISTS `group`;
CREATE TABLE `group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL DEFAULT 'no name',
  `comment` varchar(255) NOT NULL,
  `default` tinyint(4) NOT NULL DEFAULT '0',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_8a45300fd825918f3b40195fbd` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------
-- Table structure for system
-- ----------------------------
DROP TABLE IF EXISTS `system`;
CREATE TABLE `system` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key` varchar(255) NOT NULL,
  `value` varchar(2000) NOT NULL,
  `comment` varchar(255) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_f63cf64f5604ba53befd7bfaf9` (`key`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `refreshToken` varchar(255) NOT NULL,
  `refreshTokenExp` datetime NOT NULL,
  `accessToken` varchar(255) NOT NULL,
  `accessTokenExp` datetime NOT NULL,
  `staffId` varchar(255) NOT NULL,
  `staffName` varchar(255) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_03585d421deb10bbc326fffe4c` (`refreshToken`),
  UNIQUE KEY `IDX_7b0580ed0bf7364a7d4d11d5b2` (`accessToken`),
  UNIQUE KEY `IDX_8f18060284824a8516b6bc325f` (`staffId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------
-- Table structure for user_group_map
-- ----------------------------
DROP TABLE IF EXISTS `user_group_map`;
CREATE TABLE `user_group_map` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(255) NOT NULL,
  `groupId` varchar(255) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_0ea202166b387dac9de91b1b68` (`userId`,`groupId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

SET FOREIGN_KEY_CHECKS = 1;
