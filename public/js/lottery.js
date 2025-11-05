// Lottery Management Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const isLoggedIn = localStorage.getItem('clubot_logged_in');
    if (!isLoggedIn) {
        window.location.href = 'index.html';
        return;
    }

    // Initialize lottery page
    initializeLotteryPage();

    // Run draw button
    const runDrawBtn = document.getElementById('run-draw-btn');
    if (runDrawBtn) {
        runDrawBtn.addEventListener('click', performDraw);
    }

    // Export PDF button
    const exportPdfBtn = document.getElementById('export-pdf-btn');
    if (exportPdfBtn) {
        exportPdfBtn.addEventListener('click', exportToPDF);
    }

    // Add participant button
    const addParticipantBtn = document.getElementById('add-participant-btn');
    if (addParticipantBtn) {
        addParticipantBtn.addEventListener('click', showAddParticipantModal);
    }

    // Modal functionality
    initializeModals();

    // Confirm draw button
    const confirmDrawBtn = document.getElementById('confirm-draw-btn');
    if (confirmDrawBtn) {
        confirmDrawBtn.addEventListener('click', confirmDrawResults);
    }

    // Retry draw button
    const retryDrawBtn = document.getElementById('retry-draw-btn');
    if (retryDrawBtn) {
        retryDrawBtn.addEventListener('click', retryDraw);
    }
});

// Initialize lottery page with data
function initializeLotteryPage() {
    loadParticipants();
    updateLotteryStats();
}

// Load participants into the table
function loadParticipants() {
    const tbody = document.getElementById('participants-tbody');
    if (!tbody) return;

    // Clear existing rows
    tbody.innerHTML = '';

    // Add participants from sample data
    sampleParticipants.forEach(participant => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" class="participant-checkbox" data-id="${participant.id}"></td>
            <td>
                <div class="user-cell">
                    <div class="user-avatar small">
                        <img src="public/img/icon-square.svg" alt="${participant.name}">
                    </div>
                    <div class="user-details">
                        <div class="user-name">${participant.name}</div>
                        <div class="user-edv">EDV: ${participant.edv}</div>
                    </div>
                </div>
            </td>
            <td>${participant.edv}</td>
            <td>${participant.department}</td>
            <td>${participant.grill}</td>
            <td>${participant.date}</td>
            <td><span class="status-badge ${participant.status}">${getStatusText(participant.status)}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon" title="Editar" onclick="editParticipant(${participant.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" title="Remover" onclick="removeParticipant(${participant.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });

    // Initialize select all checkbox
    const selectAll = document.getElementById('select-all');
    if (selectAll) {
        selectAll.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.participant-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
    }
}

// Update lottery statistics
function updateLotteryStats() {
    const confirmedParticipants = sampleParticipants.filter(p => p.status === 'confirmed').length;
    const totalParticipants = sampleParticipants.length;
    const occupancyRate = Math.round((confirmedParticipants / totalParticipants) * 100);

    // Update stats in the UI
    const statValues = document.querySelectorAll('.stat-value');
    if (statValues.length >= 3) {
        statValues[0].textContent = totalParticipants;
        statValues[1].textContent = '8'; // Fixed number of grills
        statValues[2].textContent = occupancyRate + '%';
    }
}

// Perform the lottery draw
function performDraw() {
    const runDrawBtn = document.getElementById('run-draw-btn');
    if (!runDrawBtn) return;

    // Show loading state
    runDrawBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sorteando...';
    runDrawBtn.disabled = true;

    // Simulate draw process
    setTimeout(() => {
        // Get confirmed participants
        const confirmedParticipants = sampleParticipants.filter(p => p.status === 'confirmed');
        
        if (confirmedParticipants.length === 0) {
            showNotification('Nenhum participante confirmado para o sorteio.', 'error');
            resetDrawButton();
            return;
        }

        // Available grills
        const availableGrills = ['#01', '#02', '#03', '#04', '#05', '#06', '#07', '#08'];
        
        // Perform random draw
        const shuffledParticipants = [...confirmedParticipants].sort(() => 0.5 - Math.random());
        const results = shuffledParticipants.slice(0, Math.min(availableGrills.length, shuffledParticipants.length))
            .map((participant, index) => ({
                participant: participant,
                grill: availableGrills[index]
            }));

        // Display results
        displayDrawResults(results);
        
        // Show results section
        const resultsSection = document.getElementById('draw-results');
        if (resultsSection) {
            resultsSection.style.display = 'block';
        }

        // Reset button
        resetDrawButton();
        
        showNotification('Sorteio realizado com sucesso!', 'success');
    }, 2000);
}

// Reset draw button to original state
function resetDrawButton() {
    const runDrawBtn = document.getElementById('run-draw-btn');
    if (runDrawBtn) {
        runDrawBtn.innerHTML = '<i class="fas fa-random"></i> Realizar Sorteio';
        runDrawBtn.disabled = false;
    }
}

// Display draw results
function displayDrawResults(results) {
    const resultsContainer = document.getElementById('results-container');
    if (!resultsContainer) return;

    resultsContainer.innerHTML = '';

    results.forEach((result, index) => {
        const resultCard = document.createElement('div');
        resultCard.className = 'result-card';
        resultCard.innerHTML = `
            <div class="result-header">
                <div class="result-grill">${result.grill}</div>
                <div class="result-position">#${index + 1}</div>
            </div>
            <div class="result-winner">${result.participant.name}</div>
            <div class="result-details">
                EDV: ${result.participant.edv} | ${result.participant.department}
            </div>
        `;
        resultsContainer.appendChild(resultCard);
    });
}

// Confirm draw results
function confirmDrawResults() {
    showNotification('Resultados do sorteio confirmados com sucesso!', 'success');
    
    // Hide results section after confirmation
    const resultsSection = document.getElementById('draw-results');
    if (resultsSection) {
        resultsSection.style.display = 'none';
    }
}

// Retry draw
function retryDraw() {
    performDraw();
}

// Export to PDF functionality
function exportToPDF() {
    // In a real implementation, this would use jsPDF or pdfmake
    // For this demo, we'll show a notification
    
    showNotification('Exportando resultados para PDF...', 'info');
    
    setTimeout(() => {
        showNotification('PDF exportado com sucesso!', 'success');
        
        // Simulate download
        const link = document.createElement('a');
        link.download = 'sorteio-clubebosch-outubro-2023.pdf';
        link.href = '#';
        link.click();
    }, 1500);
}

// Show add participant modal
function showAddParticipantModal() {
    const modal = document.getElementById('add-participant-modal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

// Initialize modal functionality
function initializeModals() {
    // Close modals when clicking X or cancel button
    const closeModalButtons = document.querySelectorAll('.close-modal, .modal-footer .btn-secondary');
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Close modal when clicking outside
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
            }
        });
    });

    // Save participant functionality
    const saveParticipantBtn = document.getElementById('save-participant-btn');
    if (saveParticipantBtn) {
        saveParticipantBtn.addEventListener('click', saveParticipant);
    }
}

