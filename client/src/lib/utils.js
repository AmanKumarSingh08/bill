export function numberToWords(amount) {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convertHundreds(n) {
    if (n === 0) return '';
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
    return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + convertHundreds(n % 100) : '');
  }

  const n = Math.round(amount);
  if (n === 0) return 'Zero Rupees only';

  let result = '';
  if (n >= 10000000) {
    result += convertHundreds(Math.floor(n / 10000000)) + ' Crore ';
    const rem = n % 10000000;
    if (rem > 0) result += convertHundreds(Math.floor(rem / 100000)) + ' Lakh ';
    const rem2 = rem % 100000;
    if (rem2 >= 1000) result += convertHundreds(Math.floor(rem2 / 1000)) + ' Thousand ';
    const rem3 = rem2 % 1000;
    if (rem3 > 0) result += convertHundreds(rem3);
  } else if (n >= 100000) {
    result += convertHundreds(Math.floor(n / 100000)) + ' Lakh ';
    const rem = n % 100000;
    if (rem >= 1000) result += convertHundreds(Math.floor(rem / 1000)) + ' Thousand ';
    const rem2 = rem % 1000;
    if (rem2 > 0) result += convertHundreds(rem2);
  } else if (n >= 1000) {
    result += convertHundreds(Math.floor(n / 1000)) + ' Thousand ';
    if (n % 1000 > 0) result += convertHundreds(n % 1000);
  } else {
    result += convertHundreds(n);
  }

  return result.trim() + ' Rupees only';
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

export function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export function todayISO() {
  return new Date().toISOString().split('T')[0];
}
