<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="main.css">
</head>
<body>
    <div class="box">
        <h1>Sign In Page</h1>
        <form action="index.php" method="post">
            
            <label>Username: </label>
            <br>
            <input type="text" name="username">
            <br>
            <label>Password: </label>
            <br>
            <input type="password" name="password">
            <br>
            <input type="submit" name="submit" value="Submit">
        </form>
    </div>
    

    <script src="main.js"></script>
</body>

</html>
<?php
    if(isset($_POST["submit"])){
        $username = $_POST["username"];
        $password = $_POST["password"];
        echo "My name is {$username}<br>";
        echo "My password is {$password}";
    }

?>