var firstNameInput = document.getElementById("firstName");
var lastNameInput = document.getElementById("lastName");

if (firstNameInput) {
    firstNameInput.addEventListener("input", function(){
        validateNameFields(this);
    });
}

if (lastNameInput) {
    lastNameInput.addEventListener("input", function(){
        validateNameFields(this);
    });
}

function validateNameFields(element){
    element.value = element.value.replace(/[^a-zA-Z\s\-']/g, "");
}

function registerAppUser() {
    var firstName = document.getElementById("firstName").value;
    var lastName = document.getElementById("lastName").value;
    var email = document.getElementById("email").value;
    var role = document.getElementById("role").value;
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmPassword").value;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        Swal.fire("Error", "All fields are required!", "error");
        return;
    }

    if (firstName.length < 2 || lastName.length < 2) {
    Swal.fire("Error", "First and last names must be at least 2 characters long!", "error");
    return;
}

    $.ajax({
        url: "../controllers/Controller.php",
        type: "POST",
        data: {
            action: "register",
            firstName: firstName,
            lastName: lastName,
            email: email,
            role: role,
            password: password,
            confirmPassword: confirmPassword
        },
        success: function(response) {
            if (response.trim() === "Success!") {
                Swal.fire({
                    title: "Welcome!",
                    text: "Registration successful. You can now log in.",
                    icon: "success"
                }).then(() => {
                    window.location.href = "../views/LoginPage.php";
                });
            } else {
                Swal.fire("Error", response, "error");
            }
        }
    });
}

function loginAppUser() {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    if (!email || !password) {
        Swal.fire("Error", "Please enter both email and password.", "error");
        return;
    }

    $.ajax({
        url: "../controllers/Controller.php",
        type: "POST",
        data: {
            action: "login",
            email: email,
            password: password
        },
        success: function(response) {
            if (response.trim() === "Success!") {
                window.location.href = "../views/DashboardPage.php";
            } else {
                Swal.fire("Login Failed", response, "error");
            }
        }
    });
}
// automatically load users when the dashboard page opens
$(document).ready(function() {
    if(window.location.pathname.includes("DashboardPage.php")) {
        loadUsers();
    }
});

function loadUsers() {
    $.ajax({
        url: "../controllers/Controller.php",
        type: "POST",
        data: { action: "getAllUsers" },
        success: function(response) {
            let users = JSON.parse(response);
            let rows = "";
            users.forEach(function(user) {
                rows += `<tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">${user.id}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">${user.firstName} ${user.lastName}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">${user.email}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">
                        <button onclick="editUser(${user.id}, '${user.firstName}', '${user.lastName}', '${user.email}')" style="background: #FFC72C; color: black; border: none; padding: 5px 10px; cursor: pointer; border-radius: 4px; font-weight: bold;">Edit</button>
                        <button onclick="deleteUser(${user.id})" style="background: #DA291C; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 4px; font-weight: bold;">Delete</button>
                    </td>
                </tr>`;
            });
            $("#userTableBody").html(rows);
            $("#totalUsersCount").text(users.length);
        }
    });
}

function deleteUser(id) {
    Swal.fire({
        title: "Delete User?",
        text: "This action cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DA291C",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: "../controllers/Controller.php",
                type: "POST",
                data: { action: "deleteUser", id: id },
                success: function(response) {
                    if (response.trim() === "User has been deleted.") {
                        Swal.fire("Deleted!", "User has been removed.", "success");
                        loadUsers(); 
                    }
                }
            });
        }
    });
}

