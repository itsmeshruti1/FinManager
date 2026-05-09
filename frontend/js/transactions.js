document.addEventListener('DOMContentLoaded', async () => {
    await initUser();
    loadTransactions();

    document.getElementById('transaction-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const type = document.getElementById('trans-type').value;
        const amount = parseFloat(document.getElementById('trans-amount').value);
        const date = document.getElementById('trans-date').value;
        const desc = document.getElementById('trans-desc').value || (type === 'income' ? 'Income' : 'Expense');

        try {
            // Find or create category first for proper relational tracking
            const categories = await apiFetch(`/categories/user/${USER_ID}`);
            let category = categories.find(c => c.name.toLowerCase() === desc.toLowerCase() && c.type === type);
            
            if (!category) {
                category = await apiFetch('/categories/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: USER_ID, name: desc, type: type })
                });
            }

            await apiFetch('/transactions/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: USER_ID,
                    amount, 
                    type, 
                    date, 
                    description: desc,
                    category_id: category.id
                })
            });
            e.target.reset();
            loadTransactions();
        } catch (err) {
            alert(err.message);
        }
    });
});

async function loadTransactions() {
    const list = document.getElementById('all-transactions');
    list.innerHTML = 'Loading...';
    try {
        const transactions = await apiFetch(`/transactions/user/${USER_ID}`);
        list.innerHTML = '';
        if(transactions.length === 0) {
            list.innerHTML = '<li class="transaction-item"><p>No transactions yet.</p></li>';
        }
        transactions.forEach(t => {
            list.innerHTML += `
                <li class="transaction-item">
                    <div class="transaction-info">
                        <h4>${t.description || 'Transaction'}</h4>
                        <p>${new Date(t.date).toLocaleDateString()}</p>
                    </div>
                    <div style="display:flex; align-items:center; gap: 1rem;">
                        <div class="transaction-amount ${t.type === 'expense' ? 'amount-expense' : 'amount-income'}">
                            ${t.type === 'expense' ? '-' : '+'}$${t.amount.toFixed(2)}
                        </div>
                        <button class="btn btn-danger" style="padding: 0.25rem 0.5rem; font-size: 0.8rem;" onclick="deleteTransaction('${t.id}')">Delete</button>
                    </div>
                </li>
            `;
        });
    } catch (e) {
        list.innerHTML = 'Failed to load transactions.';
    }
}

async function deleteTransaction(id) {
    if (confirm("Are you sure you want to delete this transaction?")) {
        try {
            await apiFetch(`/transactions/${id}`, { method: 'DELETE' });
            loadTransactions();
        } catch(e) {
            alert("Failed to delete transaction.");
        }
    }
}
