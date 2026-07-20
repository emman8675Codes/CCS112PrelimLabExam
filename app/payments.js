const API_PAYMENTS = 'api/payments.php';
let currentLoanId = null;
let currentRemainingBalance = 0; // Tracks live remaining balance

function openPaymentWorkspace(loanId) {
    currentLoanId = loanId;
    document.getElementById('loan-section').style.display = 'none';
    document.getElementById('payment-section').style.display = 'block';
    document.getElementById('payment-workspace-title').innerText = `Payment Management for Loan #${loanId}`;
    document.getElementById('paymentLoanId').value = loanId;
    fetchPayments(loanId);
}

async function fetchPayments(loanId) {
    const response = await fetch(`${API_PAYMENTS}?loan_id=${loanId}`);
    const data = await response.json();

    // Store current remaining balance globally for validation
    currentRemainingBalance = parseFloat(data.remaining_balance);

    // Render Metrics
    document.getElementById('totalPaid').innerText = `$${parseFloat(data.total_paid).toFixed(2)}`;
    document.getElementById('remainingBalance').innerText = `$${currentRemainingBalance.toFixed(2)}`;

    // Render Table
    const tbody = document.getElementById('paymentTableBody');
    tbody.innerHTML = '';

    data.payments.forEach(p => {
        tbody.innerHTML += `
            <tr>
                <td>${p.id}</td>
                <td>$${parseFloat(p.amount).toFixed(2)}</td>
                <td>${p.payment_date}</td>
                <td>${p.payment_method}</td>
            </tr>
        `;
    });
}

document.getElementById('paymentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const paymentAmount = parseFloat(document.getElementById('paymentAmount').value);

    // Business Rule Validation: Payment cannot exceed remaining balance
    if (paymentAmount > currentRemainingBalance) {
        alert(`Error: Payment ($${paymentAmount.toFixed(2)}) exceeds the remaining balance ($${currentRemainingBalance.toFixed(2)})!`);
        return; // Block submission
    }

    if (currentRemainingBalance === 0) {
        alert("This loan is already fully paid!");
        return;
    }

    const payload = {
        loan_id: document.getElementById('paymentLoanId').value,
        amount: paymentAmount,
        payment_date: document.getElementById('paymentDate').value,
        payment_method: document.getElementById('paymentMethod').value
    };

    const response = await fetch(API_PAYMENTS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const result = await response.json();
    alert(result.message || result.error);

    document.getElementById('paymentForm').reset();
    fetchPayments(currentLoanId);
});