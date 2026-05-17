/**
 * ChartManager.js - Manages all Chart.js instances for the dashboard
 * Handles initialization, data loading, and chart lifecycle
 */

const ChartManager = {
    charts: {},
    chartRefreshInterval: 5 * 60 * 1000, // 5 minutes
    refreshTimers: {},

    /**
     * Initialize charts based on user role (admin or customer)
     */
    init: function() {
        const isAdmin = document.getElementById('userGrowthChart') !== null;
        
        if (isAdmin) {
            this.initAdminCharts();
        } else {
            this.initCustomerCharts();
        }
    },

    /**
     * Initialize Admin Charts
     */
    initAdminCharts: function() {
        console.log('Initializing Admin Charts...');
        this.loadAndCreateChart('userGrowth', 'bar');
        this.loadAndCreateChart('userRole', 'pie');
        this.setupAutoRefresh();
    },

    /**
     * Initialize Customer Charts
     */
    initCustomerCharts: function() {
        console.log('Initializing Customer Charts...');
        this.loadAndCreateChart('spendingTrend', 'line');
        this.loadAndCreateChart('spendingCategory', 'doughnut');
        this.setupAutoRefresh();
    },

    /**
     * Load data from backend and create chart
     */
    loadAndCreateChart: function(chartType, chartFormat) {
        const loadingSelector = `#${chartType}ChartLoading`;
        const canvasSelector = `#${chartType}Chart`;
        const updatedSelector = `#${chartType}ChartUpdated`;

        $(loadingSelector).show();
        $(canvasSelector).hide();

        $.ajax({
            url: '../controllers/ChartController.php',
            type: 'POST',
            dataType: 'json',
            data: { action: `get${this.capitalize(chartType)}Data` },
            success: (response) => {
                if (response.success) {
                    this.createChart(chartType, chartFormat, response.data);
                    $(loadingSelector).hide();
                    $(canvasSelector).show();
                    $(updatedSelector).text('Last updated: just now');
                    console.log(`✓ ${chartType} chart loaded successfully`);
                } else {
                    console.error(`Error loading ${chartType}:`, response.message);
                    $(loadingSelector).html(`<p style="color: #DA291C;">Error loading chart</p>`);
                }
            },
            error: (xhr, status, error) => {
                console.error(`AJAX Error loading ${chartType}:`, error);
                $(loadingSelector).html(`<p style="color: #DA291C;">Failed to load data</p>`);
            }
        });
    },

    /**
     * Create Chart.js instance
     */
    createChart: function(chartType, chartFormat, data) {
        // Destroy existing chart if it exists
        if (this.charts[chartType]) {
            this.charts[chartType].destroy();
        }

        const canvasId = `${chartType}Chart`;
        const ctx = document.getElementById(canvasId).getContext('2d');

        const config = this.getChartConfig(chartFormat, chartType, data);
        this.charts[chartType] = new Chart(ctx, config);
    },

    /**
     * Get Chart.js configuration based on chart type
     */
    getChartConfig: function(chartFormat, chartType, data) {
        const baseConfig = {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: {
                        font: { size: 12, weight: 'bold' },
                        padding: 15,
                        boxWidth: 12
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    borderRadius: 8,
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 13 }
                }
            },
            animation: {
                duration: 750,
                easing: 'easeInOutQuart'
            }
        };

        switch (chartFormat) {
            case 'bar':
                return this.getBarChartConfig(chartType, data, baseConfig);
            case 'pie':
                return this.getPieChartConfig(chartType, data, baseConfig);
            case 'line':
                return this.getLineChartConfig(chartType, data, baseConfig);
            case 'doughnut':
                return this.getDoughnutChartConfig(chartType, data, baseConfig);
            default:
                return baseConfig;
        }
    },

    /**
     * Bar Chart Configuration - User Growth
     */
    getBarChartConfig: function(chartType, data, baseConfig) {
        return {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'New Users',
                    data: data.values,
                    backgroundColor: [
                        'rgba(218, 41, 28, 0.8)',
                        'rgba(218, 41, 28, 0.7)',
                        'rgba(218, 41, 28, 0.6)',
                        'rgba(255, 199, 44, 0.8)',
                        'rgba(255, 199, 44, 0.7)',
                        'rgba(255, 199, 44, 0.6)',
                        'rgba(218, 41, 28, 0.8)',
                        'rgba(218, 41, 28, 0.7)',
                        'rgba(218, 41, 28, 0.6)',
                        'rgba(255, 199, 44, 0.8)',
                        'rgba(255, 199, 44, 0.7)',
                        'rgba(255, 199, 44, 0.6)'
                    ],
                    borderColor: 'rgba(218, 41, 28, 1)',
                    borderWidth: 2,
                    borderRadius: 8,
                    hoverBackgroundColor: 'rgba(218, 41, 28, 1)',
                    hoverBorderWidth: 3
                }]
            },
            options: {
                ...baseConfig,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { font: { size: 11 } },
                        grid: { color: 'rgba(0, 0, 0, 0.05)' }
                    },
                    x: {
                        ticks: { font: { size: 11 } },
                        grid: { display: false }
                    }
                }
            }
        };
    },

    /**
     * Pie Chart Configuration - User Role Distribution
     */
    getPieChartConfig: function(chartType, data, baseConfig) {
        return {
            type: 'pie',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.values,
                    backgroundColor: [
                        'rgba(218, 41, 28, 0.8)',
                        'rgba(255, 199, 44, 0.8)'
                    ],
                    borderColor: [
                        'rgba(218, 41, 28, 1)',
                        'rgba(255, 199, 44, 1)'
                    ],
                    borderWidth: 3,
                    hoverOffset: 10
                }]
            },
            options: {
                ...baseConfig,
                plugins: {
                    ...baseConfig.plugins,
                    tooltip: {
                        ...baseConfig.plugins.tooltip,
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        };
    },

    /**
     * Line Chart Configuration - Spending Trend
     */
    getLineChartConfig: function(chartType, data, baseConfig) {
        const gradient = document.getElementById('spendingTrendChart').getContext('2d')
            .createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(218, 41, 28, 0.3)');
        gradient.addColorStop(1, 'rgba(218, 41, 28, 0.01)');

        return {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Monthly Spending',
                    data: data.values,
                    borderColor: 'rgba(218, 41, 28, 1)',
                    backgroundColor: gradient,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointBackgroundColor: 'rgba(218, 41, 28, 1)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointHoverRadius: 7,
                    pointHoverBackgroundColor: 'rgba(255, 199, 44, 1)',
                    hoverBorderWidth: 4
                }]
            },
            options: {
                ...baseConfig,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            font: { size: 11 },
                            callback: function(value) {
                                return '₱' + value.toLocaleString();
                            }
                        },
                        grid: { color: 'rgba(0, 0, 0, 0.05)' }
                    },
                    x: {
                        ticks: { font: { size: 11 } },
                        grid: { display: false }
                    }
                },
                plugins: {
                    ...baseConfig.plugins,
                    tooltip: {
                        ...baseConfig.plugins.tooltip,
                        callbacks: {
                            label: function(context) {
                                return 'Spending: ₱' + context.parsed.y.toLocaleString();
                            }
                        }
                    }
                }
            }
        };
    },

    /**
     * Doughnut Chart Configuration - Spending by Category
     */
    getDoughnutChartConfig: function(chartType, data, baseConfig) {
        const colors = [
            'rgba(218, 41, 28, 0.8)',
            'rgba(255, 199, 44, 0.8)',
            'rgba(52, 152, 219, 0.8)',
            'rgba(155, 89, 182, 0.8)',
            'rgba(46, 204, 113, 0.8)',
            'rgba(230, 126, 34, 0.8)'
        ];

        return {
            type: 'doughnut',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.values,
                    backgroundColor: colors.slice(0, data.labels.length),
                    borderColor: colors.slice(0, data.labels.length).map(c => c.replace('0.8', '1')),
                    borderWidth: 3,
                    hoverOffset: 15
                }]
            },
            options: {
                ...baseConfig,
                plugins: {
                    ...baseConfig.plugins,
                    tooltip: {
                        ...baseConfig.plugins.tooltip,
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ₱${value.toLocaleString()} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        };
    },

    /**
     * Setup auto-refresh of charts
     */
    setupAutoRefresh: function() {
        setInterval(() => {
            const isAdmin = document.getElementById('userGrowthChart') !== null;
            if (isAdmin) {
                this.loadAndCreateChart('userGrowth', 'bar');
                this.loadAndCreateChart('userRole', 'pie');
            } else {
                this.loadAndCreateChart('spendingTrend', 'line');
                this.loadAndCreateChart('spendingCategory', 'doughnut');
            }
        }, this.chartRefreshInterval);
    },

    /**
     * Capitalize string helper
     */
    capitalize: function(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).replace(/([A-Z])/g, '$1');
    },

    /**
     * Cleanup on page unload
     */
    destroy: function() {
        Object.keys(this.charts).forEach(key => {
            if (this.charts[key]) {
                this.charts[key].destroy();
            }
        });
        this.charts = {};
    }
};

// Initialize charts when document is ready
$(document).ready(function() {
    ChartManager.init();
});

// Cleanup charts on page unload
$(window).on('beforeunload', function() {
    ChartManager.destroy();
});