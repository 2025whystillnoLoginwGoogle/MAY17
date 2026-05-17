<?php
session_start();
if (!isset($_SESSION["user_email"])) {
    header("Location: LoginPage.php");
    exit;
}

if (isset($_SESSION["user_role"])) {
    $userRole = $_SESSION["user_role"];
} else {
    $userRole = 'customer';
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>McBank - Dashboard</title>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="../css/dashboard.css">
</head>
<body>
    <div class="header">
        <h1>McBank <span><?= $userRole === 'admin' ? 'Admin' : 'App' ?></span></h1>
        <a href="Logout.php" class="logout"><i class="fa-solid fa-arrow-right-from-bracket"></i> Log Out</a>
    </div>

    <div class="container">
        <div class="welcome-text">Good <?= date('H') < 12 ? 'morning' : 'afternoon' ?>, <?= htmlspecialchars($_SESSION['user_firstName']) ?>!</div>        
        
        <?php if ($userRole === 'admin'): ?>
            <div class="admin-stats">
                <div class="stat-card">
                    <div class="stat-icon"><i class="fa-solid fa-users"></i></div>
                    <div class="stat-details">
                        <h3>Total Registered Users</h3>
                        <h2 id="totalUsersCount">0</h2>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon" style="background: rgba(255, 199, 44, 0.15); color: #e5b227;"><i class="fa-solid fa-shield-halved"></i></div>
                    <div class="stat-details">
                        <h3>Admin Status</h3>
                        <h2>Active</h2>
                    </div>
                </div>
            </div>

            <div class="charts-container">
                <div class="chart-wrapper">
                    <div class="chart-header">
                        <h3><i class="fa-solid fa-chart-line" style="color: #DA291C; margin-right: 10px;"></i> User Registration Growth</h3>
                        <span class="chart-updated" id="userChartUpdated">Last updated: just now</span>
                    </div>
                    <div class="chart-loading" id="userChartLoading">
                        <div class="spinner"></div>
                        <p>Loading chart...</p>
                    </div>
                    <canvas id="userGrowthChart" style="display: none;"></canvas>
                </div>

                <div class="chart-wrapper">
                    <div class="chart-header">
                        <h3><i class="fa-solid fa-pie-chart" style="color: #DA291C; margin-right: 10px;"></i> User Role Distribution</h3>
                        <span class="chart-updated" id="roleChartUpdated">Last updated: just now</span>
                    </div>
                    <div class="chart-loading" id="roleChartLoading">
                        <div class="spinner"></div>
                        <p>Loading chart...</p>
                    </div>
                    <canvas id="userRoleChart" style="display: none;"></canvas>
                </div>
            </div>

            <div class="card-panel">
                <div class="admin-header">
                    <h3><i class="fa-solid fa-users-gear" style="color: #DA291C; margin-right: 10px;"></i> User Management</h3>
                    <button class="add-btn" onclick="addDashboardUser()"><i class="fa-solid fa-user-plus"></i> Add User</button>
                </div>
                
                <div style="overflow-x: auto;">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="userTableBody">
                            </tbody>
                    </table>
                </div>
            </div>

        <?php else: ?>
            <div class="balance-card">
                <h3>Your Available Balance</h3>
                <h2>₱ 15,250.00</h2>
            </div>

            <div class="action-buttons">
                <div class="action-btn" onclick="Swal.fire('Deposit', 'Deposit functionality coming in the next update!', 'info')">
                    <i class="fa-solid fa-building-columns"></i>
                    <span>Deposit</span>
                </div>
                <div class="action-btn" onclick="Swal.fire('Withdraw', 'Withdraw functionality coming in the next update!', 'info')">
                    <i class="fa-solid fa-money-bill-transfer"></i>
                    <span>Withdraw</span>
                </div>
                <div class="action-btn" onclick="Swal.fire('Send Money', 'Send money coming in the next update!', 'info')">
                    <i class="fa-solid fa-paper-plane"></i>
                    <span>Send</span>
                </div>
                <div class="action-btn" onclick="Swal.fire('Receive', 'Receive money coming in the next update!', 'info')">
                    <i class="fa-solid fa-qrcode"></i>
                    <span>Receive</span>
                </div>
            </div>

            <div class="charts-container">
                <div class="chart-wrapper">
                    <div class="chart-header">
                        <h3><i class="fa-solid fa-chart-line" style="color: #DA291C; margin-right: 10px;"></i> Monthly Spending Trend</h3>
                        <span class="chart-updated" id="spendingChartUpdated">Last updated: just now</span>
                    </div>
                    <div class="chart-loading" id="spendingChartLoading">
                        <div class="spinner"></div>
                        <p>Loading chart...</p>
                    </div>
                    <canvas id="spendingTrendChart" style="display: none;"></canvas>
                </div>

                <div class="chart-wrapper">
                    <div class="chart-header">
                        <h3><i class="fa-solid fa-pie-chart" style="color: #DA291C; margin-right: 10px;"></i> Spending by Category</h3>
                        <span class="chart-updated" id="categoryChartUpdated">Last updated: just now</span>
                    </div>
                    <div class="chart-loading" id="categoryChartLoading">
                        <div class="spinner"></div>
                        <p>Loading chart...</p>
                    </div>
                    <canvas id="spendingCategoryChart" style="display: none;"></canvas>
                </div>
            </div>
            
            <div class="card-panel">
                <h3 class="activity-header"><i class="fa-solid fa-clock-rotate-left" style="color: #DA291C; margin-right: 10px;"></i> Recent Activity</h3>
                <div class="empty-state">
                    <p>No recent transactions.</p>
                </div>
            </div>
        <?php endif; ?>

        <div class="footer">
            <div class="footer-content">
                <div class="footer-brand">
                    <h3>McBank <span>App</span></h3>
                    <p><i class="fa-solid fa-location-dot"></i> UST Frassati Building</p>
                </div>
                
                <div class="footer-contact">
                    <p><i class="fa-solid fa-envelope"></i> mcbankapp@gmail.com</p>
                    <p><i class="fa-solid fa-headset"></i> mcbanksupport@gmail.com</p>
                </div>
                
                <div class="footer-socials">
                    <a href="#" title="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
                    <a href="#" title="Instagram"><i class="fa-brands fa-instagram"></i></a>
                    <a href="#" title="Twitter"><i class="fa-brands fa-twitter"></i></a>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; <?= date('Y') ?> McBank App. All rights reserved.</p>
            </div>
        </div>

    </div>
    
    <script src="../scripts/Service.js"></script>
    <script src="../scripts/ChartManager.js"></script>
</body>
</html>