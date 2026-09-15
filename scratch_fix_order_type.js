const fs = require('fs');
const path = 'josdy/src/pages/admin/AdminOrdersPage.jsx';
let code = fs.readFileSync(path, 'utf8');

// Replace all occurrences of o.order_type === 'shipping'
code = code.replace(/ && o\.order_type === 'shipping'/g, '');
code = code.replace(/orders\.filter\(o => o\.order_type === 'shipping'\)/g, 'orders');
code = code.replace(/shippingOrders\.filter\(o => o\.status === s\)/g, 'orders.filter(o => o.status === s)');
code = code.replace(/const shippingOrders = orders;/g, ''); // in case I put it there
code = code.replace(/const shippingOrders = orders.filter\(o => o.order_type === 'shipping'\);/g, 'const shippingOrders = orders;');

fs.writeFileSync(path, code);
console.log('Fixed order_type filter');
