<?php
    include(__DIR__."/../php/database.php");
    include("driverHeader.html");
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Awesome 5 font -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

    <!-- Pie chart -->
    <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
    <title>Document</title>
</head>
<body>
    <!-- <script src="../js/driverHeader.js"></script> -->
    <form action="driverDash.php" method="post">
        Username: <input type="text" name="username">
        <br>
        <input type="submit" name="login" value="login">
    </form>
    <?php
        if(isset($_POST['login'])){
            $username = filter_input(INPUT_POST, 'username', FILTER_SANITIZE_SPECIAL_CHARS);
            echo "<h1>Hi ".$username."</h1>";
        }
    ?>
    <div id="rideChart">
    </div>
    
    <script>
        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {
        const data = google.visualization.arrayToDataTable([
        ['Month', 'Percentage'],
        ['This month',10],
        ['Last month',30-10]
        ]);

        const options = {
        title:'Rides vs last month'
        };

        const chart = new google.visualization.PieChart(document.getElementById('rideChart'));
        chart.draw(data, options);
        }
    </script>

</body>
</html>