// Save new participant
function saveParticipant() {
    const nameInput = document.getElementById('participant-name');
    const edvInput = document.getElementById('participant-edv');
    const departmentSelect = document.getElementById('participant-department');

    if (!nameInput.value || !edvInput.value || !departmentSelect.value) {
        showNotification('Por favor, preencha todos os campos.', 'error');
        return;
    }

    // Create new participant
    const newParticipant = {
        id: sampleParticipants.length + 1,
        name: nameInput.value,
        edv: edvInput.value,
        department: departmentSelect.value,
        grill: '#--',
        date: new Date().toLocaleDateString('pt-BR'),
        status: 'pending'
    };

    // Add to sample data (in real app, this would be an API call)
    sampleParticipants.push(newParticipant);

    // Reload participants table
    loadParticipants();
    updateLotteryStats();

    // Close modal and reset form
    const modal = document.getElementById('add-participant-modal');
    if (modal) {
        modal.style.display = 'none';
    }

    // Reset form
    nameInput.value = '';
    edvInput.value = '';
    departmentSelect.value = '';

    showNotification('Participante adicionado com sucesso!', 'success');
}

// Edit participant
function editParticipant(id) {
    showNotification(`Editando participante ID: ${id}`, 'info');
    // In a real app, this would open an edit modal
}

// Remove participant
function removeParticipant(id) {
    if (confirm('Tem certeza que deseja remover este participante?')) {
        const index = sampleParticipants.findIndex(p => p.id === id);
        if (index !== -1) {
            sampleParticipants.splice(index, 1);
            loadParticipants();
            updateLotteryStats();
            showNotification('Participante removido com sucesso!', 'success');
        }
    }
}

// Helper function to get status text
function getStatusText(status) {
    const statusMap = {
        'confirmed': 'Confirmado',
        'pending': 'Pendente',
        'cancelled': 'Cancelado'
    };
    return statusMap[status] || status;
}

// Sample participants data
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
    },
    {
        id: 4,
        name: 'Ana Costa',
        edv: '45678',
        department: 'FIN',
        grill: '#03',
        date: '15/10/2023',
        status: 'cancelled'
    },
    {
        id: 5,
        name: 'Pedro Almeida',
        edv: '56789',
        department: 'VEND',
        grill: '#07',
        date: '16/10/2023',
        status: 'pending'
    }
];