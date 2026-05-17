<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>McBank - Register</title>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="../css/auth.css">

</head>
<body>
    <div class="card">
        <div class="card-header">
            <h2>McBank <span>App</span></h2>
            <p>Create your account</p>
        </div>
        
        <div class="form-row">
            <div class="input-group">
                <label>First Name</label>
                <div class="input-wrapper">
                    <input type="text" id="firstName" autocomplete="off" placeholder="Mc" maxlength="50" required>
                    <i class="fa-regular fa-user"></i>
                </div>
            </div>
            <div class="input-group">
                <label>Last Name</label>
                <div class="input-wrapper">
                    <input type="text" id="lastName" autocomplete="off" placeholder="Bank" maxlength="50" required>
                    <i class="fa-regular fa-address-card"></i>
                </div>
            </div>
        </div>

        <div class="input-group">
            <label>Email Address</label>
            <div class="input-wrapper">
                <input type="email" id="email" autocomplete="off" placeholder="mcbank@example.com" maxlength = "254" required>
                <i class="fa-regular fa-envelope"></i>
            </div>
        </div>
        
        <div class="input-group">
            <label>Account Type</label>
            <div class="input-wrapper select-wrapper">
                <select id="role">
                    <option value="customer">Normal User</option>
                    <option value="admin">Admin</option>
                </select>
                <i class="fa-solid fa-building-columns"></i>
            </div>
        </div>

        <div class="input-group">
            <label>Password</label>
            <div class="input-wrapper">
                <input type="password" id="password" autocomplete="new-password" placeholder="••••••••" maxlength="64" required>
                <i class="fa-solid fa-lock"></i>
            </div>
        </div>

        <div class="input-group">
            <label>Confirm Password</label>
            <div class="input-wrapper">
                <input type="password" id="confirmPassword" autocomplete="new-password" placeholder="••••••••" maxlength="64" required>
                <i class="fa-solid fa-shield-check"></i>
            </div>
        </div>    
        
        <button class="btn" onclick="registerAppUser()">Sign Up</button>
        <a href="LoginPage.php" class="link">Already have an account? Log in <i class="fa-solid fa-arrow-right"></i></a>
    </div>
    
    <script src="../scripts/Service.js"></script>
</body>
</html>