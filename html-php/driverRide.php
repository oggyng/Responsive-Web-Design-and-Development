<?php
    include('driverHeader.html');
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
    <div class="pageContainer">      
        <h1>My Rides</h1>
        <div class="contentContainer">
            <form action="driverRide.php" method="post">
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
                    $today = date_create();
                    date_time_set($today,0,0,0);
                    $todayDay = date_format($today,'D');
                    // Make todayDay to numeric to add on to sumDate Output: +xxDay
                    echo date_format($today,'Y/m/d');
                    
                    if($todayDay == ''){
                       $sumDate =  
                    }
                    $monday = date_modify($today,"");
                    
                    $query = "
                    SELECT * FROM ride WHERE driverID={$_SESSION['userID']};
                    ";
                    for($i=0;$i<10;$i++){
                        // echo '<i class="fa fa-train" aria-hidden="true"></i>';
                    }
                ?>
            </div>
        </div>
    </div>
</body>
</html>