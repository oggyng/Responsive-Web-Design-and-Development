<?php
$hostname = "localhost";
$username = "root";
$password = "";
$database = "cpu_carpool";

if (!$conn = mysqli_connect($hostname, $username, $password, $database)) {
    die("Connection failed: " . mysqli_connect_error());
}