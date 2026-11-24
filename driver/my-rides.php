<?php
    session_start();
    // test page
    $requiredRole = 'Driver';
    $pageTitle    = 'My rides';
    $activePage   = 'rides';
    $unreadCount  = 3;                 // test only. Later: count from the database

    include '../includes/head.php';
    include '../includes/header.php';
?>

<main>
    <div class="pageContainer">      
        <h1>My Rides</h1>
        <div class="contentContainer">
            <form action="" method="post">
                <h2>Add ride slot</h2>
                <label class="inputLabel" for="selectDay">Select Day</label>
                <br>
                <select name="selectDay" id="selectDay" required>
                    <option value="" disabled selected hidden>Select a date</option>
                    <script>
                        const today = new Date();
                        const nextMonday = today.getDate() + (8-today.getDay());
                        const days = ['Mon','Tue','Wed','Thu','Fri'];
                        for(let i=0;i<5;i++){
                            today.setDate(nextMonday+i);
                            document.write(`<option value='d${i}'>${today.toISOString().split('T')[0]} ${days[i]}</option>`);
                        }
                    </script>
                </select>
                <br><br>
                <label class="inputLabel">Time</label>
                <br>
                <select name="selectTimeHr" id="selectTimeHr" required>
                    <option value="" disabled selected hidden>Select a time (hr)</option>
                    <option value="07">07</option>
                    <option value="08">08</option>
                    <option value="09">09</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                    <option value="13">13</option>
                    <option value="14">14</option>
                    <option value="15">15</option>
                    <option value="16">16</option>
                    <option value="17">17</option>
                    <option value="18">18</option>
                </select>
                :
                <select name="selectTimeMin" id="selectTimeMin" required>
                    <option value="" disabled selected hidden>Select a time (min)</option>
                    <option value=".00">00</option>
                    <option value=".15">15</option>
                    <option value=".30">30</option>
                    <option value=".45">45</option>
                </select>
                <br><br>
                <label for="selectDirection" class="inputLabel">Direction</label>
                <br>
                <select name="selectDirection" id="selectDirection" required>
                    <option value="" disabled selected hidden>Select a direction</option>
                    <option value="to">To</option>
                    <option value="from">From</option>
                </select>
                <br><br>
                <input type="submit" value="Add ride slot">
                <input type="reset" value="Reset">
            </form>
        </div>

        <div class="contentContainer">
            <h2>Rides</h2>
            <div class="boxContainer">
                <?php
                    include('../dbconn.php');

                    $nextMonday = date_create('next monday');
                    if(date('w')==0){
                        date_modify($nextMonday, '+7 days');
                    }
                    $friday = clone $nextMonday;
                    date_modify($friday, '+5 days');
                    $mon = date_format($nextMonday, 'Y-m-d');
                    $fri = date_format($friday, 'Y-m-d');
                    
                    $query = "
                    SELECT * FROM ride r, station s WHERE r.stationID=s.stationID AND r.driverID='{$_SESSION['userID']}' AND r.departureDate BETWEEN '{$mon}' AND '{$fri}';
                    ";

                    $result = mysqli_query($conn, $query);

                    if(mysqli_num_rows($result)>0){
                        while($row = mysqli_fetch_assoc($result)){
                            echo "
                            <div>
                                {$row['departureDate']} {$row['arrivalLeavingTime']}<br>
                            ";

                            if($row['direction']== 'To'){
                                echo "<i class='fa fa-train' title='{$row['stationName']}'></i> <i class='fas fa-arrow-right'></i> <i class='fas fa-building'></i>";
                            }
                            else if($row['direction']== 'From'){
                                echo  " <i class='fas fa-building'></i> <i class='fas fa-arrow-right'></i> <i class='fa fa-train' title='{$row['stationName']}'></i>";
                            }                            
                            echo "</div>";
                        }
                    }
                ?>
            </div>
        </div>
    </div>
</main>
<?php include '../includes/footer.php'; ?>