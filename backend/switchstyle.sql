-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 16, 2025 at 04:25 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `switchstyle`
--

-- --------------------------------------------------------

--
-- Table structure for table `accesorios`
--

CREATE TABLE `accesorios` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `precio` decimal(8,2) NOT NULL,
  `ruta_imagen` varchar(255) DEFAULT NULL,
  `categoria_id` bigint(20) UNSIGNED NOT NULL,
  `ID_Usuario` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `accesorios`
--

INSERT INTO `accesorios` (`id`, `titulo`, `descripcion`, `precio`, `ruta_imagen`, `categoria_id`, `ID_Usuario`, `created_at`, `updated_at`) VALUES
(3, 'Aros Galax de bronce', '.', 126500.00, 'accesorios/UYb3Yob31kpslIYb8S7mYqID8Yj6iX35kUov1Bel.jpg', 12, 12, '2025-06-16 05:02:44', '2025-06-16 05:06:47'),
(4, 'Colgante Estrella con cadena irregular doble', 'Cadena hecha a mano de 90 cm , en bronce con baño de oro .', 230300.00, 'accesorios/Lf5LkQYA90psj6lxBVitTi0T05Wk4K5EKSV4CGAp.jpg', 10, 12, '2025-06-16 05:07:22', '2025-06-16 05:07:22'),
(5, 'Colgante Cora', 'Dije con cadena , bañada en oro', 66100.00, 'accesorios/AYg9yHNLoPieXlHkFsZ9gdh7EbapODN42J7gxk56.jpg', 10, 12, '2025-06-16 05:19:20', '2025-06-16 05:19:20'),
(6, 'Colgante Océano Bronce', 'Hecho a mano en bronce , colgante regulable 40/43 cm.', 410000.00, 'accesorios/U1CCbfIEBuAzT9wmHqOkLkVWcf8Ild2CITBWrKw9.jpg', 10, 12, '2025-06-16 05:20:00', '2025-06-16 05:20:00'),
(7, 'Aro Argollita Osito Yummy (unidad)', 'Plata 925. Incluye argollita cierre piercing de 16mm. X unidad', 7700.00, 'accesorios/JXLw8d0ASZVRFkvxDzvDdQZGuzSnSBwagbinGJsR.png', 12, 6, '2025-06-16 05:21:26', '2025-06-16 05:21:26'),
(8, 'Pulseras latido corazón multicolor', 'Plata 925. Tamaño regulable. El precio equivale a una pulsera.', 25500.00, 'accesorios/3IlHw6DbxhDQ0PuFehA87H95sJpXaAfHadis4YdL.png', 10, 6, '2025-06-16 05:21:51', '2025-06-16 05:21:51'),
(9, 'Aro argollita rayo doble (unidad)', 'Plata 925', 15400.00, 'accesorios/tRq0m2daim4r5vku8O6vvO1N5JvlhDk4XBdTKAKW.png', 12, 6, '2025-06-16 05:22:26', '2025-06-16 05:22:26'),
(10, 'Aro Argollita corazón zirconias (unidad)', 'Plata 925. Cierre click.', 18700.00, 'accesorios/xNf0aQ0FUT8J6SbYacTvqq5JsTZ59G8UdP5lq9f8.png', 12, 6, '2025-06-16 05:22:51', '2025-06-16 05:22:51'),
(11, 'Pieza 07 - Anillo', 'Anillo de bronce bañado en plata y bronce bañado en oro. \r\n\r\nTalle único: diametro interno del anillo: 1,8 cm', 50925.00, 'accesorios/pO7ddBNL5u8eneZaHxSAoEr1zmUkpbw6nH5n4eFi.jpg', 11, 10, '2025-06-16 05:24:40', '2025-06-16 05:24:40'),
(12, 'Pieza 06 - Anillo', 'Anillo de bronce bañado en plata y bronce bañado en oro. \r\n\r\nTalle 1: diametro interno del anillo: 1,6 cm', 50925.00, 'accesorios/dH6kRvDvQ2FMZjNHyQKywSL6GCu9PyJp99pK1mvi.jpg', 11, 10, '2025-06-16 05:25:01', '2025-06-16 05:25:01');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categorias`
--

CREATE TABLE `categorias` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categorias`
--

