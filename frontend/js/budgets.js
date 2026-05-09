document.addEventListener('DOMContentLoaded', async () => {
    await initUser();
    loadBudgets();

    document.getElementById('budget-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const categoryName = document.getElementById('budget-category').value;
        const limit = parseFloat(document.getElementById('budget-limit').value);
        const month = document.getElementById('budget-month').value;

        try {
            // First create or get category
            const categories = await apiFetch(`/categories/user/${USER_ID}`);
            let category = categories.find(c => c.name.toLowerCase() === categoryName.toLowerCase());
            
            if (!category) {
                category = await apiFetch('/categories/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: USER_ID, name: categoryName, type: 'expense' })
                });
            }

            await apiFetch('/budgets/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: USER_ID,
                    category_id: category.id,
                    monthly_limit: limit,
                    month: month
                })
            });
            
            e.target.reset();
            loadBudgets();
        } catch (err) {
            alert(err.message);
        }
    });
});

async function loadBudgets() {
    const list = document.getElementById('budgets-list');
    list.innerHTML = 'Loading...';
    try {
        const budgets = await apiFetch(`/budgets/user/${USER_ID}`);
        const categories = await apiFetch(`/categories/user/${USER_ID}`);
        
        list.innerHTML = '';
        if(budgets.length === 0) {
            list.innerHTML = '<p style="color: var(--text-secondary)">No budgets set yet.</p>';
        }
        
        budgets.forEach(b => {
            const cat = categories.find(c => c.id === b.category_id);
            list.innerHTML += `
                <div class="card" style="box-shadow: none; margin-bottom: 1rem;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
                        <strong>${cat ? cat.name : 'Unknown Category'}</strong>
                        <span style="font-weight: 500;">Limit: $${b.monthly_limit.toFixed(2)}</span>
                    </div>
                    <div style="font-size:0.875rem; color: var(--text-secondary)">Month: ${b.month}</div>
                </div>
            `;
        });
    } catch (e) {
        list.innerHTML = 'Failed to load budgets.';
    }
}
