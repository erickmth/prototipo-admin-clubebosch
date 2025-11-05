// Dashboard Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const isLoggedIn = localStorage.getItem('clubot_logged_in');
    if (!isLoggedIn && !window.location.pathname.includes('index.html')) {
        window.location.href = 'index.html';
        return;
    }

    // Sidebar toggle functionality
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const sidebarMenu = document.querySelector('.sidebar-menu');

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebarMenu.classList.toggle('active');
        });
    }

    // Logout functionality
    const logoutBtns = document.querySelectorAll('#logout-btn');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('clubot_logged_in');
            localStorage.removeItem('clubot_user_email');
            window.location.href = 'index.html';
        });
    });

    // Update user info in navbar
    const userEmail = localStorage.getItem('clubot_user_email');
    if (userEmail) {
        const userRoleElements = document.querySelectorAll('.user-role');
        userRoleElements.forEach(element => {
            element.textContent = userEmail;
        });
    }

    // Initialize dashboard data
    initializeDashboardData();

    // Add click handlers for action cards
    const actionCards = document.querySelectorAll('.action-card');
    actionCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href && href !== '#') {
                window.location.href = href;
            } else {
                showNotification('Funcionalidade em desenvolvimento', 'info');
            }
        });
    });

    // Add handlers for table action buttons
    const actionButtons = document.querySelectorAll('.action-buttons .btn-icon');
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const title = this.getAttribute('title');
            showNotification(`Ação "${title}" executada com sucesso`, 'success');
        });
    });
});

// Initialize dashboard with sample data
function initializeDashboardData() {
    // This would typically fetch data from an API
    // For now, we'll use static data that was already in the HTML
    
    // Simulate loading data
    setTimeout(() => {
        // Update any dynamic content here
        console.log('Dashboard data loaded');
    }, 1000);
}

// Sample data for participants (would come from API in real app)
const sampleParticipants = [
    {
        id: 1,
        name: 'João Silva',
        edv: '12345',
        department: 'TI',
        grill: '#12',
        date: '10/10/2023',
        status: 'confirmed'
    },
    {
        id: 2,
        name: 'Maria Santos',
        edv: '23456',
        department: 'RH',
        grill: '#08',
        date: '12/10/2023',
        status: 'pending'
    },
    {
        id: 3,
        name: 'Carlos Oliveira',
        edv: '34567',
        department: 'ENG',
        grill: '#15',
        date: '14/10/2023',
        status: 'confirmed'
    }
];