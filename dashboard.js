document.addEventListener('DOMContentLoaded', async () => {
    await initUser();
    loadDashboardData();
});

async function loadDashboardData() {
    try {
        const transactions = await apiFetch(`/transactions/user/${USER_ID}`);
        const budgets = await apiFetch(`/budgets/user/${USER_ID}`);
        const categories = await apiFetch(`/categories/user/${USER_ID}`);
        
        let totalIncome = 0;
        let totalExpense = 0;
        
        const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
        const categoryTotals = {}; // category_id -> amount

        const recentList = document.getElementById('recent-transactions');
        recentList.innerHTML = '';

        transactions.forEach((t, index) => {
            if (t.type === 'income') totalIncome += t.amount;
            else {
                totalExpense += t.amount;
                
                const catId = t.category_id;
                if (catId) {
                    categoryTotals[catId] = (categoryTotals[catId] || 0) + t.amount;
                } else {
                    const catName = (t.description || 'Other').toLowerCase();
                    const existingCat = categories.find(c => c.name.toLowerCase() === catName && c.type === 'expense');
                    if (existingCat) {
                        categoryTotals[existingCat.id] = (categoryTotals[existingCat.id] || 0) + t.amount;
                    } else {
                        categoryTotals['unknown'] = (categoryTotals['unknown'] || 0) + t.amount;
                    }
                }
            }

            if (index < 5) {
                recentList.innerHTML += `
                    <li class="transaction-item">
                        <div class="transaction-info">
                            <h4>${t.description || 'Transaction'}</h4>
                            <p>${new Date(t.date).toLocaleDateString()}</p>
                        </div>
                        <div class="transaction-amount ${t.type === 'expense' ? 'amount-expense' : 'amount-income'}">
                            ${t.type === 'expense' ? '-' : '+'}$${t.amount.toFixed(2)}
                        </div>
                    </li>
                `;
            }
        });

        const chartData = {};
        for (const [id, amount] of Object.entries(categoryTotals)) {
            if (id === 'unknown') {
                chartData['Other'] = (chartData['Other'] || 0) + amount;
            } else {
                const cat = categories.find(c => c.id === id);
                const name = cat ? cat.name : 'Other';
                const displayName = name.charAt(0).toUpperCase() + name.slice(1);
                chartData[displayName] = (chartData[displayName] || 0) + amount;
            }
        }

        const balance = totalIncome - totalExpense;
        document.getElementById('total-balance').textContent = balance < 0 ? `-$${Math.abs(balance).toFixed(2)}` : `$${balance.toFixed(2)}`;
        document.getElementById('total-income').textContent = `+$${totalIncome.toFixed(2)}`;
        document.getElementById('total-expense').textContent = `-$${totalExpense.toFixed(2)}`;

        renderChart(chartData);
        checkBudgets(categoryTotals, budgets, currentMonth, categories);

    } catch (e) {
        console.error(e);
    }
}

let chartInstance = null;
function renderChart(categoryTotals) {
    const ctx = document.getElementById('spendingChart').getContext('2d');
    if (chartInstance) chartInstance.destroy();
    
    const premiumColors = [
        '#0B3C6F', '#0F766E', '#15803D', '#B45309', '#B91C1C',
        '#D9E0EA', '#4C8DDB', '#2DD4BF', '#4ADE80', '#FBBF24', '#F87171'
    ];

    const labels = Object.keys(categoryTotals).length ? Object.keys(categoryTotals) : ['No Data'];
    const data = Object.keys(categoryTotals).length ? Object.values(categoryTotals) : [1];

    chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: labels[0] === 'No Data' ? ['#D9E0EA'] : premiumColors,
                borderWidth: 2,
                borderColor: '#FFFFFF',
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%', 
            plugins: {
                legend: { 
                    position: 'right',
                    labels: {
                        font: { family: "'Inter', sans-serif", size: 13 },
                        usePointStyle: true,
                        padding: 20,
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#1A2433'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(11, 18, 32, 0.95)',
                    titleColor: '#E8EDF5',
                    bodyColor: '#E8EDF5',
                    titleFont: { family: "'Outfit', sans-serif", size: 14 },
                    bodyFont: { family: "'Inter', sans-serif", size: 13 },
                    padding: 12,
                    cornerRadius: 8,
                    displayColors: false
                }
            },
            animation: { animateScale: true, animateRotate: true }
        }
    });
}

function checkBudgets(categoryTotals, budgets, currentMonth, categories) {
    const alertsContainer = document.getElementById('alerts-container');
    alertsContainer.innerHTML = '';
    
    try {
        budgets.forEach(b => {
            if (b.month === currentMonth) {
                const spent = categoryTotals[b.category_id] || 0;
                if (spent > b.monthly_limit) {
                    const cat = categories.find(c => c.id === b.category_id);
                    const catName = cat ? cat.name : 'Unknown';
                    alertsContainer.innerHTML += `
                        <div class="alert-red">
                            <strong>Over Budget!</strong> You have spent $${spent.toFixed(2)} on ${catName}, exceeding your limit of $${b.monthly_limit.toFixed(2)}.
                        </div>
                    `;
                }
            }
        });
    } catch(e) {
        console.error("Error checking budgets:", e);
    }
}
