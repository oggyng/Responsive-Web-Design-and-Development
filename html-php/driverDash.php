<?php
    include("database.php");
    include("driverHeader.html");
    session_start();
    $_SESSION["userID"] = "TP000001";
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
    <div class="pageContainer">
        <h1>Dashboard</h1>
        <div class="contentContainer">
            <h2>Statistic</h2>
            <div id="rideChart">
                
            </div>

            <div id="co2Chart">
            </div>
                
            <div id="badgeChart">
            </div>
        </div>
            
        <div class="contentContainer">
            <h2>Upcoming rides</h2>
            <?php
                $queryRide = "SELECT r.rideID, r.departureDate, r.arrivalLeavingTime, r.direction, s.stationName, COUNT(b.bookingID) AS bookedSeats, d.maxSeat,
                                TIMESTAMPDIFF(MINUTE, NOW(), TIMESTAMP(r.departureDate, r.arrivalLeavingTime)) AS minutesUntil
                                FROM ride r
                                JOIN station s ON s.stationID = r.stationID
                                JOIN driver d ON d.userID = r.driverID
                                LEFT JOIN booking b ON b.rideID = r.rideID AND b.status = 'Confirmed'
                                WHERE r.driverID = '{$_SESSION["userID"]}'
                                AND TIMESTAMPDIFF(MINUTE, NOW(),TIMESTAMP(r.departureDate, r.arrivalLeavingTime)) >= 0
                                GROUP BY r.rideID
                                ORDER BY minutesUntil ASC
                                LIMIT 1;
                            ";
                $resultRide = mysqli_query($conn,$queryRide);
                if(mysqli_num_rows($resultRide)>0){
                    $row = mysqli_fetch_assoc($resultRide);
                    echo 
                    "<div class='contentContainer'>
                        <div class='boxToLeft'>
                            Date<br>
                            Time<br>
                            Direction<br>
                            Station<br>
                            Seats
                        </div>
                        <div class='boxToRight'>
                            {$row["departureDate"]}
                            {$row["arrivalLeavingTime"]}
                            {$row["direction"]}
                            {$row["stationName"]}
                            {$row["bookedSeats"]}/{$row["maxSeat"]}
                        </div>
                    </div>";
                }
                else{
                    echo "No upcoming rides";
                }
            ?>
        </div>

        <div class="contentContainer">
            <h2>Latest notifications</h2>
            <?php 
                $queryNoti = "SELECT topic, description, DATE(publishedDate) AS publishedDate FROM notification 
                                WHERE userID = '{$_SESSION['userID']}' 
                                OR target = 'All' 
                                OR target = 'Driver'
                                ORDER BY publishedDate DESC;
                                ";
                $resultNoti = mysqli_query($conn, $queryNoti);
                if(mysqli_num_rows($resultNoti)>0){
                    $i = 3;
                    while($i>0 && $row = mysqli_fetch_assoc($resultNoti)){
                        echo 
                        "<div class='notiContainer'>
                            <div class='boxToLeft'>
                                <h4>{$row['topic']}</h4>
                                {$row['description']}
                            </div>
                            <div class='boxToRight'>
                                {$row['publishedDate']}
                            </div>    
                        </div>";
                        $i--;
                    }
                }
                else{
                    echo "No notifications";
                }
            ?>
        </div>
        
        <div class="contentContainer">
            <h2>On-going challenge</h2>
            <?php
                $queryChallenge = "SELECT * FROM challenge, challenger 
                                    WHERE challenge.challengeID=challenger.challengeID 
                                    AND challenger.userID = '{$_SESSION['userID']}' 
                                    AND NOW() BETWEEN challenge.startDate AND challenge.endDate
                                    LIMIT 1;
                                    ";
                $queryTotalTarget = "SELECT ROUND(COALESCE(SUM(s.distance * st.co2KgPerKm)),2) AS total 
                                        FROM challenge c, ride r, booking b, station s, setting st 
                                        WHERE b.rideID=r.rideID
                                        AND s.stationID=r.stationID 
                                        AND TIMESTAMP(r.departureDate, r.arrivalLeavingTime) BETWEEN c.startDate AND c.endDate 
                                        AND b.status = 'Confirmed' 
                                        AND st.settingID = 'SET01' 
                                        AND NOW() BETWEEN c.startDate AND c.endDate;";
                $resultTarget = mysqli_query($conn, $queryTotalTarget);
                $resultChallenge = mysqli_query($conn, $queryChallenge);
                if(mysqli_num_rows($resultTarget)>0){
                    $total = mysqli_fetch_assoc($resultTarget)['total'];
                }
                else{
                    $total = 0;
                }

                if(mysqli_num_rows($resultChallenge)>0){
                    $row = mysqli_fetch_assoc($resultChallenge);
                    echo 
                    "<h4>{$row['name']}</h4>
                    {$row['description']}<br>
                    Total CO2 saved<br>
                    <progress value='{$total}' max='{$row['target']}'></progress>";
                }
                else{
                    echo "You are not in a challenge yet, join a challenge now?<br><a href='challenge.php' class='linkBtn'>Yes</a>";
                }
            ?>
        </div>
    </div>

</body>
</html>

<?php 
    mysqli_close($conn);
?>