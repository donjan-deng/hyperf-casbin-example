/*
Navicat MySQL Data Transfer

Source Server         : swoole_mysql8
Source Server Version : 80019
Source Host           : 192.168.137.100:3306
Source Database       : casbin_example

Target Server Type    : MYSQL
Target Server Version : 80019
File Encoding         : 65001

Date: 2021-09-02 15:38:44
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for casbin_rule
-- ----------------------------
DROP TABLE IF EXISTS `casbin_rule`;
CREATE TABLE `casbin_rule` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `ptype` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `v0` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `v1` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `v2` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `v3` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `v4` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `v5` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of casbin_rule
-- ----------------------------
INSERT INTO `casbin_rule` VALUES ('22', 'g', 'user1', '管理员', null, null, null, null);
INSERT INTO `casbin_rule` VALUES ('29', 'p', '管理员', '/admin', 'GET', null, null, null);
INSERT INTO `casbin_rule` VALUES ('30', 'p', '管理员', '/admin/users', 'GET', null, null, null);
INSERT INTO `casbin_rule` VALUES ('31', 'p', '管理员', '/admin/users', 'POST', null, null, null);
INSERT INTO `casbin_rule` VALUES ('32', 'p', '管理员', '/admin/users/:id', 'PUT', null, null, null);
INSERT INTO `casbin_rule` VALUES ('33', 'p', '管理员', '/admin/users/:id/roles', 'PUT', null, null, null);
INSERT INTO `casbin_rule` VALUES ('34', 'p', '管理员', '/admin/roles', 'GET', null, null, null);
INSERT INTO `casbin_rule` VALUES ('35', 'p', '管理员', '/admin/roles', 'POST', null, null, null);
INSERT INTO `casbin_rule` VALUES ('36', 'p', '管理员', '/admin/roles/:id', 'PUT', null, null, null);
INSERT INTO `casbin_rule` VALUES ('37', 'p', '管理员', '/admin/permissions', 'GET', null, null, null);
INSERT INTO `casbin_rule` VALUES ('38', 'p', '管理员', '/admin/permissions', 'POST', null, null, null);
INSERT INTO `casbin_rule` VALUES ('39', 'p', '管理员', '/admin/permissions/:id', 'PUT', null, null, null);
INSERT INTO `casbin_rule` VALUES ('40', 'p', '管理员', '/admin/permissions/:id', 'DELETE', null, null, null);

-- ----------------------------
-- Table structure for permissions
-- ----------------------------
DROP TABLE IF EXISTS `permissions`;
CREATE TABLE `permissions` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `parent_id` int NOT NULL COMMENT '上级权限',
  `is_display` tinyint(1) NOT NULL COMMENT '是否显示在菜单',
  `path` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `method` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `display_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `url` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '别名，配合前端连接',
  `validate` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '附加验证规则',
  `description` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `sort` mediumint NOT NULL COMMENT '排序',
  PRIMARY KEY (`id`),
  UNIQUE KEY `path` (`path`,`method`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of permissions
-- ----------------------------
INSERT INTO `permissions` VALUES ('1', '0', '0', '/admin', 'GET', '系统管理', '', '', '', '0');
INSERT INTO `permissions` VALUES ('2', '1', '0', '/admin/users', 'GET', '用户管理', '', '', '', '0');
INSERT INTO `permissions` VALUES ('3', '2', '0', '/admin/users', 'POST', '添加用户', '', '', '', '0');
INSERT INTO `permissions` VALUES ('4', '2', '0', '/admin/users/:id', 'PUT', '编辑用户', '', '', '', '0');
INSERT INTO `permissions` VALUES ('5', '2', '0', '/admin/users/:id/roles', 'PUT', '分配权限', '', '', '', '0');
INSERT INTO `permissions` VALUES ('6', '1', '0', '/admin/roles', 'GET', '角色管理', '', '', '', '0');
INSERT INTO `permissions` VALUES ('7', '6', '0', '/admin/roles', 'POST', '添加角色', '', '', '', '0');
INSERT INTO `permissions` VALUES ('8', '6', '0', '/admin/roles/:id', 'PUT', '编辑角色', '', '', '', '0');
INSERT INTO `permissions` VALUES ('29', '1', '0', '/admin/permissions', 'GET', '节点管理', '', '', '', '0');
INSERT INTO `permissions` VALUES ('30', '29', '0', '/admin/permissions', 'POST', '添加节点', '', '', '', '0');
INSERT INTO `permissions` VALUES ('31', '29', '0', '/admin/permissions/:id', 'PUT', '编辑节点', '', '', '', '0');
INSERT INTO `permissions` VALUES ('32', '29', '0', '/admin/permissions/:id', 'DELETE', '删除节点', '', '', '', '0');

-- ----------------------------
-- Table structure for roles
-- ----------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `description` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_roles_name_unique` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of roles
-- ----------------------------
INSERT INTO `roles` VALUES ('5', '管理员', '');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES ('1', 'admin', '$2y$10$GwbISobPV8wmcyAVBHvaeeFpBK3kuk/WHo2dyzbVI2CfxaBmAcnT2', '1', '2021-08-27 09:50:00', '2021-08-27 09:50:00');
INSERT INTO `users` VALUES ('9', 'user1', '$2y$10$w8ClSFglq7WANKtkD7A/9u26PM6B4eb3ml6nxqt88.5ej10yBtUPO', '1', '2021-09-02 13:23:35', '2021-09-02 14:14:36');
INSERT INTO `users` VALUES ('10', 'user2', '$2y$10$.NUkKyvkVfAkv7gr3yilre5ch2WBy7G0tpHxebfz42F2neCtFCaJO', '1', '2021-09-02 14:05:45', '2021-09-02 14:05:45');
