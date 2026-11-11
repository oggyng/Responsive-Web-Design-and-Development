<?php
    $conn = mysqli_connect("localhost","root","","cpu_carpool");
    if(!$conn){
        die("Failed to connect: ".mysqli_connect_error());
    }
    else{
        echo "<script>console.log('Database connected successfully!')</script>";
    }
?>