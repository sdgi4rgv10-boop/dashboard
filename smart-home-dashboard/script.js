/**
 * المستشار الذهبي - Golden Advisor v2.5
 * Core Intelligence & Financial Audit Engine
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- State Management ---
    let allTransactions = JSON.parse(localStorage.getItem('gold_silver_tx')) || [];
    let treasury = JSON.parse(localStorage.getItem('gold_treasury')) || {
        cash: { balance: 0, withdrawn: 0, history: [] },
        vodafone: { balance: 0, withdrawn: 0, history: [] },
        instapay: { balance: 0, withdrawn: 0, history: [] }
    };

    let selectedType = 'gold'; // Current active pill

    // UI Elements
    const views = {
        dashboard: document.getElementById('view_dashboard'),
        finance: document.getElementById('view_finance'),
        database: document.getElementById('view_database'),
        invoices: document.getElementById('view_invoices')
    };

    const modalTransaction = document.getElementById('transactionModal');
    const modalWithdraw = document.getElementById('withdrawModal');

    // --- Core Functions ---

    function saveMemory() {
        localStorage.setItem('gold_silver_tx', JSON.stringify(allTransactions));
        localStorage.setItem('gold_treasury', JSON.stringify(treasury));
    }

    // --- Custom DateTime Override (Persistent) ---
    // Load saved custom time from localStorage (survives page refresh)
    let customDateTime = localStorage.getItem('gold_custom_datetime') || null;

    function getActiveDateTime() {
        return customDateTime ? new Date(customDateTime) : new Date();
    }

    function applyCustomTimeUI() {
        const indicator = document.getElementById('customTimeIndicator');
        const wrapper = document.getElementById('clockWrapper');
        if (customDateTime) {
            indicator.style.display = 'flex';
            wrapper.style.border = '1px solid rgba(255,159,67,0.5)';
            wrapper.style.background = 'rgba(255,159,67,0.06)';
        } else {
            indicator.style.display = 'none';
            wrapper.style.border = '';
            wrapper.style.background = 'transparent';
        }
    }

    window.openTimeEdit = function () {
        const now = getActiveDateTime();
        const yr = now.getFullYear();
        const mo = String(now.getMonth() + 1).padStart(2, '0');
        const dy = String(now.getDate()).padStart(2, '0');
        const hh = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        document.getElementById('customDateInput').value = `${yr}-${mo}-${dy}`;
        document.getElementById('customTimeInput').value = `${hh}:${mm}`;
        document.getElementById('timeEditModal').classList.add('active');
    };

    window.applyTimeEdit = function () {
        const dateVal = document.getElementById('customDateInput').value;
        const timeVal = document.getElementById('customTimeInput').value;
        if (!dateVal || !timeVal) return alert('برجاء اختيار التاريخ والساعة');
        customDateTime = `${dateVal}T${timeVal}:00`;
        localStorage.setItem('gold_custom_datetime', customDateTime); // 💾 حفظ دائم
        applyCustomTimeUI();
        closeTimeEditModal();
        updateLiveClock();
    };

    window.resetToLiveTime = function () {
        customDateTime = null;
        localStorage.removeItem('gold_custom_datetime'); // 🗑 حذف من الذاكرة
        applyCustomTimeUI();
        closeTimeEditModal();
        updateLiveClock();
    };

    window.closeTimeEditModal = function () {
        document.getElementById('timeEditModal').classList.remove('active');
    };

    // Live Clock Logic
    function updateLiveClock() {
        const now = getActiveDateTime();
        // Show HH:MM only when frozen; HH:MM:SS when live
        const clockStr = customDateTime
            ? now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
            : now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const dateStr = now.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

        const clockEl = document.getElementById('liveClock');
        const dateEl = document.getElementById('currentDate');
        if (clockEl) clockEl.innerText = clockStr;
        if (dateEl) dateEl.innerText = dateStr;
    }

    // Only tick every second when using real (live) time
    setInterval(() => { if (!customDateTime) updateLiveClock(); }, 1000);

    // Restore saved custom time indicator on page load
    applyCustomTimeUI();

    // Navigation
    window.backToDashboard = function () {
        Object.values(views).forEach(v => v.style.display = 'none');
        views.dashboard.style.display = 'flex';
        document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
        document.querySelector('.sidebar-item:first-child').classList.add('active');
    };

    window.openFinancePage = function () {
        Object.values(views).forEach(v => v.style.display = 'none');
        views.finance.style.display = 'flex';
        renderFinanceContent('in');
        document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
        document.querySelector('.sidebar-item:nth-child(2)').classList.add('active');
    };

    window.openDatabasePage = function () {
        Object.values(views).forEach(v => v.style.display = 'none');
        views.database.style.display = 'flex';
        renderDatabaseContent();
        document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
        document.querySelector('.sidebar-item:nth-child(3)').classList.add('active');
    };

    window.openInvoicesPage = function () {
        Object.values(views).forEach(v => v.style.display = 'none');
        views.invoices.style.display = 'flex';
        renderInvoicesContent();
        document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
        document.querySelector('.sidebar-item:nth-child(4)').classList.add('active');
    };

    // --- UI Rendering ---

    function updateStockUI() {
        let goldBuy = 0, goldSell = 0;
        let silverBuy = 0, silverSell = 0;

        allTransactions.forEach(tx => {
            const w = parseFloat(tx.weight) || 0;
            if (tx.type.includes('ذهب')) {
                if (tx.isSell) goldSell += w; else goldBuy += w;
            } else if (tx.type.includes('فضة')) {
                if (tx.isSell) silverSell += w; else silverBuy += w;
            }
        });

        const fmt = v => v.toFixed(2);

        // Gold
        const gNet = goldBuy - goldSell;
        document.getElementById('goldBuyStock').innerText = fmt(goldBuy);
        document.getElementById('goldSellStock').innerText = fmt(goldSell);
        document.getElementById('goldNetStock').innerText = fmt(gNet);
        document.getElementById('goldNetStock').style.color = gNet >= 0 ? '#fff' : 'var(--danger)';

        // Silver
        const sNet = silverBuy - silverSell;
        document.getElementById('silverBuyStock').innerText = fmt(silverBuy);
        document.getElementById('silverSellStock').innerText = fmt(silverSell);
        document.getElementById('silverNetStock').innerText = fmt(sNet);
        document.getElementById('silverNetStock').style.color = sNet >= 0 ? '#fff' : 'var(--danger)';
    }

    function updateTreasuryUI() {
        const formatter = new Intl.NumberFormat('en-US');
        ['cash', 'vodafone', 'instapay'].forEach(type => {
            // Calculate balance from scratch for accuracy
            let totalIn = allTransactions.reduce((sum, tx) => sum + (tx[type] || 0), 0);
            let totalWithdrawn = (treasury[type].history || []).reduce((sum, h) => sum + (h.amount || 0), 0);

            document.getElementById(`treasuryTotal_${type}`).innerText = formatter.format(totalIn - totalWithdrawn) + ' ج.م';
            document.getElementById(`treasuryWithdrawn_${type}`).innerText = totalWithdrawn > 0 ? `إجمالي السحوبات: ${formatter.format(totalWithdrawn)} ج.م` : '';
        });
    }

    function renderCardToDOM(tx, isNew = false) {
        const colId = `logCol_${tx.isSell ? 'Sell' : 'Buy'}${tx.type.includes('ذهب') ? 'Gold' : 'Silver'}`;
        const container = document.getElementById(colId);
        if (!container) return;

        const html = `
            <div class="tx-item">
                <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                    <span style="font-size:1.4rem; font-weight:900;">${tx.weight} <small>جم</small></span>
                    <span style="color:${tx.isSell ? 'var(--danger)' : 'var(--success)'}; font-weight:900;">${tx.totalPrice} ج.م</span>
                </div>
                <div style="display:flex; justify-content:space-between; margin-top:8px; font-size:0.85rem; color:#888;">
                    <span>${tx.day} ${tx.monthName}</span>
                    <span style="direction:ltr; color:var(--accent); font-weight:800;">${tx.time}</span>
                </div>
            </div>
        `;

        if (isNew) container.insertAdjacentHTML('afterbegin', html);
        else container.insertAdjacentHTML('beforeend', html);
    }

    window.renderFinanceContent = function (mode) {
        const container = document.getElementById('financeResultsScrollContainer');
        const btnIn = document.getElementById('btnFinanceIn');
        const btnOut = document.getElementById('btnFinanceOut');

        btnIn.classList.toggle('active', mode === 'in');
        btnOut.classList.toggle('active', mode === 'out');

        container.innerHTML = '';
        const formatter = new Intl.NumberFormat('ar-EG');
        let records = [];

        if (mode === 'in') {
            records = allTransactions.filter(tx => tx.isSell).map(tx => ({
                ...tx, label: 'مقبوضات بيع', color: 'var(--success)', icon: 'fa-money-bill-trend-up'
            }));
        } else {
            const purchases = allTransactions.filter(tx => !tx.isSell).map(tx => ({
                ...tx, label: 'مدفوعات شراء', color: 'var(--danger)', icon: 'fa-cart-shopping'
            }));
            const withdrawals = [];
            ['cash', 'vodafone', 'instapay'].forEach(type => {
                (treasury[type].history || []).forEach(h => {
                    withdrawals.push({
                        type: `سحب ${type === 'cash' ? 'كاش' : type === 'vodafone' ? 'فودافون' : 'انستا'}`,
                        totalPrice: h.amount,
                        cash: type === 'cash' ? h.amount : 0, vodafone: type === 'vodafone' ? h.amount : 0, instapay: type === 'instapay' ? h.amount : 0,
                        day: h.date.split('/')[0], monthName: h.date.split('/')[1] || '',
                        time: h.time, icon: 'fa-arrow-right-from-bracket', color: 'var(--danger)', label: 'سحب مالي'
                    });
                });
            });
            records = [...purchases, ...withdrawals].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        }

        const total = records.reduce((sum, r) => sum + r.totalPrice, 0);
        container.innerHTML = `
            <div class="glass" style="padding:25px; margin-bottom:25px; display:flex; justify-content:space-between; align-items:center;">
                <h3 style="margin:0;">إجمالي ${mode === 'in' ? 'الوارد' : 'الصادر'}</h3>
                <span style="font-size:3rem; font-weight:950; color:${mode === 'in' ? 'var(--success)' : 'var(--danger)'};">${total.toLocaleString()} ج.م</span>
            </div>
        `;

        records.forEach(r => {
            container.insertAdjacentHTML('beforeend', `
                <div class="glass" style="padding:20px; margin-bottom:15px; display:flex; align-items:center; gap:30px; border-right:8px solid ${r.color};">
                    <div style="width:100px; text-align:center;">
                        <div style="font-size:1.4rem; font-weight:900;">${r.day} ${r.monthName}</div>
                        <div style="color:var(--accent); font-weight:800;">${r.time}</div>
                    </div>
                    <i class="fa-solid ${r.icon}" style="font-size:2rem; color:${r.color};"></i>
                    <div style="flex-grow:1;">
                        <div style="font-size:1.5rem; font-weight:900;">${r.type} <small style="color:#777; font-weight:400;">(${r.label})</small></div>
                        <div style="display:flex; gap:25px; margin-top:10px; color:#aaa;">
                            <span>كاش: <b>${r.cash || 0}</b></span>
                            <span>فودافون: <b>${r.vodafone || 0}</b></span>
                            <span>انستا: <b>${r.instapay || 0}</b></span>
                        </div>
                    </div>
                    <div style="font-size:2rem; font-weight:900;">${r.totalPrice.toLocaleString()} <small>ج.م</small></div>
                </div>
            `);
        });
    }

    function renderDatabaseContent() {
        const container = document.getElementById('dbPageContent');
        container.innerHTML = '';
        allTransactions.slice().reverse().forEach(tx => {
            container.insertAdjacentHTML('beforeend', `
                <div class="tx-item" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; padding:20px;">
                    <div style="display:flex; gap:30px; align-items:center;">
                        <div style="width:120px;"><b>${tx.day} ${tx.monthName}</b> <br> <span style="color:var(--accent);">${tx.time}</span></div>
                        <div style="font-size:1.3rem; font-weight:800;">${tx.type} (${tx.weight} جم)</div>
                        ${tx.customerName ? `<div style="padding: 5px 15px; background: rgba(255,159,67,0.1); border-radius: 10px; color: #ff9f43; font-weight: 700;">${tx.customerName}</div>` : ''}
                    </div>
                    <div style="text-align:left;">
                        <div style="font-size:1.6rem; font-weight:900; color:${tx.isSell ? 'var(--danger)' : 'var(--success)'};">
                            ${tx.isSell ? '-' : '+'}${tx.totalPrice.toLocaleString()} ج.م
                        </div>
                    </div>
                </div>
            `);
        });
    }

    window.renderInvoicesContent = function (filter = '') {
        const container = document.getElementById('invoicesResultsScrollContainer');
        container.innerHTML = '';

        const filtered = allTransactions.filter(tx =>
            (tx.customerName || '').toLowerCase().includes(filter.toLowerCase()) ||
            (tx.type || '').includes(filter)
        );

        filtered.forEach(tx => {
            const html = `
                <div class="glass" style="padding: 25px; border-radius: 30px; border-left: 10px solid ${tx.isSell ? 'var(--danger)' : 'var(--success)'}; position: relative; overflow: hidden;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <span style="background: ${tx.isSell ? 'var(--danger)' : 'var(--success)'}; color: #000; padding: 5px 20px; border-radius: 12px; font-weight: 900; font-size: 0.9rem;">
                            ${tx.isSell ? 'فاتورة بيع' : 'فاتورة شراء'}
                        </span>
                        <div style="display:flex; gap:10px; align-items:center;">
                            <button onclick="downloadInvoice(${tx.timestamp})" style="background:rgba(255,255,255,0.1); border:none; border-radius:10px; color:#fff; width:35px; height:35px; cursor:pointer; display:flex; justify-content:center; align-items:center;"><i class="fa-solid fa-download"></i></button>
                            <span style="color: #666; font-size: 0.9rem; font-weight: 700;">#${tx.timestamp.toString().slice(-6)}</span>
                        </div>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <div style="color: #aaa; font-size: 0.8rem; margin-bottom: 5px;">اسم العميل</div>
                        <div style="font-size: 1.5rem; font-weight: 900; color: #fff;">${tx.customerName || 'عميل نقدي'}</div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                        <div class="glass" style="padding: 12px; border-radius: 15px;">
                            <div style="color: #777; font-size: 0.75rem;">الوزن</div>
                            <div style="font-size: 1.2rem; font-weight: 900;">${tx.weight} جم</div>
                        </div>
                        <div class="glass" style="padding: 12px; border-radius: 15px;">
                            <div style="color: #777; font-size: 0.75rem;">سعر الجرام</div>
                            <div style="font-size: 1.2rem; font-weight: 900;">${tx.gramPrice || ' (--) '} ج.م</div>
                        </div>
                    </div>

                    <div style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 20px; border: 1px dashed rgba(255,255,255,0.1);">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span style="color: #777;">كاش:</span>
                            <span style="font-weight: 800; color:var(--silver);">${(tx.cash || 0).toLocaleString()} ج.م</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span style="color: #777;">فودافون كاش:</span>
                            <span style="font-weight: 800; color:var(--silver);">${(tx.vodafone || 0).toLocaleString()} ج.م</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 15px;">
                            <span style="color: #777;">انستاباي:</span>
                            <span style="font-weight: 800; color:var(--silver);">${(tx.instapay || 0).toLocaleString()} ج.م</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-weight: 900; font-size: 1.1rem; color: #ff9f43;">الإجمالي:</span>
                            <span style="font-size: 1.8rem; font-weight: 950; color: #fff;">${tx.totalPrice.toLocaleString()} ج.م</span>
                        </div>
                    </div>

                    <div style="display: flex; justify-content: space-between; margin-top: 20px; font-size: 0.8rem; color: #444;">
                        <span>${tx.day} ${tx.monthName}</span>
                        <span>${tx.time}</span>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', html);
        });

        if (filtered.length === 0) {
            container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 100px; color: #666; font-size: 1.5rem;">لا توجد فواتير مطابقة</div>';
        }
    }

    window.downloadInvoice = function (timestamp) {
        const tx = allTransactions.find(t => t.timestamp === timestamp);
        if (!tx) return;

        const receipt = document.createElement('div');
        receipt.style.width = '400px';
        receipt.style.background = '#0a0a0c';
        receipt.style.padding = '40px';
        receipt.style.color = '#fff';
        receipt.style.fontFamily = "'Cairo', sans-serif";
        receipt.style.direction = 'rtl';
        receipt.style.position = 'fixed';
        receipt.style.top = '-5000px';

        receipt.innerHTML = `
            <div style="text-align:center; border-bottom:2px dashed #333; padding-bottom:20px; margin-bottom:20px;">
                <h1 style="color:#FFD700; margin:0;">المستشار الذهبي</h1>
                <p style="color:#666; margin:5px 0 0 0;">لتجارة الذهب والفضة</p>
                <div style="margin-top:15px; background:#222; padding:5px; font-size:0.9rem;">${tx.isSell ? 'فاتورة مبيعات' : 'فاتورة مشتريات'}</div>
            </div>
            
            <div style="margin-bottom:20px;">
                <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                    <span>التاريخ: ${tx.day} ${tx.monthName}</span>
                    <span>الوقت: ${tx.time}</span>
                </div>
                <div style="display:flex; justify-content:space-between;">
                    <span>العميل: ${tx.customerName || 'عميل نقدي'}</span>
                    <span>الرقم: #${tx.timestamp.toString().slice(-6)}</span>
                </div>
            </div>

            <table style="width:100%; border-collapse:collapse; margin-bottom:20px;">
                <tr style="border-bottom:1px solid #333; color:#aaa; font-size:0.9rem;">
                    <th style="text-align:right; padding:10px 0;">البيان</th>
                    <th style="text-align:left; padding:10px 0;">القيمة</th>
                </tr>
                <tr>
                    <td style="padding:15px 0;">${tx.type} (${tx.weight} جم)</td>
                    <td style="text-align:left; font-weight:900;">@ ${tx.gramPrice || '--'}</td>
                </tr>
            </table>

            <div style="background:#111; padding:20px; border-radius:10px; margin-bottom:20px;">
                <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                    <span style="color:#aaa;">كاش:</span>
                    <span>${(tx.cash || 0).toLocaleString()} ج.م</span>
                </div>
                <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                    <span style="color:#aaa;">فودافون:</span>
                    <span>${(tx.vodafone || 0).toLocaleString()} ج.م</span>
                </div>
                <div style="display:flex; justify-content:space-between; margin-bottom:15px;">
                    <span style="color:#aaa;">انستاباي:</span>
                    <span>${(tx.instapay || 0).toLocaleString()} ج.م</span>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:1.4rem; font-weight:900; border-top:1px solid #333; padding-top:15px;">
                    <span>إجمالي المبلغ:</span>
                    <span style="color:#FFD700;">${tx.totalPrice.toLocaleString()} ج.م</span>
                </div>
            </div>

            <div style="text-align:center; color:#555; font-size:0.8rem; margin-top:30px;">
                شكراً لتعاملكم مع المستشار الذهبي
            </div>
        `;

        document.body.appendChild(receipt);

        html2canvas(receipt, {
            scale: 3,
            backgroundColor: '#0a0a0c'
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = `فاتورة_${tx.customerName || 'عميل'}_${tx.timestamp}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            document.body.removeChild(receipt);
        });
    };

    window.closeReceiptModal = function () {
        document.getElementById('receiptModal').classList.remove('active');
    };

    let currentReceiptTx = null;

    window.showReceiptModal = function (tx) {
        currentReceiptTx = tx;
        const isSell = tx.isSell;

        const badge = document.getElementById('receiptTypeBadge');
        badge.textContent = isSell ? 'فاتورة بيع' : 'فاتورة شراء';
        badge.style.background = isSell ? 'var(--danger)' : 'var(--success)';
        badge.style.color = '#000';

        document.getElementById('receiptCustomer').textContent = tx.customerName || 'عميل نقدي';
        document.getElementById('receiptDate').textContent = tx.day + ' ' + tx.monthName + ' • ' + tx.time;
        document.getElementById('receiptId').textContent = '#' + tx.timestamp.toString().slice(-6);
        document.getElementById('receiptType').textContent = tx.type;
        document.getElementById('receiptWeight').textContent = tx.weight + ' جم';
        document.getElementById('receiptGramPrice').textContent = tx.gramPrice ? tx.gramPrice.toLocaleString() + ' ج.م' : '--';
        document.getElementById('receiptCash').textContent = (tx.cash || 0).toLocaleString() + ' ج.م';
        document.getElementById('receiptVodafone').textContent = (tx.vodafone || 0).toLocaleString() + ' ج.م';
        document.getElementById('receiptInstapay').textContent = (tx.instapay || 0).toLocaleString() + ' ج.م';
        document.getElementById('receiptTotal').textContent = tx.totalPrice.toLocaleString() + ' ج.م';

        // Color the border of receipt paper based on type
        document.getElementById('receiptPaper').style.borderColor = isSell ? 'rgba(255,59,48,0.3)' : 'rgba(52,199,89,0.3)';

        document.getElementById('receiptModal').classList.add('active');
    };

    window.downloadCurrentReceipt = function () {
        if (!currentReceiptTx) return;
        const paper = document.getElementById('receiptPaper');
        html2canvas(paper, {
            scale: 4,
            backgroundColor: '#0d0d0f',
            useCORS: true
        }).then(canvas => {
            const link = document.createElement('a');
            const name = currentReceiptTx.customerName || 'عميل';
            link.download = `فاتورة_${name}_${currentReceiptTx.timestamp}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    };

    // --- Actions & Modals ---

    window.toggleWithdrawModal = function () {
        modalWithdraw.classList.add('active');
    };

    window.closeModals = function () {
        modalTransaction.classList.remove('active');
        modalWithdraw.classList.remove('active');
    };

    window.submitWithdraw = function () {
        const amount = parseFloat(document.getElementById('withdrawAmount').value);
        const type = document.getElementById('withdrawType').value;
        if (!amount || amount <= 0) return alert('ادخل مبلغ صحيح');

        const now = new Date();
        const h = {
            amount: amount,
            date: now.toLocaleDateString('ar-EG'),
            time: now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
            timestamp: Date.now()
        };

        treasury[type].history.unshift(h);
        saveMemory();
        updateTreasuryUI();
        closeModals();
        document.getElementById('withdrawAmount').value = '';
    };

    window.exportToCSV = function () {
        let csv = '\uFEFFالتاريخ,الوقت,اسم العميل,النوع,الوزن,سعر الجرام,الإجمالي,كاش,فودافون,انستا\n';
        allTransactions.forEach(t => csv += `${t.day} ${t.monthName},${t.time},${t.customerName || 'عميل نقدي'},${t.type},${t.weight},${t.gramPrice || ''},${t.totalPrice},${t.cash},${t.vodafone},${t.instapay}\n`);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `تقرير_المستشار_الذهبي_${new Date().toLocaleDateString()}.csv`;
        link.click();
    };

    // --- Event Listeners ---

    document.querySelectorAll('.pill[data-type]').forEach(p => {
        p.addEventListener('click', () => {
            document.querySelectorAll('.pill').forEach(x => x.classList.remove('active'));
            p.classList.add('active');
            selectedType = p.getAttribute('data-type');

            // Auto open transaction modal
            modalTransaction.classList.add('active');
            document.getElementById('modalTitle').innerText = `تسجيل عملية ${selectedType === 'gold' ? 'ذهب' : 'فضة'}`;
        });
    });

    document.querySelectorAll('.option-btn').forEach(b => {
        b.addEventListener('click', () => {
            b.parentElement.querySelectorAll('.option-btn').forEach(x => x.classList.remove('active'));
            b.classList.add('active');
        });
    });

    // --- Smart Payment Split Logic ---
    const cashInput = document.querySelector('.payment-input[data-type="cash"]');
    const vdfInput = document.querySelector('.payment-input[data-type="vodafone"]');
    const instaInput = document.querySelector('.payment-input[data-type="instapay"]');
    const payInputs = document.querySelectorAll('.payment-input');

    function getLockedTotal() {
        return parseFloat(document.getElementById('priceInput').value) || 0;
    }

    function redistributePayments() {
        const total = getLockedTotal();
        if (total <= 0) return;
        const vdf = parseFloat(vdfInput.value) || 0;
        const insta = parseFloat(instaInput.value) || 0;
        const remaining = Math.max(0, total - vdf - insta);
        cashInput.value = remaining > 0 ? remaining : 0;
        document.getElementById('totalPaid').innerText = total;
    }

    // When vodafone or instapay changes → recalculate cash
    vdfInput.addEventListener('input', redistributePayments);
    instaInput.addEventListener('input', redistributePayments);

    // When cash is edited manually → just show sum (override mode)
    cashInput.addEventListener('input', () => {
        const total = (parseFloat(cashInput.value) || 0)
            + (parseFloat(vdfInput.value) || 0)
            + (parseFloat(instaInput.value) || 0);
        document.getElementById('totalPaid').innerText = total;
        document.getElementById('priceInput').value = total > 0 ? total : '';
    });

    // Auto calculate TOTAL from gram price and weight, then seed cash
    ['weightInput', 'gramPriceInput'].forEach(id => {
        document.getElementById(id).addEventListener('input', () => {
            const weight = parseFloat(document.getElementById('weightInput').value) || 0;
            const gramPrice = parseFloat(document.getElementById('gramPriceInput').value) || 0;
            if (weight > 0 && gramPrice > 0) {
                const total = weight * gramPrice;
                document.getElementById('priceInput').value = total;
                // Seed cash with full amount (vodafone & instapay will override)
                vdfInput.value = vdfInput.value || '';
                instaInput.value = instaInput.value || '';
                redistributePayments();
            }
        });
    });

    document.getElementById('invoiceSearch').addEventListener('input', (e) => {
        renderInvoicesContent(e.target.value);
    });

    document.getElementById('confirmProcess').addEventListener('click', () => {
        const weight = document.getElementById('weightInput').value;
        const price = document.getElementById('priceInput').value;
        const gramPrice = document.getElementById('gramPriceInput').value;
        const customerName = document.getElementById('customerNameInput').value;
        const isSell = document.querySelector('.option-btn[data-val="بيع"]').classList.contains('active');

        if (!weight || !price) return alert('برجاء اكمال البيانات');

        const now = getActiveDateTime();
        const tx = {
            type: `${isSell ? 'بيع' : 'شراء'} ${selectedType === 'gold' ? 'ذهب' : 'فضة'}`,
            isSell: isSell,
            weight: weight,
            totalPrice: parseFloat(price),
            gramPrice: parseFloat(gramPrice) || 0,
            customerName: customerName.trim(),
            cash: parseFloat(document.querySelector('.payment-input[data-type="cash"]').value) || 0,
            vodafone: parseFloat(document.querySelector('.payment-input[data-type="vodafone"]').value) || 0,
            instapay: parseFloat(document.querySelector('.payment-input[data-type="instapay"]').value) || 0,
            day: now.getDate(),
            monthName: now.toLocaleDateString('ar-EG', { month: 'long' }),
            time: now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
            timestamp: Date.now()
        };

        allTransactions.unshift(tx);
        saveMemory();
        renderCardToDOM(tx, true);
        updateStockUI();
        updateTreasuryUI();
        closeModals();
        showReceiptModal(tx);

        // Reset fields
        document.getElementById('weightInput').value = '';
        document.getElementById('priceInput').value = '';
        document.getElementById('gramPriceInput').value = '';
        document.getElementById('customerNameInput').value = '';
        payInputs.forEach(i => i.value = '');
        document.getElementById('totalPaid').innerText = '0';
    });

    // --- Screenshot 4K Hook ---
    window.takeScreenshot = function (auto = false) {
        const target = document.body;
        html2canvas(target, {
            scale: 3, // Premium quality
            backgroundColor: '#0a0a0c',
            useCORS: true
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = `تقرير_جرد_${new Date().toLocaleDateString()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    }

    // --- Github PC Installer Hook ---
    window.downloadGithubInstaller = function() {
        const url = prompt("أدخل رابط التطبيق الدائم المرفوع على GitHub\n(مثال: https://username.github.io/repo/):", "https://");
        if(!url || url === "https://" || !url.startsWith("http")) return;
        
        const vbsContent = `Set WshShell = CreateObject("WScript.Shell")
strDesktop = WshShell.SpecialFolders("Desktop")
Set oShellLink = WshShell.CreateShortcut(strDesktop & "\\المستشار الذهبي.lnk")
oShellLink.TargetPath = "chrome.exe"
oShellLink.Arguments = "--app=" & "${url}" & " --window-size=1400,900"
oShellLink.WindowStyle = 1
oShellLink.Description = "المستشار الذهبي - نظام نقاط البيع"
oShellLink.Save
MsgBox "تم تثبيت اختصار المستشار الذهبي بنجاح على سطح المكتب! يمكنك الآن تشغيله مباشرة.", 64, "إتمام التثبيت"
`;
        
        const blob = new Blob(['\uFEFF' + vbsContent], { type: 'text/vbs;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "تثبيت_المستشار_الذهبي.vbs";
        link.click();
    };

    // --- PWA Logic ---
    let deferredPrompt;
    const installBtn = document.getElementById('pwaInstallBtn');

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        if (installBtn) {
            installBtn.style.display = 'flex';
        }
    });

    window.installPWA = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        deferredPrompt = null;
        if (installBtn) installBtn.style.display = 'none';
    };

    window.addEventListener('appinstalled', (evt) => {
        if (installBtn) installBtn.style.display = 'none';
    });

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then(reg => console.log('Service Worker Registered'))
                .catch(err => console.log('Service Worker Failed', err));
        });
    }

    // --- Initialization ---
    updateLiveClock();
    updateStockUI();
    updateTreasuryUI();
    allTransactions.slice().reverse().forEach(t => renderCardToDOM(t));
});