function editUser(id, firstName, lastName, email) {
    Swal.fire({
        title: '<h2 style="color: #DA291C; margin: 0; font-weight: 800; font-family: \'Segoe UI\', sans-serif;">Edit User</h2>',
        width: '500px',
        html: `
            <div style="text-align: left; margin-top: 20px; font-family: 'Segoe UI', sans-serif;">
                
                <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                    <div style="position: relative; flex: 1;">
                        <i class="fa-regular fa-user" style="position: absolute; left: 14px; top: 14px; color: #aaa;"></i>
                        <input id="swal-edit-fname" style="width: 100%; padding: 12px 12px 12px 40px; border: 2px solid #eee; border-radius: 12px; box-sizing: border-box; font-size: 14px; background: #fafafa; outline: none;" placeholder="First Name" value="${firstName}" autocomplete="off">
                    </div>
                    <div style="position: relative; flex: 1;">
                        <i class="fa-regular fa-address-card" style="position: absolute; left: 14px; top: 14px; color: #aaa;"></i>
                        <input id="swal-edit-lname" style="width: 100%; padding: 12px 12px 12px 40px; border: 2px solid #eee; border-radius: 12px; box-sizing: border-box; font-size: 14px; background: #fafafa; outline: none;" placeholder="Last Name" value="${lastName}" autocomplete="off">
                    </div>
                </div>

                <div style="position: relative; margin-bottom: 15px;">
                    <i class="fa-regular fa-envelope" style="position: absolute; left: 14px; top: 14px; color: #aaa;"></i>
                    <input id="swal-edit-email" type="email" style="width: 100%; padding: 12px 12px 12px 40px; border: 2px solid #eee; border-radius: 12px; box-sizing: border-box; font-size: 14px; background: #fafafa; outline: none;" placeholder="Email Address" value="${email}" autocomplete="off">
                </div>

            </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Save Changes',
        confirmButtonColor: '#FFC72C',
        cancelButtonColor: '#888',
        preConfirm: () => {
            return {
                firstName: document.getElementById('swal-edit-fname').value,
                lastName: document.getElementById('swal-edit-lname').value,
                email: document.getElementById('swal-edit-email').value
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: "../controllers/Controller.php",
                type: "POST",
                data: {
                    action: "updateUser",
                    id: id,
                    firstName: result.value.firstName,
                    lastName: result.value.lastName,
                    email: result.value.email
                },
                success: function(response) {
                    if (response.trim() === "Success!") {
                        Swal.fire("Updated!", "User details saved.", "success");
                        loadUsers();
                    }
                }
            });
        }
    });
}

//add new user in dashboard
function addDashboardUser() {

     Swal.fire({
        title: '<h2 style="color: #DA291C; margin: 0; font-weight: 800; font-family: \'Segoe UI\', sans-serif;">Add New User</h2>',
        width: '500px',
        html: `
            <div style="text-align: left; margin-top: 20px; font-family: 'Segoe UI', sans-serif;">
                
                <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                    <div style="position: relative; flex: 1;">
                        <i class="fa-regular fa-user" style="position: absolute; left: 14px; top: 14px; color: #aaa;"></i>
                        <input id="swal-add-fname" style="width: 100%; padding: 12px 12px 12px 40px; border: 2px solid #eee; border-radius: 12px; box-sizing: border-box; font-size: 14px; background: #fafafa; outline: none;" placeholder="First Name" autocomplete="off">
                    </div>
                    <div style="position: relative; flex: 1;">
                        <i class="fa-regular fa-address-card" style="position: absolute; left: 14px; top: 14px; color: #aaa;"></i>
                        <input id="swal-add-lname" style="width: 100%; padding: 12px 12px 12px 40px; border: 2px solid #eee; border-radius: 12px; box-sizing: border-box; font-size: 14px; background: #fafafa; outline: none;" placeholder="Last Name" autocomplete="off">
                    </div>
                </div>

                <div style="position: relative; margin-bottom: 15px;">
                    <i class="fa-regular fa-envelope" style="position: absolute; left: 14px; top: 14px; color: #aaa;"></i>
                    <input id="swal-add-email" type="email" style="width: 100%; padding: 12px 12px 12px 40px; border: 2px solid #eee; border-radius: 12px; box-sizing: border-box; font-size: 14px; background: #fafafa; outline: none;" placeholder="Email Address" autocomplete="off">
                </div>

                <div style="position: relative; margin-bottom: 15px;">
                    <i class="fa-solid fa-building-columns" style="position: absolute; left: 14px; top: 14px; color: #aaa;"></i>
                    <select id="swal-add-role" style="width: 100%; padding: 12px 12px 12px 40px; border: 2px solid #eee; border-radius: 12px; box-sizing: border-box; font-size: 14px; background: #fafafa; outline: none; appearance: none;">
                        <option value="customer">Normal User</option>
                        <option value="admin">Admin</option>
                    </select>
                    <i class="fa-solid fa-caret-down" style="position: absolute; right: 15px; top: 14px; color: #aaa; pointer-events: none;"></i>
                </div>

                <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                    <div style="position: relative; flex: 1;">
                        <i class="fa-solid fa-lock" style="position: absolute; left: 14px; top: 14px; color: #aaa;"></i>
                        <input id="swal-add-pass" type="password" style="width: 100%; padding: 12px 12px 12px 40px; border: 2px solid #eee; border-radius: 12px; box-sizing: border-box; font-size: 14px; background: #fafafa; outline: none;" placeholder="Password" autocomplete="new-password">
                    </div>
                    <div style="position: relative; flex: 1;">
                        <i class="fa-solid fa-shield" style="position: absolute; left: 14px; top: 14px; color: #aaa;"></i>
                        <input id="swal-add-cpass" type="password" style="width: 100%; padding: 12px 12px 12px 40px; border: 2px solid #eee; border-radius: 12px; box-sizing: border-box; font-size: 14px; background: #fafafa; outline: none;" placeholder="Confirm Password" autocomplete="new-password">
                    </div>
                </div>

            </div>
        `,
        
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Add User',
        confirmButtonColor: '#DA291C',
        cancelButtonColor: '#888',
        preConfirm: () => {
            return {
                firstName: document.getElementById('swal-add-fname').value,
                lastName: document.getElementById('swal-add-lname').value,
                email: document.getElementById('swal-add-email').value,
                role: document.getElementById('swal-add-role').value, 
                password: document.getElementById('swal-add-pass').value,
                confirmPassword: document.getElementById('swal-add-cpass').value
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            let data = result.value;

            if (data.firstName.length < 2 || data.lastName.length < 2) {
                Swal.fire("Error", "First and last names must be at least 2 characters long!", "error");
                return;
            }

            $.ajax({
                url: "../controllers/Controller.php",
                type: "POST",
                data: {
                    action: "register", 
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    role: data.role,
                    password: data.password,
                    confirmPassword: data.confirmPassword
                },
                success: function(response) {
                    if (response.trim() === "Success!") {
                        Swal.fire("Added!", "New user has been created.", "success");
                        loadUsers();
                    } else {
                        Swal.fire("Error", response, "error");
                    }
                }
            });
        }
    });
}