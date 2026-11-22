<?php
    session_start();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Awesome 5 font -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

    <title>Document</title>
</head>
<body>
    <?php include('driverHeader.html'); ?> 
    <div class="pageContainer">    
        <h1>Requests</h1>
        <div class="contentContainer">
            <?php 
                include('database.php');

                $query = "
                    SELECT * FROM booking b 
                    JOIN ride r ON b.rideID = r.rideID
                                AND b.status = 'Pending'
                    LEFT JOIN user u ON u.userID = b.passengerID
                    LEFT JOIN station s ON r.stationID = s.stationID
                    WHERE r.driverID = '{$_SESSION['userID']}' 
                ";

                $result = mysqli_query($conn, $query);
                if(mysqli_num_rows($result)>0){
                    while($row = mysqli_fetch_assoc($result)){

                        if($row['direction']== 'To'){
                            $direction = "<i class='fa fa-train' title='{$row['stationName']}'></i> <i class='fas fa-arrow-right'></i> <i class='fas fa-building'></i>";
                        }
                        else if($row['direction']== 'From'){
                            $direction = " <i class='fas fa-building'></i> <i class='fas fa-arrow-right'></i> <i class='fa fa-train' title='{$row['stationName']}'></i>";
                        } 

                        echo "
                            <div class='boxContainer'>
                                <form action='' method='post'>
                                    <div>
                                        <img src='uploads/{$row['profilePicturePath']}' style='border:3px solid black; width:40px; height:40px; border-radius:50%'>
                                    </div>
                                    <div>
                                        <h4>{$row['name']}</h4>
                                        {$row['departureDate']}  {$row['arrivalLeavingTime']}  {$direction}
                                    </div>
                                    <div>
                                        <input type='hidden' name='bookingID' value='{$row['bookingID']}'>   
                                        <input type='submit' name='choice' value='Accept'>
                                        <input type='submit' name='choice' value='Decline'>
                                    </div>
                                </form>
                            </div>
                        ";
                    }
                }
            ?>
            <!-- <img src='uploads/{$row['profilePicturePath']}' style='border:3px solid black; width:40px; height:40px; border-radius:50%'> -->
        </div>
    </div>
</body>
</html>