-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 16, 2025 at 02:06 AM
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
(5, 3, 'ropa/Refk0P9LtkPF1f5ejCS9RjZgmkY8w8LX6Pb296rd.png', '2025-06-16 02:55:50', '2025-06-16 02:55:50');

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
(13, '2025_06_15_221213_remove_cantidad_from_ropas_table', 4);

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
(3, 'Men Round Neck Pure Cotton T-shirt', 'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.', 20000.00, 1, 1, 6, 'ropa/woH32WhMDiJOxCGcEusRA2u8fcJxXTvB9pJ8sWTn.png', '2025-06-16 02:55:50', '2025-06-16 03:04:10');

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
(9, 3, 4, 1, '2025-06-16 02:55:50', '2025-06-16 02:55:50');

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
('aDieSldjA8pFCzrkH6rS3haR8VpW3FP8AA8L8P0p', 6, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', 'YTo1OntzOjY6Il90b2tlbiI7czo0MDoiY0hMbWJIU0czaW13dHdYcG8zdThzOU8wbEpqbGFzazdLYnN3MVcyQSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NjI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9yb3Bhcz9idXNxdWVkYT0mY2F0ZWdvcmlhX2lkPSZnZW5lcm9faWQ9Ijt9czozOiJ1cmwiO2E6MTp7czo4OiJpbnRlbmRlZCI7czoyODoiaHR0cDovLzEyNy4wLjAuMTo4MDAwL2luaWNpbyI7fXM6NTA6ImxvZ2luX3dlYl81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkIjtpOjY7fQ==', 1750032380);

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
(8, 'Admin', 'admin@example.com', '$2y$12$YLmrpand0ErHxsbjFXoxEOvZ.ZnREljiTj81ZdGJ1RHxj/iSFC3Ki', 'Admin', '2025-06-15 18:40:41');

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
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ropas`
--
ALTER TABLE `ropas`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `ropa_talla`
--
ALTER TABLE `ropa_talla`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `tallas`
--
ALTER TABLE `tallas`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `usuario`
--
ALTER TABLE `usuario`
  MODIFY `ID_Usuario` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `imagenes`
--
ALTER TABLE `imagenes`
  ADD CONSTRAINT `imagenes_ropa_id_foreign` FOREIGN KEY (`ropa_id`) REFERENCES `ropas` (`id`) ON DELETE CASCADE;

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
