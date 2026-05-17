<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>McBank - Login</title>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="../css/auth.css">

</head>
<body>
    <div class="card">
        <div class="card-header">
            <h2>McBank <span>App</span></h2>
            <p>Welcome back! Please log in.</p>
        </div>

        <div class="input-group">
            <label>Email Address</label>
            <div class="input-wrapper">
                <input type="email" id="email" autocomplete="off" placeholder="john@example.com" required>
                <i class="fa-regular fa-envelope"></i>
            </div>
        </div>

        <div class="input-group">
            <label>Password</label>
            <div class="input-wrapper">
                <input type="password" id="password" autocomplete="new-password" placeholder="••••••••" required>
                <i class="fa-solid fa-lock"></i>
            </div>
        </div>

        <button class="btn" onclick="loginAppUser()">Log In</button>
        <a href="RegistrationPage.php" class="link">New here? Create an account <i class="fa-solid fa-arrow-right"></i></a>
    </div>
    <script src="../scripts/Service.js"></script>
</body>
</html>