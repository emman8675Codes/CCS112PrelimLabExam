const API_LOANS = 'api/loans.php';
let currentStudentId = null;


function openLoanWorkspace(studentId, studentName) {
    currentStudentId = studentId;
    document.getElementById('student-section').style.display = 'none';
    document.getElementById('payment-section').style.display = 'none';
    document.getElementById('loan-section').style.display = 'block';
    document.getElementById('loan-workspace-title').innerText = `Loans for ${studentName} (ID: ${studentId})`;
    document.getElementById('loanStudentId').value = studentId;
    fetchLoans(studentId);
}


async function fetchLoans(studentId) {
    const response = await fetch(`${API_LOANS}?student_id=${studentId}`);
    const loans = await response.json();
    const tbody = document.getElementById('loanTableBody');
    tbody.innerHTML = '';


    loans.forEach(loan => {
        const isDisbursed = loan.status === 'Disbursed' || loan.status === 'Approved';

        // Disable payment button if loan is still Pending
        const paymentBtnHTML = isDisbursed
            ? `<button class="btn-action" onclick="openPaymentWorkspace(${loan.id})">Payments</button>`
            : `<button class="btn-action" style="background-color: #6c757d; cursor: not-allowed;" onclick="alert('Payments are only allowed for Approved or Disbursed loans.')">Payments</button>`;


        // Apply color badge classes based on status
        let statusClass = 'status-pending';
        if (loan.status === 'Approved') statusClass = 'status-approved';
        if (loan.status === 'Disbursed') statusClass = 'status-disbursed';


        tbody.innerHTML += `
            <tr>
                <td>${loan.id}</td>
                <td>$${parseFloat(loan.amount).toFixed(2)}</td>
                <td>${loan.type}</td>
                <td>
                    <select class="status-select ${statusClass}" onchange="updateLoanStatus(${loan.id}, this.value)">
                        <option value="Pending" ${loan.status === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="Approved" ${loan.status === 'Approved' ? 'selected' : ''}>Approved</option>
                        <option value="Disbursed" ${loan.status === 'Disbursed' ? 'selected' : ''}>Disbursed</option>
                    </select>
                </td>
                <td>${paymentBtnHTML}</td>
            </tr>
        `;
    });
}


// Function to handle status updating dynamically
async function updateLoanStatus(loanId, newStatus) {
    const response = await fetch(API_LOANS, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: loanId, status: newStatus })
    });


    const result = await response.json();
    alert(result.message || result.error);
    fetchLoans(currentStudentId);
}


document.getElementById('loanForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
        student_id: document.getElementById('loanStudentId').value,
        amount: document.getElementById('loanAmount').value,
        type: document.getElementById('loanType').value,
        status: document.getElementById('loanStatus').value
    };


    const response = await fetch(API_LOANS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });


    const result = await response.json();
    alert(result.message || result.error);


    document.getElementById('loanForm').reset();
    fetchLoans(currentStudentId);
});


function showLoanSection() {
    document.getElementById('student-section').style.display = 'none';
    document.getElementById('payment-section').style.display = 'none';
    document.getElementById('loan-section').style.display = 'block';

    if (currentStudentId) {
        fetchLoans(currentStudentId);
    }
}
