-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 05-05-2025 a las 17:01:18
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `switchstyle`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoría`
--

CREATE TABLE `categoría` (
  `ID_Categoría` int(11) NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `Descripción` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `ID_Producto` int(11) NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `Descripción` text DEFAULT NULL,
  `Precio` decimal(10,2) NOT NULL,
  `Tipo` enum('Casual','Formal') NOT NULL,
  `Imagen` varchar(255) DEFAULT NULL,
  `ID_Tienda` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto_categoría`
--

CREATE TABLE `producto_categoría` (
  `ID_Producto` int(11) NOT NULL,
  `ID_Categoría` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `suscripción`
--

CREATE TABLE `suscripción` (
  `ID_Suscripción` int(11) NOT NULL,
  `ID_Usuario` int(11) DEFAULT NULL,
  `Frecuencia` enum('Diaria','Semanal','Mensual') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tienda`
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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `ID_Usuario` int(11) NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `Correo_Electronico` varchar(100) NOT NULL,
  `Contraseña` varchar(255) NOT NULL,
  `Tipo_Usuario` enum('Free','Premium','Admin') NOT NULL,
  `Fecha_Registro` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`ID_Usuario`, `Nombre`, `Correo_Electronico`, `Contraseña`, `Tipo_Usuario`, `Fecha_Registro`) VALUES
(1, 'Tomas Vazquez Brouver', 'tomas.vazquez@davinci.edu.ar', '12345', 'Admin', '2025-05-05 10:39:04'),
(2, 'Carolina Belen Ho ', 'maria.lopez@example.com', '67890', 'Admin', '2025-05-05 10:39:04'),
(3, 'Joaquin Cardozo', 'carlos.garcia@example.com', 'abcde', 'Admin', '2025-05-05 10:39:04');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `valoración`
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
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categoría`
--
ALTER TABLE `categoría`
  ADD PRIMARY KEY (`ID_Categoría`);

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`ID_Producto`),
  ADD KEY `ID_Tienda` (`ID_Tienda`);

--
-- Indices de la tabla `producto_categoría`
--
ALTER TABLE `producto_categoría`
  ADD PRIMARY KEY (`ID_Producto`,`ID_Categoría`),
  ADD KEY `ID_Categoría` (`ID_Categoría`);

--
-- Indices de la tabla `suscripción`
--
ALTER TABLE `suscripción`
  ADD PRIMARY KEY (`ID_Suscripción`),
  ADD KEY `ID_Usuario` (`ID_Usuario`);

--
-- Indices de la tabla `tienda`
--
ALTER TABLE `tienda`
  ADD PRIMARY KEY (`ID_Tienda`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`ID_Usuario`),
  ADD UNIQUE KEY `Correo_Electronico` (`Correo_Electronico`);

--
-- Indices de la tabla `valoración`
--
ALTER TABLE `valoración`
  ADD PRIMARY KEY (`ID_Valoración`),
  ADD KEY `ID_Usuario` (`ID_Usuario`),
  ADD KEY `ID_Producto` (`ID_Producto`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categoría`
--
ALTER TABLE `categoría`
  MODIFY `ID_Categoría` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `ID_Producto` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `suscripción`
--
ALTER TABLE `suscripción`
  MODIFY `ID_Suscripción` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tienda`
--
ALTER TABLE `tienda`
  MODIFY `ID_Tienda` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `ID_Usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `valoración`
--
ALTER TABLE `valoración`
  MODIFY `ID_Valoración` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `producto`
--
ALTER TABLE `producto`
  ADD CONSTRAINT `producto_ibfk_1` FOREIGN KEY (`ID_Tienda`) REFERENCES `tienda` (`ID_Tienda`);

--
-- Filtros para la tabla `producto_categoría`
--
ALTER TABLE `producto_categoría`
  ADD CONSTRAINT `producto_categoría_ibfk_1` FOREIGN KEY (`ID_Producto`) REFERENCES `producto` (`ID_Producto`),
  ADD CONSTRAINT `producto_categoría_ibfk_2` FOREIGN KEY (`ID_Categoría`) REFERENCES `categoría` (`ID_Categoría`);

--
-- Filtros para la tabla `suscripción`
--
ALTER TABLE `suscripción`
  ADD CONSTRAINT `suscripción_ibfk_1` FOREIGN KEY (`ID_Usuario`) REFERENCES `usuario` (`ID_Usuario`);

--
-- Filtros para la tabla `valoración`
--
ALTER TABLE `valoración`
  ADD CONSTRAINT `valoración_ibfk_1` FOREIGN KEY (`ID_Usuario`) REFERENCES `usuario` (`ID_Usuario`),
  ADD CONSTRAINT `valoración_ibfk_2` FOREIGN KEY (`ID_Producto`) REFERENCES `producto` (`ID_Producto`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