INSERT INTO `categorias` (`id`, `nombre`, `created_at`, `updated_at`) VALUES
(1, 'Remeras', NULL, NULL),
(2, 'Camisas', NULL, NULL),
(3, 'Camperas', NULL, NULL),
(4, 'Shorts', NULL, NULL),
(5, 'Pantalónes', NULL, NULL),
(6, 'Faldas', NULL, NULL),
(7, 'Vestidos', NULL, NULL),
(8, 'Botas', NULL, NULL),
(9, 'Zapatillas', NULL, NULL),
(10, 'Collares', NULL, NULL),
(11, 'Anillos', NULL, NULL),
(12, 'Aritos', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `generos`
--

CREATE TABLE `generos` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `generos`
--

INSERT INTO `generos` (`id`, `nombre`, `created_at`, `updated_at`) VALUES
(1, 'Hombre', NULL, NULL),
(2, 'Mujer', NULL, NULL),
(3, 'Chicos', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `imagenes`
--

CREATE TABLE `imagenes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `ropa_id` bigint(20) UNSIGNED NOT NULL,
  `ruta` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `imagenes`
--

INSERT INTO `imagenes` (`id`, `ropa_id`, `ruta`, `created_at`, `updated_at`) VALUES
(1, 3, 'ropa/woH32WhMDiJOxCGcEusRA2u8fcJxXTvB9pJ8sWTn.png', '2025-06-16 02:55:50', '2025-06-16 02:55:50'),
(2, 3, 'ropa/6GKTXFL1YKeJpD1nBTW7FF4GEuTVOMqLqI1kT2g0.png', '2025-06-16 02:55:50', '2025-06-16 02:55:50'),
(3, 3, 'ropa/XFgNd9YvkoRKglXC96xaJHPgrQjYDheKwpiF8UZG.png', '2025-06-16 02:55:50', '2025-06-16 02:55:50'),
(4, 3, 'ropa/Ze6CdWMGYl0wmXZZIDWUzF6YRmuzYqWNrZoVsApt.png', '2025-06-16 02:55:50', '2025-06-16 02:55:50'),
(5, 3, 'ropa/Refk0P9LtkPF1f5ejCS9RjZgmkY8w8LX6Pb296rd.png', '2025-06-16 02:55:50', '2025-06-16 02:55:50'),
(6, 4, 'ropa/gklRZYktIXP71S7cnR4KCh0VnrBW1eyfzG0a1o92.png', '2025-06-16 03:28:04', '2025-06-16 03:28:04'),
(7, 5, 'ropa/kKQFY8J2GpQmMlmZQHl9KH1942cXnk7UPOwQhCVn.png', '2025-06-16 03:28:53', '2025-06-16 03:28:53'),
(8, 6, 'ropa/84J0eiOtlFarYJDURIDCVgSxY2sA2P5kk0fCJZIn.png', '2025-06-16 03:29:21', '2025-06-16 03:29:21'),
(9, 7, 'ropa/SCCG9YBeE6p45plxr7qUM1sumaRNaX1VVswJln13.png', '2025-06-16 03:30:22', '2025-06-16 03:30:22'),
(10, 8, 'ropa/cHF0JnXr3VNFUlC1QhufdpoVrCIbj2UuGiuAEcwX.png', '2025-06-16 03:31:03', '2025-06-16 03:31:03'),
(11, 9, 'ropa/WXKSVhqbJI0ODtqVSX0UR2DzKqslC8t3lfSl608p.png', '2025-06-16 03:37:12', '2025-06-16 03:37:12'),
(12, 10, 'ropa/ZZ5GUHFc6eZsRTGtz1F2QosE5ug1j9KhdV2JVlzR.png', '2025-06-16 03:37:46', '2025-06-16 03:37:46'),
(13, 11, 'ropa/I3MytYvIf6lkBp03kR7fEf4IXpqizDFLs3e1x1Qv.png', '2025-06-16 03:38:23', '2025-06-16 03:38:23'),
(14, 12, 'ropa/p4zGhWTq2YN64D73EjS1jiuUFaLsZduVkEKF3ApV.png', '2025-06-16 03:38:49', '2025-06-16 03:38:49'),
(15, 13, 'ropa/4iLqnlYt7KyThe2iqRjH3H9fX1V7b3YM8vjwwJL4.png', '2025-06-16 03:39:11', '2025-06-16 03:39:11'),
(16, 14, 'ropa/htHaubD5mp1MXDET2KmqFtJ2CUULmSggtl6EZFWI.png', '2025-06-16 03:39:41', '2025-06-16 03:39:41'),
(17, 15, 'ropa/xVr38MQ4FAllwHZv160vVdrqQUol48T6ryfnU2uI.png', '2025-06-16 03:40:22', '2025-06-16 03:40:22'),
(18, 16, 'ropa/RRYclOAPd24QirW4vUUvqJ0guVbXIXoduRkqG0UR.png', '2025-06-16 03:41:25', '2025-06-16 03:41:25'),
(19, 17, 'ropa/345QHOv2F3NuGMrnKOnfWiu7uB0kuPtFALXSYwDM.png', '2025-06-16 03:41:45', '2025-06-16 03:41:45'),
(20, 18, 'ropa/9IR9MGbFDUzNOvrOsk4FiR9PhAad5WARdVCOGLOt.png', '2025-06-16 03:42:37', '2025-06-16 03:42:37'),
(21, 19, 'ropa/h7bIAZfVk7Cau1cXURCYyXvBCzt2WHjXVEVdzj6E.png', '2025-06-16 03:43:21', '2025-06-16 03:43:21'),
(22, 20, 'ropa/k9QxPg7QBKWMzUafzpfT8HnzYXknXyLxHbVaQP4H.png', '2025-06-16 03:43:48', '2025-06-16 03:43:48'),
(23, 21, 'ropa/jENciqZHxM3evAhad0Y4C2sJ5f8N7sNEiFGXeQxx.png', '2025-06-16 03:44:19', '2025-06-16 03:44:19'),
(24, 22, 'ropa/SX3SAJsh84Ywj8jW6lJkJUKwdFpRQRIgkuW2fbXZ.png', '2025-06-16 03:44:44', '2025-06-16 03:44:44'),
(25, 23, 'ropa/HL7NIIgqfS25YrsI3ASNVpk0hBZ2TAmMZxnUL8pH.png', '2025-06-16 03:45:16', '2025-06-16 03:45:16'),
(26, 24, 'ropa/LPE85mzfWPRd1vm19JlEyny4TlrkH2h8lSkWgvBM.png', '2025-06-16 03:46:19', '2025-06-16 03:46:19'),
(27, 25, 'ropa/MCvGrwzNmV4jAphJ2eXWIW6BG8QADQrEzgcQJ8dw.png', '2025-06-16 03:46:48', '2025-06-16 03:46:48'),
(28, 26, 'ropa/wQWEq87oI2JBsb45PofJedFlh3MYTNcObvZ6U101.png', '2025-06-16 03:47:19', '2025-06-16 03:47:19'),
(29, 27, 'ropa/piPRq1ftt7atSch3uph9rnFXOJKTHRerViHdIAs3.png', '2025-06-16 03:47:50', '2025-06-16 03:47:50'),
(30, 28, 'ropa/1fBOTVhIkwmFpF52iyAaFWZ04gIb44lONDNuCFdg.png', '2025-06-16 03:48:41', '2025-06-16 03:48:41'),
(31, 29, 'ropa/mw8To6xutf9Qvfb0wDjxgK4b5Ac9C7RrgMnaCRbf.png', '2025-06-16 03:49:04', '2025-06-16 03:49:04'),
(32, 30, 'ropa/gWg64x1WtU7YFnPLV8SDhXRwJTKcoeyCfiOyMjIG.png', '2025-06-16 03:57:05', '2025-06-16 03:57:05'),
(33, 31, 'ropa/ch92rm6Bb6eoo33gyYXwIlO606LUKOJttxujmgDx.png', '2025-06-16 03:57:41', '2025-06-16 03:57:41'),
(34, 32, 'ropa/RIY7oVa9qJqpmvXYtfvyOvO471ytaQnwFcZJbgUZ.png', '2025-06-16 03:58:09', '2025-06-16 03:58:09'),
(35, 33, 'ropa/jHEDnHoKnWZGnWEQHBNngfX2NXL1tagErtJn43Wk.png', '2025-06-16 03:58:49', '2025-06-16 03:58:49'),
(36, 34, 'ropa/bD08OoSsYAUec6yUJC6BgVmmpiQr6HYRrfymQyLd.png', '2025-06-16 04:00:06', '2025-06-16 04:00:06');

-- --------------------------------------------------------

--
-- Table structure for table `imagenes_accesorios`
--

CREATE TABLE `imagenes_accesorios` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `ruta` varchar(255) NOT NULL,
  `accesorio_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `imagenes_accesorios`
--

INSERT INTO `imagenes_accesorios` (`id`, `ruta`, `accesorio_id`, `created_at`, `updated_at`) VALUES
(1, 'accesorios/5U6v9n7f4w4o9owilk4aylIkDw0KH2eDxKwe5NNw.jpg', 3, '2025-06-16 05:02:44', '2025-06-16 05:02:44'),
(2, 'accesorios/UYb3Yob31kpslIYb8S7mYqID8Yj6iX35kUov1Bel.jpg', 3, '2025-06-16 05:02:44', '2025-06-16 05:02:44'),
(3, 'accesorios/Lf5LkQYA90psj6lxBVitTi0T05Wk4K5EKSV4CGAp.jpg', 4, '2025-06-16 05:07:22', '2025-06-16 05:07:22'),
(4, 'accesorios/PPM7AXjBFvVpy1iLCOHqPvxQLnXfFaD78Ta4KfWX.jpg', 4, '2025-06-16 05:07:22', '2025-06-16 05:07:22'),
(5, 'accesorios/AYg9yHNLoPieXlHkFsZ9gdh7EbapODN42J7gxk56.jpg', 5, '2025-06-16 05:19:20', '2025-06-16 05:19:20'),
(6, 'accesorios/x2yYeV28cEDlkT0eD486CzUkATbWkXgCjSeKpsfH.jpg', 5, '2025-06-16 05:19:20', '2025-06-16 05:19:20'),
(7, 'accesorios/U1CCbfIEBuAzT9wmHqOkLkVWcf8Ild2CITBWrKw9.jpg', 6, '2025-06-16 05:20:00', '2025-06-16 05:20:00'),
(8, 'accesorios/qqv8lLo0DLqc1C7I1DVmLQvPMcgklS9mOiRt9EI5.jpg', 6, '2025-06-16 05:20:00', '2025-06-16 05:20:00'),
(9, 'accesorios/JXLw8d0ASZVRFkvxDzvDdQZGuzSnSBwagbinGJsR.png', 7, '2025-06-16 05:21:26', '2025-06-16 05:21:26'),
(10, 'accesorios/3IlHw6DbxhDQ0PuFehA87H95sJpXaAfHadis4YdL.png', 8, '2025-06-16 05:21:51', '2025-06-16 05:21:51'),
(11, 'accesorios/tRq0m2daim4r5vku8O6vvO1N5JvlhDk4XBdTKAKW.png', 9, '2025-06-16 05:22:26', '2025-06-16 05:22:26'),
(12, 'accesorios/xNf0aQ0FUT8J6SbYacTvqq5JsTZ59G8UdP5lq9f8.png', 10, '2025-06-16 05:22:51', '2025-06-16 05:22:51'),
(13, 'accesorios/pO7ddBNL5u8eneZaHxSAoEr1zmUkpbw6nH5n4eFi.jpg', 11, '2025-06-16 05:24:40', '2025-06-16 05:24:40'),
(14, 'accesorios/dH6kRvDvQ2FMZjNHyQKywSL6GCu9PyJp99pK1mvi.jpg', 12, '2025-06-16 05:25:01', '2025-06-16 05:25:01');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_05_20_003125_create_personal_access_tokens_table', 1),
(5, '2025_06_07_220100_create_ropas_table', 1),
(6, '2025_06_15_203755_create_imagenes_table', 1),
(7, '2025_06_15_210225_create_categorias_table', 1),
(8, '2025_06_15_210229_create_tallas_table', 1),
(9, '2025_06_15_210233_create_generos_table', 1),
(10, '2025_06_15_210337_update_ropas_add_foreign_keys', 1),
(11, '2025_06_15_214255_create_ropa_talla_table', 2),
(12, '2025_06_15_220122_remove_talla_and_cantidad_from_ropas_table', 3),
(13, '2025_06_15_221213_remove_cantidad_from_ropas_table', 4),
(14, '2025_06_16_020111_create_imagenes_accesorios_table', 5);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ropas`
--

CREATE TABLE `ropas` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `descripcion` text NOT NULL,
  `precio` decimal(8,2) NOT NULL,
  `categoria_id` bigint(20) UNSIGNED NOT NULL,
  `genero_id` bigint(20) UNSIGNED NOT NULL,
  `ID_Usuario` bigint(20) UNSIGNED NOT NULL,
  `ruta_imagen` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ropas`
--

INSERT INTO `ropas` (`id`, `titulo`, `descripcion`, `precio`, `categoria_id`, `genero_id`, `ID_Usuario`, `ruta_imagen`, `created_at`, `updated_at`) VALUES
(3, 'Men Round Neck Pure Cotton T-shirt', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 20000.00, 1, 1, 6, 'ropa/woH32WhMDiJOxCGcEusRA2u8fcJxXTvB9pJ8sWTn.png', '2025-06-16 02:55:50', '2025-06-16 03:04:10'),
(4, 'Men Round Neck Pure Cotton T-shirt', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 25000.00, 1, 1, 6, 'ropa/gklRZYktIXP71S7cnR4KCh0VnrBW1eyfzG0a1o92.png', '2025-06-16 03:28:04', '2025-06-16 03:28:04'),
(5, 'Girls Round Neck Cotton Top', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 30000.00, 7, 3, 6, 'ropa/kKQFY8J2GpQmMlmZQHl9KH1942cXnk7UPOwQhCVn.png', '2025-06-16 03:28:53', '2025-06-16 03:28:53'),
(6, 'Women Round Neck Cotton Top', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 23500.00, 1, 2, 6, 'ropa/84J0eiOtlFarYJDURIDCVgSxY2sA2P5kk0fCJZIn.png', '2025-06-16 03:29:21', '2025-06-16 03:29:21'),
(7, 'Girls Round Neck Cotton Top', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 15000.00, 1, 3, 7, 'ropa/SCCG9YBeE6p45plxr7qUM1sumaRNaX1VVswJln13.png', '2025-06-16 03:30:22', '2025-06-16 03:30:22'),
(8, 'Men Tapered Fit Flat-Front Trousers', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 45000.00, 5, 1, 7, 'ropa/cHF0JnXr3VNFUlC1QhufdpoVrCIbj2UuGiuAEcwX.png', '2025-06-16 03:31:03', '2025-06-16 03:31:03'),
(9, 'Men Round Neck Pure Cotton T-shirt', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 50000.00, 3, 1, 7, 'ropa/WXKSVhqbJI0ODtqVSX0UR2DzKqslC8t3lfSl608p.png', '2025-06-16 03:37:12', '2025-06-16 03:37:12'),
(10, 'Girls Round Neck Cotton Top', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 13500.00, 1, 3, 7, 'ropa/ZZ5GUHFc6eZsRTGtz1F2QosE5ug1j9KhdV2JVlzR.png', '2025-06-16 03:37:46', '2025-06-16 03:37:46'),
(11, 'Men Tapered Fit Flat-Front Trousers', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 65000.00, 5, 1, 7, 'ropa/I3MytYvIf6lkBp03kR7fEf4IXpqizDFLs3e1x1Qv.png', '2025-06-16 03:38:23', '2025-06-16 03:38:23'),
(12, 'Men Round Neck Pure Cotton T-shirt', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 60000.00, 1, 1, 7, 'ropa/p4zGhWTq2YN64D73EjS1jiuUFaLsZduVkEKF3ApV.png', '2025-06-16 03:38:49', '2025-06-16 03:38:49'),
(13, 'Men Round Neck Pure Cotton T-shirt', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 25000.00, 1, 1, 7, 'ropa/4iLqnlYt7KyThe2iqRjH3H9fX1V7b3YM8vjwwJL4.png', '2025-06-16 03:39:11', '2025-06-16 03:39:11'),
(14, 'Women Round Neck Cotton Top', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 25600.00, 1, 2, 7, 'ropa/htHaubD5mp1MXDET2KmqFtJ2CUULmSggtl6EZFWI.png', '2025-06-16 03:39:41', '2025-06-16 03:39:41'),
(15, 'Boy Round Neck Pure Cotton T-shirt', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 35000.00, 1, 3, 7, 'ropa/xVr38MQ4FAllwHZv160vVdrqQUol48T6ryfnU2uI.png', '2025-06-16 03:40:22', '2025-06-16 03:40:22'),
(16, 'Men Tapered Fit Flat-Front Trousers', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 50000.00, 5, 1, 9, 'ropa/RRYclOAPd24QirW4vUUvqJ0guVbXIXoduRkqG0UR.png', '2025-06-16 03:41:25', '2025-06-16 03:41:25'),
(17, 'Girls Round Neck Cotton Top', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 13650.00, 1, 3, 9, 'ropa/345QHOv2F3NuGMrnKOnfWiu7uB0kuPtFALXSYwDM.png', '2025-06-16 03:41:45', '2025-06-16 03:41:45'),
(18, 'Men Tapered Fit Flat-Front Trousers', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 45620.00, 5, 1, 10, 'ropa/9IR9MGbFDUzNOvrOsk4FiR9PhAad5WARdVCOGLOt.png', '2025-06-16 03:42:37', '2025-06-16 03:42:37'),
(19, 'Boy Round Neck Pure Cotton T-shirt', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 24520.00, 1, 3, 10, 'ropa/h7bIAZfVk7Cau1cXURCYyXvBCzt2WHjXVEVdzj6E.png', '2025-06-16 03:43:21', '2025-06-16 03:43:21'),
(20, 'Boy Round Neck Pure Cotton T-shirt', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 23000.00, 1, 3, 10, 'ropa/k9QxPg7QBKWMzUafzpfT8HnzYXknXyLxHbVaQP4H.png', '2025-06-16 03:43:48', '2025-06-16 03:43:48'),
(21, 'Boy Round Neck Pure Cotton T-shirt', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 18000.00, 1, 3, 10, 'ropa/jENciqZHxM3evAhad0Y4C2sJ5f8N7sNEiFGXeQxx.png', '2025-06-16 03:44:19', '2025-06-16 03:44:19'),
(22, 'Boy Round Neck Pure Cotton T-shirt', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 17850.00, 1, 3, 10, 'ropa/SX3SAJsh84Ywj8jW6lJkJUKwdFpRQRIgkuW2fbXZ.png', '2025-06-16 03:44:44', '2025-06-16 03:44:44'),
(23, 'Girls Round Neck Cotton Top', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 30000.00, 1, 3, 10, 'ropa/HL7NIIgqfS25YrsI3ASNVpk0hBZ2TAmMZxnUL8pH.png', '2025-06-16 03:45:16', '2025-06-16 03:45:16'),
(24, 'Women Palazzo Pants with Waist Belt', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 75000.00, 5, 2, 11, 'ropa/LPE85mzfWPRd1vm19JlEyny4TlrkH2h8lSkWgvBM.png', '2025-06-16 03:46:19', '2025-06-16 03:46:19'),
(25, 'Women Zip-Front Relaxed Fit Jacket', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 78500.00, 3, 2, 11, 'ropa/MCvGrwzNmV4jAphJ2eXWIW6BG8QADQrEzgcQJ8dw.png', '2025-06-16 03:46:48', '2025-06-16 03:46:48'),
(26, 'Women Palazzo Pants with Waist Belt', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 78940.00, 5, 2, 11, 'ropa/wQWEq87oI2JBsb45PofJedFlh3MYTNcObvZ6U101.png', '2025-06-16 03:47:19', '2025-06-16 03:47:19'),
(27, 'Women Zip-Front Relaxed Fit Jacket', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 90000.00, 3, 2, 11, 'ropa/piPRq1ftt7atSch3uph9rnFXOJKTHRerViHdIAs3.png', '2025-06-16 03:47:50', '2025-06-16 03:47:50'),
(28, 'Women Round Neck Cotton Top', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 56000.00, 1, 2, 11, 'ropa/1fBOTVhIkwmFpF52iyAaFWZ04gIb44lONDNuCFdg.png', '2025-06-16 03:48:41', '2025-06-16 03:48:41'),
(29, 'Women Zip-Front Relaxed Fit Jacket', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 98500.00, 3, 2, 11, 'ropa/mw8To6xutf9Qvfb0wDjxgK4b5Ac9C7RrgMnaCRbf.png', '2025-06-16 03:49:04', '2025-06-16 03:49:04'),
(30, 'Women Zip-Front Relaxed Fit Jacket', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 87500.00, 3, 2, 12, 'ropa/gWg64x1WtU7YFnPLV8SDhXRwJTKcoeyCfiOyMjIG.png', '2025-06-16 03:57:05', '2025-06-16 03:57:05'),
(31, 'Men Slim Fit Relaxed Denim Jacket', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 78950.00, 3, 1, 12, 'ropa/ch92rm6Bb6eoo33gyYXwIlO606LUKOJttxujmgDx.png', '2025-06-16 03:57:41', '2025-06-16 03:57:41'),
(32, 'Men Slim Fit Relaxed Denim Jacket', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 76500.00, 3, 1, 12, 'ropa/RIY7oVa9qJqpmvXYtfvyOvO471ytaQnwFcZJbgUZ.png', '2025-06-16 03:58:09', '2025-06-16 03:58:09'),
(33, 'Men Printed Plain Cotton Shirt', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 85000.00, 2, 1, 12, 'ropa/jHEDnHoKnWZGnWEQHBNngfX2NXL1tagErtJn43Wk.png', '2025-06-16 03:58:49', '2025-06-16 03:58:49'),
(34, 'Men Slim Fit Relaxed Denim Jacket', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 90000.00, 3, 1, 12, 'ropa/bD08OoSsYAUec6yUJC6BgVmmpiQr6HYRrfymQyLd.png', '2025-06-16 04:00:06', '2025-06-16 04:00:06');

-- --------------------------------------------------------

--
-- Table structure for table `ropa_talla`
--

CREATE TABLE `ropa_talla` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `ropa_id` bigint(20) UNSIGNED NOT NULL,
  `talla_id` bigint(20) UNSIGNED NOT NULL,
  `cantidad` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ropa_talla`
--

INSERT INTO `ropa_talla` (`id`, `ropa_id`, `talla_id`, `cantidad`, `created_at`, `updated_at`) VALUES
(7, 3, 2, 4, '2025-06-16 02:55:50', '2025-06-16 02:55:50'),
(8, 3, 3, 2, '2025-06-16 02:55:50', '2025-06-16 02:55:50'),
(9, 3, 4, 1, '2025-06-16 02:55:50', '2025-06-16 02:55:50'),
(10, 4, 1, 2, '2025-06-16 03:28:04', '2025-06-16 03:28:04'),
(11, 4, 3, 1, '2025-06-16 03:28:04', '2025-06-16 03:28:04'),
(12, 4, 4, 4, '2025-06-16 03:28:04', '2025-06-16 03:28:04'),
(13, 5, 1, 1, '2025-06-16 03:28:53', '2025-06-16 03:28:53'),
(14, 5, 2, 1, '2025-06-16 03:28:53', '2025-06-16 03:28:53'),
(15, 6, 2, 2, '2025-06-16 03:29:21', '2025-06-16 03:29:21'),
(16, 7, 1, 2, '2025-06-16 03:30:22', '2025-06-16 03:30:22'),
(17, 8, 1, 1, '2025-06-16 03:31:03', '2025-06-16 03:31:03'),
(18, 8, 3, 2, '2025-06-16 03:31:03', '2025-06-16 03:31:03'),
(19, 8, 4, 5, '2025-06-16 03:31:03', '2025-06-16 03:31:03'),
(20, 9, 1, 1, '2025-06-16 03:37:12', '2025-06-16 03:37:12'),
(21, 9, 2, 1, '2025-06-16 03:37:12', '2025-06-16 03:37:12'),
(22, 9, 3, 2, '2025-06-16 03:37:12', '2025-06-16 03:37:12'),
(23, 10, 1, 1, '2025-06-16 03:37:46', '2025-06-16 03:37:46'),
(24, 10, 5, 2, '2025-06-16 03:37:46', '2025-06-16 03:37:46'),
(25, 11, 2, 5, '2025-06-16 03:38:23', '2025-06-16 03:38:23'),
(26, 11, 3, 2, '2025-06-16 03:38:23', '2025-06-16 03:38:23'),
(27, 11, 5, 5, '2025-06-16 03:38:23', '2025-06-16 03:38:23'),
(28, 12, 1, 2, '2025-06-16 03:38:49', '2025-06-16 03:38:49'),
(29, 12, 3, 1, '2025-06-16 03:38:49', '2025-06-16 03:38:49'),
(30, 12, 4, 2, '2025-06-16 03:38:49', '2025-06-16 03:38:49'),
(31, 12, 5, 3, '2025-06-16 03:38:49', '2025-06-16 03:38:49'),
(32, 13, 1, 12, '2025-06-16 03:39:11', '2025-06-16 03:39:11'),
(33, 13, 2, 12, '2025-06-16 03:39:11', '2025-06-16 03:39:11'),
(34, 13, 3, 20, '2025-06-16 03:39:11', '2025-06-16 03:39:11'),
(35, 14, 1, 2, '2025-06-16 03:39:41', '2025-06-16 03:39:41'),
(36, 14, 2, 5, '2025-06-16 03:39:41', '2025-06-16 03:39:41'),
(37, 14, 4, 1, '2025-06-16 03:39:41', '2025-06-16 03:39:41'),
(38, 15, 2, 5, '2025-06-16 03:40:22', '2025-06-16 03:40:22'),
(39, 15, 3, 1, '2025-06-16 03:40:22', '2025-06-16 03:40:22'),
(40, 16, 2, 1, '2025-06-16 03:41:25', '2025-06-16 03:41:25'),
(41, 17, 1, 2, '2025-06-16 03:41:45', '2025-06-16 03:41:45'),
(42, 18, 3, 2, '2025-06-16 03:42:37', '2025-06-16 03:42:37'),
(43, 19, 1, 6, '2025-06-16 03:43:21', '2025-06-16 03:43:21'),
(44, 19, 2, 2, '2025-06-16 03:43:21', '2025-06-16 03:43:21'),
(45, 20, 1, 15, '2025-06-16 03:43:48', '2025-06-16 03:43:48'),
(46, 20, 2, 30, '2025-06-16 03:43:48', '2025-06-16 03:43:48'),
(47, 20, 3, 20, '2025-06-16 03:43:48', '2025-06-16 03:43:48'),
(48, 20, 4, 10, '2025-06-16 03:43:48', '2025-06-16 03:43:48'),
(49, 21, 1, 5, '2025-06-16 03:44:19', '2025-06-16 03:44:19'),
(50, 21, 2, 3, '2025-06-16 03:44:19', '2025-06-16 03:44:19'),
(51, 21, 3, 1, '2025-06-16 03:44:19', '2025-06-16 03:44:19'),
(52, 22, 1, 15, '2025-06-16 03:44:44', '2025-06-16 03:44:44'),
(53, 22, 2, 10, '2025-06-16 03:44:44', '2025-06-16 03:44:44'),
(54, 22, 3, 2, '2025-06-16 03:44:44', '2025-06-16 03:44:44'),
(55, 23, 1, 15, '2025-06-16 03:45:16', '2025-06-16 03:45:16'),
(56, 23, 2, 4, '2025-06-16 03:45:16', '2025-06-16 03:45:16'),
(57, 23, 3, 10, '2025-06-16 03:45:16', '2025-06-16 03:45:16'),
(58, 24, 2, 2, '2025-06-16 03:46:19', '2025-06-16 03:46:19'),
(59, 25, 4, 5, '2025-06-16 03:46:48', '2025-06-16 03:46:48'),
(60, 25, 5, 2, '2025-06-16 03:46:48', '2025-06-16 03:46:48'),
(61, 26, 4, 4, '2025-06-16 03:47:19', '2025-06-16 03:47:19'),
(62, 27, 1, 1, '2025-06-16 03:47:50', '2025-06-16 03:47:50'),
(63, 27, 2, 1, '2025-06-16 03:47:50', '2025-06-16 03:47:50'),
(64, 27, 3, 2, '2025-06-16 03:47:50', '2025-06-16 03:47:50'),
(65, 27, 4, 1, '2025-06-16 03:47:50', '2025-06-16 03:47:50'),
(66, 28, 1, 23, '2025-06-16 03:48:41', '2025-06-16 03:48:41'),
(67, 28, 2, 12, '2025-06-16 03:48:41', '2025-06-16 03:48:41'),
(68, 28, 3, 3, '2025-06-16 03:48:41', '2025-06-16 03:48:41'),
(69, 28, 4, 4, '2025-06-16 03:48:41', '2025-06-16 03:48:41'),
(70, 29, 3, 11, '2025-06-16 03:49:04', '2025-06-16 03:49:04'),
(71, 30, 2, 2, '2025-06-16 03:57:05', '2025-06-16 03:57:05'),
(72, 31, 1, 1, '2025-06-16 03:57:41', '2025-06-16 03:57:41'),
(73, 31, 2, 1, '2025-06-16 03:57:41', '2025-06-16 03:57:41'),
(74, 31, 3, 5, '2025-06-16 03:57:41', '2025-06-16 03:57:41'),
(75, 32, 2, 1, '2025-06-16 03:58:09', '2025-06-16 03:58:09'),
(76, 33, 3, 1, '2025-06-16 03:58:49', '2025-06-16 03:58:49'),
(77, 34, 4, 1, '2025-06-16 04:00:06', '2025-06-16 04:00:06');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('Rd5QZ6sw6KJfS8feeJ3RRpI5xDPzDP0rt7gDyzcG', 10, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', 'YTo1OntzOjY6Il90b2tlbiI7czo0MDoiZ1hDVFIwM3pvUHk3clFwN3N2ZzZ5Rlg4YlVUN2psQzBha0dZdTlZaiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mjg6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9pbmljaW8iO31zOjM6InVybCI7YToxOntzOjg6ImludGVuZGVkIjtzOjI4OiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvaW5pY2lvIjt9czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MTA7fQ==', 1750040703);

-- --------------------------------------------------------

--
-- Table structure for table `suscripción`
--

CREATE TABLE `suscripción` (
  `ID_Suscripción` int(11) NOT NULL,
  `ID_Usuario` int(11) DEFAULT NULL,
  `Frecuencia` enum('Diaria','Semanal','Mensual') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tallas`
--

CREATE TABLE `tallas` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tallas`
--

INSERT INTO `tallas` (`id`, `nombre`, `created_at`, `updated_at`) VALUES
(1, 'S', NULL, NULL),
(2, 'M', NULL, NULL),
(3, 'L', NULL, NULL),
(4, 'XL', NULL, NULL),
(5, 'XXL', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tienda`
--

CREATE TABLE `tienda` (
  `ID_Tienda` int(11) NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `Dirección` varchar(255) NOT NULL,
  `Horario_Apertura` time NOT NULL,
  `Horario_Cierre` time NOT NULL,
  `Teléfono` varchar(15) DEFAULT NULL,
  `Web` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tienda`
--

INSERT INTO `tienda` (`ID_Tienda`, `Nombre`, `Dirección`, `Horario_Apertura`, `Horario_Cierre`, `Teléfono`, `Web`) VALUES
(1, 'Switch Style Central', 'Av. Falsa 123', '09:00:00', '18:00:00', '0800123456', 'https://switchstyle.com');

-- --------------------------------------------------------

--
-- Table structure for table `usuario`
--

CREATE TABLE `usuario` (
  `ID_Usuario` int(11) UNSIGNED NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `Correo_Electronico` varchar(100) NOT NULL,
  `Contraseña` varchar(255) NOT NULL,
  `Tipo_Usuario` enum('Free','Premium','Admin') NOT NULL,
  `Fecha_Registro` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `usuario`
--

INSERT INTO `usuario` (`ID_Usuario`, `Nombre`, `Correo_Electronico`, `Contraseña`, `Tipo_Usuario`, `Fecha_Registro`) VALUES
(1, 'Tomas Vazquez Brouver', 'tomas.vazquez@davinci.edu.ar', '$2y$12$oar8qTWwUmSDdYJCIEj3buCwWe5YnWKppNZEeuHXLaiuFRLXVtg3m', 'Admin', '2025-05-05 10:39:04'),
(2, 'Carolina Belen Ho ', 'maria.lopez@example.com', '67890', 'Admin', '2025-05-05 10:39:04'),
(3, 'Joaquin Cardozo', 'carlos.garcia@example.com', '$2y$12$9.sRr0FI4RZg1EQv89ZuHuV6DPHRKVo/j8EOcv/KgtM2Y1eqR5zWq', 'Admin', '2025-05-05 10:39:04'),
(5, 'J', 'cj@gmail.com', '$2y$12$2I6xYI8GQF8evy8SkFiDq.MvsVviGjJooaLpVtBuZcu1Vh3S1c47y', 'Free', '2025-05-26 02:00:46'),
(6, 'Free', 'free@example.com', '$2y$12$O/GgrEOZZfbfynQONhWDJeMyfhnnXgY9cHNwLequtzeu60Ac0SoHy', 'Free', '2025-06-15 18:39:41'),
(7, 'Premium', 'premium@example.com', '$2y$12$lJOpwTSfHsFnU.MeQtklhOamSnqOyfeBQ.P40uW8tl/Sn7boJMHVe', 'Premium', '2025-06-15 18:40:07'),
(8, 'Admin', 'admin@example.com', '$2y$12$YLmrpand0ErHxsbjFXoxEOvZ.ZnREljiTj81ZdGJ1RHxj/iSFC3Ki', 'Admin', '2025-06-15 18:40:41'),
(9, 'Free2', 'free2@example.com', '$2y$12$/EFU8gxvGX9M03EhKpO5MOXCYGqomV4AgHKd4cvUcLH7gjYC9tkdm', 'Free', '2025-06-15 21:40:58'),
(10, 'Free3', 'free3@example.com', '$2y$12$SHPoQZvLlJ9WhINEIiyCpeHBuNeCZ/p9sZ.iTsQTAhWHsOEaVZ3Sq', 'Free', '2025-06-15 21:42:04'),
(11, 'Premium2', 'premium2@example.com', '$2y$12$c/s7vu2OIdreu6mq0ifZce/.0Er00Z4qfc8UN2AowoAhkO39MX7ZG', 'Premium', '2025-06-15 21:45:41'),
(12, 'Premium3', 'premium3@example.com', '$2y$12$.2YLl3y5.EnSf6GUoi/VRO1Of9oZYN/2z4o2T.4SSLvs2jeTC1ZpO', 'Premium', '2025-06-15 21:56:13');

-- --------------------------------------------------------

--
-- Table structure for table `valoración`
--

CREATE TABLE `valoración` (
  `ID_Valoración` int(11) NOT NULL,
  `Calificación` int(11) DEFAULT NULL CHECK (`Calificación` >= 1 and `Calificación` <= 5),
  `Comentario` text DEFAULT NULL,
  `ID_Usuario` int(11) DEFAULT NULL,
  `ID_Producto` int(11) DEFAULT NULL,
  `Fecha` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accesorios`
--
ALTER TABLE `accesorios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `accesorios_categoria_id_foreign` (`categoria_id`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `categorias_nombre_unique` (`nombre`);

--
-- Indexes for table `generos`
--
ALTER TABLE `generos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `generos_nombre_unique` (`nombre`);

--
-- Indexes for table `imagenes`
--
ALTER TABLE `imagenes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `imagenes_ropa_id_foreign` (`ropa_id`);

--
-- Indexes for table `imagenes_accesorios`
--
ALTER TABLE `imagenes_accesorios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `imagenes_accesorios_accesorio_id_foreign` (`accesorio_id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `ropas`
--
ALTER TABLE `ropas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ropas_categoria_id_foreign` (`categoria_id`),
  ADD KEY `ropas_genero_id_foreign` (`genero_id`);

--
-- Indexes for table `ropa_talla`
--
ALTER TABLE `ropa_talla`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ropa_talla_ropa_id_foreign` (`ropa_id`),
  ADD KEY `ropa_talla_talla_id_foreign` (`talla_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `suscripción`
--
ALTER TABLE `suscripción`
  ADD PRIMARY KEY (`ID_Suscripción`),
  ADD KEY `ID_Usuario` (`ID_Usuario`);

--
-- Indexes for table `tallas`
--
ALTER TABLE `tallas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tallas_nombre_unique` (`nombre`);

--
-- Indexes for table `tienda`
--
ALTER TABLE `tienda`
  ADD PRIMARY KEY (`ID_Tienda`);

--
-- Indexes for table `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`ID_Usuario`),
  ADD UNIQUE KEY `Correo_Electronico` (`Correo_Electronico`);

--
-- Indexes for table `valoración`
--
ALTER TABLE `valoración`
  ADD PRIMARY KEY (`ID_Valoración`),
  ADD KEY `ID_Usuario` (`ID_Usuario`),
  ADD KEY `ID_Producto` (`ID_Producto`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accesorios`
--
ALTER TABLE `accesorios`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `generos`
--
ALTER TABLE `generos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `imagenes`
--
ALTER TABLE `imagenes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `imagenes_accesorios`
--
ALTER TABLE `imagenes_accesorios`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ropas`
--
ALTER TABLE `ropas`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `ropa_talla`
--
ALTER TABLE `ropa_talla`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=78;

--
-- AUTO_INCREMENT for table `tallas`
--
ALTER TABLE `tallas`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `usuario`
--
ALTER TABLE `usuario`
  MODIFY `ID_Usuario` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `accesorios`
--
ALTER TABLE `accesorios`
  ADD CONSTRAINT `accesorios_categoria_id_foreign` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `imagenes`
--
ALTER TABLE `imagenes`
  ADD CONSTRAINT `imagenes_ropa_id_foreign` FOREIGN KEY (`ropa_id`) REFERENCES `ropas` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `imagenes_accesorios`
--
ALTER TABLE `imagenes_accesorios`
  ADD CONSTRAINT `imagenes_accesorios_accesorio_id_foreign` FOREIGN KEY (`accesorio_id`) REFERENCES `accesorios` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `ropas`
--
ALTER TABLE `ropas`
  ADD CONSTRAINT `ropas_categoria_id_foreign` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `ropas_genero_id_foreign` FOREIGN KEY (`genero_id`) REFERENCES `generos` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `ropa_talla`
--
ALTER TABLE `ropa_talla`
  ADD CONSTRAINT `ropa_talla_ropa_id_foreign` FOREIGN KEY (`ropa_id`) REFERENCES `ropas` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `ropa_talla_talla_id_foreign` FOREIGN KEY (`talla_id`) REFERENCES `tallas` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
