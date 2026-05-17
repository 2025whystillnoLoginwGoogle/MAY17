<?php
/**
 * ChartController.php - Handles all chart data API requests
 * Processes AJAX calls from ChartManager.js and returns JSON data
 */

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$action = isset($_POST['action']) ? $_POST['action'] : '';

try {
    switch ($action) {
        case 'getUserGrowthData':
            echo json_encode(getUserGrowthData());
            break;
        case 'getUserRoleData':
            echo json_encode(getUserRoleData());
            break;
        case 'getSpendingTrendData':
            echo json_encode(getSpendingTrendData());
            break;
        case 'getSpendingCategoryData':
            echo json_encode(getSpendingCategoryData());
            break;
        default:
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid action']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}

/**
 * Get user registration growth data (past 12 weeks)
 * Used for admin bar chart
 */
function getUserGrowthData() {
    $labels = [];
    $values = [];

    // Generate demo data for past 12 weeks
    for ($i = 11; $i >= 0; $i--) {
        $date = new DateTime();
        $date->sub(new DateInterval('P' . $i . 'W'));
        $labels[] = 'Week ' . $date->format('W');
        $values[] = rand(5, 25); // Random user registrations per week
    }

    return [
        'success' => true,
        'data' => [
            'labels' => $labels,
            'values' => $values
        ],
        'timestamp' => date('Y-m-d H:i:s')
    ];
}

/**
 * Get user role distribution data
 * Used for admin pie chart
 */
function getUserRoleData() {
    // Demo data: actual implementation would query database
    $totalAdmins = rand(2, 5);
    $totalCustomers = rand(50, 150);

    return [
        'success' => true,
        'data' => [
            'labels' => ['Admins', 'Customers'],
            'values' => [$totalAdmins, $totalCustomers]
        ],
        'timestamp' => date('Y-m-d H:i:s')
    ];
}

/**
 * Get spending trend data (past 12 months)
 * Used for customer line chart
 */
function getSpendingTrendData() {
    $labels = [];
    $values = [];

    // Generate demo data for past 12 months
    for ($i = 11; $i >= 0; $i--) {
        $date = new DateTime();
        $date->sub(new DateInterval('P' . $i . 'M'));
        $labels[] = $date->format('M Y');
        $values[] = rand(5000, 20000); // Random monthly spending in pesos
    }

    return [
        'success' => true,
        'data' => [
            'labels' => $labels,
            'values' => $values
        ],
        'timestamp' => date('Y-m-d H:i:s')
    ];
}

/**
 * Get spending by category data
 * Used for customer doughnut chart
 */
function getSpendingCategoryData() {
    $categories = ['Food & Dining', 'Bills & Utilities', 'Shopping', 'Entertainment', 'Transportation', 'Other'];
    $values = [];

    // Generate random spending per category
    foreach ($categories as $category) {
        $values[] = rand(1000, 5000); // Random amount in pesos
    }

    return [
        'success' => true,
        'data' => [
            'labels' => $categories,
            'values' => $values
        ],
        'timestamp' => date('Y-m-d H:i:s')
    ];
}
?>