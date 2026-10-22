export type UserRole = 'admin' | 'manager' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  status: 'active' | 'inactive';
  lastLogin: string;
  avatar: string;
}

// Revenue trend data
export const revenueTrendData = [
  { month: 'Jan', revenue: 980000, orders: 18200 },
  { month: 'Feb', revenue: 1050000, orders: 19500 },
  { month: 'Mar', revenue: 1120000, orders: 21000 },
  { month: 'Apr', revenue: 1080000, orders: 20100 },
  { month: 'May', revenue: 1150000, orders: 21800 },
  { month: 'Jun', revenue: 1090000, orders: 20500 },
  { month: 'Jul', revenue: 1200000, orders: 22400 },
  { month: 'Aug', revenue: 1160000, orders: 21700 },
  { month: 'Sep', revenue: 1250000, orders: 23500 },
  { month: 'Oct', revenue: 1180000, orders: 22100 },
  { month: 'Nov', revenue: 1280000, orders: 24892 },
  { month: 'Dec', revenue: 1320000, orders: 25100 },
];

export const categoryData = [
  { category: 'Toys & Games', revenue: 342000, growth: 18.2 },
  { category: 'Electronics', revenue: 289000, growth: 12.4 },
  { category: 'Sports & Outdoors', revenue: 198000, growth: 8.7 },
  { category: 'Arts & Crafts', revenue: 167000, growth: -2.1 },
  { category: 'Educational', revenue: 145000, growth: 22.3 },
  { category: 'Dolls & Plush', revenue: 132000, growth: 5.6 },
  { category: 'Building Sets', revenue: 107000, growth: 15.8 },
];

export const topProducts = [
  { rank: 1, name: 'Lego City Police Station', category: 'Building Sets', units: 2840, revenue: 284000, growth: 24.1 },
  { rank: 2, name: 'Action Figure Set XL', category: 'Toys & Games', units: 3120, revenue: 249600, growth: 18.7 },
  { rank: 3, name: 'Remote Control Car Pro', category: 'Electronics', units: 1980, revenue: 237600, growth: 31.2 },
  { rank: 4, name: 'Educational Tablet Kids', category: 'Educational', units: 890, revenue: 213600, growth: 42.1 },
  { rank: 5, name: 'Barbie Dream House', category: 'Dolls & Plush', units: 1240, revenue: 198400, growth: 8.9 },
  { rank: 6, name: 'Outdoor Adventure Set', category: 'Sports & Outdoors', units: 2100, revenue: 189000, growth: -1.2 },
  { rank: 7, name: 'Art Supply Mega Kit', category: 'Arts & Crafts', units: 3400, revenue: 170000, growth: 12.4 },
  { rank: 8, name: 'Puzzle Collection 1000pc', category: 'Educational', units: 2650, revenue: 159000, growth: 19.3 },
  { rank: 9, name: 'Science Lab Kit', category: 'Educational', units: 1120, revenue: 145600, growth: 28.7 },
  { rank: 10, name: 'Stuffed Animal Collection', category: 'Dolls & Plush', units: 4200, revenue: 126000, growth: 3.4 },
];

export const storePerformance = [
  { store: 'Store 12 - HCMC', revenue: 312000, target: 290000, orders: 5840, rating: 4.8 },
  { store: 'Store 07 - Hanoi', revenue: 287000, target: 280000, orders: 5210, rating: 4.6 },
  { store: 'Store 15 - Da Nang', revenue: 243000, target: 260000, orders: 4580, rating: 4.3 },
  { store: 'Store 03 - Can Tho', revenue: 198000, target: 200000, orders: 3920, rating: 4.5 },
  { store: 'Store 09 - Hue', revenue: 176000, target: 180000, orders: 3340, rating: 4.2 },
  { store: 'Store 21 - Hai Phong', revenue: 162000, target: 170000, orders: 3008, rating: 4.1 },
];

export const inventoryStatus = [
  { name: 'Healthy', value: 68, color: '#059669' },
  { name: 'Low Stock', value: 22, color: '#D97706' },
  { name: 'Critical', value: 10, color: '#DC2626' },
];

export const users: User[] = [
  { id: '1', name: 'Nguyễn Văn A', email: 'nguyen.vana@company.com', role: 'admin', department: 'IT', status: 'active', lastLogin: '10 phút trước', avatar: 'NV' },
  { id: '2', name: 'Trần Thị B', email: 'tran.thib@company.com', role: 'manager', department: 'Operations', status: 'active', lastLogin: '1 giờ trước', avatar: 'TT' },
  { id: '3', name: 'Lê Văn C', email: 'le.vanc@company.com', role: 'user', department: 'Sales', status: 'active', lastLogin: '3 giờ trước', avatar: 'LV' },
  { id: '4', name: 'Phạm Thị D', email: 'pham.thid@company.com', role: 'user', department: 'HR', status: 'active', lastLogin: 'Hôm qua', avatar: 'PT' },
  { id: '5', name: 'Hoàng Văn E', email: 'hoang.vane@company.com', role: 'manager', department: 'Finance', status: 'active', lastLogin: '2 giờ trước', avatar: 'HV' },
  { id: '6', name: 'Vũ Thị F', email: 'vu.thif@company.com', role: 'user', department: 'Inventory', status: 'inactive', lastLogin: '5 ngày trước', avatar: 'VT' },
  { id: '7', name: 'Đặng Văn G', email: 'dang.vang@company.com', role: 'user', department: 'Sales', status: 'active', lastLogin: '30 phút trước', avatar: 'ĐV' },
  { id: '8', name: 'Bùi Thị H', email: 'bui.thih@company.com', role: 'manager', department: 'Operations', status: 'active', lastLogin: '4 giờ trước', avatar: 'BT' },
];

export const auditLogs = [
  { id: '1', timestamp: '09:42 AM, Nov 25', user: 'Nguyễn Văn A', question: 'Doanh thu theo từng cửa hàng trong quý này?', sql: 'SELECT store_name, SUM(revenue) FROM sales GROUP BY store_name', source: 'Maven Toys DB', execTime: '1.2s', status: 'success', rows: 21 },
  { id: '2', timestamp: '09:38 AM, Nov 25', user: 'Trần Thị B', question: 'Top 10 sản phẩm bán chạy nhất tháng này?', sql: 'SELECT product_name, SUM(quantity) FROM sales WHERE MONTH(date)=11 GROUP BY product_name ORDER BY 2 DESC LIMIT 10', source: 'Maven Toys DB', execTime: '0.8s', status: 'success', rows: 10 },
  { id: '3', timestamp: '09:15 AM, Nov 25', user: 'Lê Văn C', question: 'Sản phẩm nào có doanh thu giảm mạnh nhất?', sql: 'SELECT product_name, (curr-prev)/prev*100 as growth FROM...', source: 'Maven Toys DB', execTime: '2.1s', status: 'corrected', rows: 5 },
  { id: '4', timestamp: '08:55 AM, Nov 25', user: 'Phạm Thị D', question: 'Tồn kho hiện tại của danh mục Electronics?', sql: 'SELECT product_name, stock_qty FROM inventory JOIN products ON...', source: 'Maven Toys DB', execTime: '0.6s', status: 'success', rows: 48 },
  { id: '5', timestamp: '08:32 AM, Nov 25', user: 'Hoàng Văn E', question: 'So sánh doanh thu tháng 10 và tháng 11?', sql: 'SELECT MONTH(date), SUM(revenue) FROM sales WHERE MONTH(date) IN (10,11)', source: 'Maven Toys DB', execTime: '1.5s', status: 'failed', rows: 0 },
  { id: '6', timestamp: '08:15 AM, Nov 25', user: 'Vũ Thị F', question: 'Cửa hàng nào có hiệu suất tốt nhất Q4?', sql: 'SELECT store_name, SUM(revenue) FROM sales WHERE quarter=4 GROUP BY store_name ORDER BY 2 DESC', source: 'Maven Toys DB', execTime: '0.9s', status: 'success', rows: 21 },
];

export const knowledgeDocs = [
  { id: '1', name: 'Store Operation SOP.pdf', type: 'PDF', status: 'indexed', uploadedBy: 'HR Manager', chunks: 142, updated: 'Sep 12, 2026', access: 'Store Managers' },
  { id: '2', name: 'Expired Product Policy.pdf', type: 'PDF', status: 'indexed', uploadedBy: 'Operations', chunks: 67, updated: 'Oct 5, 2026', access: 'All Staff' },
  { id: '3', name: 'Inventory Management Guide.docx', type: 'DOCX', status: 'indexed', uploadedBy: 'Warehouse Mgr', chunks: 89, updated: 'Nov 1, 2026', access: 'Warehouse' },
  { id: '4', name: 'Sales Incentive Policy 2026.pdf', type: 'PDF', status: 'indexed', uploadedBy: 'HR Manager', chunks: 34, updated: 'Jan 15, 2026', access: 'Sales Staff' },
  { id: '5', name: 'Customer Return Procedure.pdf', type: 'PDF', status: 'indexing', uploadedBy: 'Customer Svc', chunks: 0, updated: 'Nov 25, 2026', access: 'Customer Service' },
  { id: '6', name: 'Product Catalog Q4 2026.xlsx', type: 'XLSX', status: 'error', uploadedBy: 'Product Mgr', chunks: 0, updated: 'Nov 20, 2026', access: 'All Staff' },
];

export const glossaryTerms = [
  { id: '1', term: 'Doanh thu', field: 'sales.revenue', synonyms: 'revenue, sales amount, doanh số', definition: 'Tổng giá trị bán hàng đã hoàn thành', formula: 'quantity × unit_price', status: 'active' },
  { id: '2', term: 'Lợi nhuận gộp', field: 'sales.gross_profit', synonyms: 'gross profit, lãi gộp', definition: 'Doanh thu trừ giá vốn hàng bán', formula: 'revenue - cost_of_goods', status: 'active' },
  { id: '3', term: 'Tỷ lệ chuyển đổi', field: 'analytics.conversion_rate', synonyms: 'conversion rate, chuyển đổi', definition: 'Tỷ lệ khách hàng thực sự mua hàng', formula: 'orders / visits × 100', status: 'active' },
  { id: '4', term: 'Giá trị đơn hàng trung bình', field: 'orders.aov', synonyms: 'AOV, average order value, GTTB', definition: 'Giá trị trung bình mỗi đơn hàng', formula: 'total_revenue / total_orders', status: 'active' },
  { id: '5', term: 'Hàng tồn kho', field: 'inventory.stock_qty', synonyms: 'stock, inventory, tồn kho', definition: 'Số lượng sản phẩm còn trong kho', formula: null, status: 'active' },
  { id: '6', term: 'Ngày quay vòng tồn kho', field: 'inventory.days_on_hand', synonyms: 'inventory turnover, vòng quay hàng tồn', definition: 'Số ngày trung bình để bán hết hàng tồn kho', formula: 'avg_inventory / daily_sales', status: 'draft' },
];

export const aiUsageData = [
  { date: 'Nov 19', tokens: 180000, requests: 210, cost: 1.8 },
  { date: 'Nov 20', tokens: 220000, requests: 245, cost: 2.2 },
  { date: 'Nov 21', tokens: 195000, requests: 228, cost: 1.95 },
  { date: 'Nov 22', tokens: 160000, requests: 189, cost: 1.6 },
  { date: 'Nov 23', tokens: 140000, requests: 162, cost: 1.4 },
  { date: 'Nov 24', tokens: 240000, requests: 278, cost: 2.4 },
  { date: 'Nov 25', tokens: 280000, requests: 312, cost: 2.8 },
];

export const activityData = [
  { time: '08:00', queries: 12, logins: 8, ai: 15 },
  { time: '09:00', queries: 34, logins: 22, ai: 41 },
  { time: '10:00', queries: 58, logins: 15, ai: 67 },
  { time: '11:00', queries: 72, logins: 8, ai: 85 },
  { time: '12:00', queries: 45, logins: 5, ai: 52 },
  { time: '13:00', queries: 38, logins: 12, ai: 44 },
  { time: '14:00', queries: 89, logins: 18, ai: 102 },
  { time: '15:00', queries: 94, logins: 14, ai: 108 },
  { time: '16:00', queries: 76, logins: 9, ai: 88 },
  { time: '17:00', queries: 42, logins: 6, ai: 49 },
];

export const dataSources = [
  {
    id: '1',
    name: 'Maven Toys Demo Database',
    type: 'PostgreSQL',
    host: 'db.maventoys.demo.local',
    port: 5432,
    database: 'maventoys_retail',
    status: 'connected',
    lastSync: '2 phút trước',
    tables: 12,
    size: '1.4 GB',
  },
  {
    id: '2',
    name: 'Analytics Warehouse',
    type: 'PostgreSQL',
    host: 'analytics.internal',
    port: 5432,
    database: 'analytics_dw',
    status: 'connected',
    lastSync: '15 phút trước',
    tables: 28,
    size: '8.2 GB',
  },
  {
    id: '3',
    name: 'HR Database',
    type: 'MySQL',
    host: 'hr-db.internal',
    port: 3306,
    database: 'hr_system',
    status: 'error',
    lastSync: '3 giờ trước',
    tables: 18,
    size: '420 MB',
  },
];

export const schemaData = {
  tables: ['sales', 'products', 'stores', 'inventory', 'calendar', 'customers', 'categories', 'employees'],
  selectedTable: 'sales',
  columns: [
    { name: 'sale_id', type: 'INTEGER', nullable: false, pk: true, fk: null, description: 'Primary key for sales transaction' },
    { name: 'date', type: 'DATE', nullable: false, pk: false, fk: null, description: 'Transaction date' },
    { name: 'store_id', type: 'INTEGER', nullable: false, pk: false, fk: 'stores.store_id', description: 'Reference to store' },
    { name: 'product_id', type: 'INTEGER', nullable: false, pk: false, fk: 'products.product_id', description: 'Reference to product' },
    { name: 'quantity', type: 'INTEGER', nullable: false, pk: false, fk: null, description: 'Units sold' },
    { name: 'unit_price', type: 'DECIMAL(10,2)', nullable: false, pk: false, fk: null, description: 'Price per unit at time of sale' },
    { name: 'revenue', type: 'DECIMAL(12,2)', nullable: false, pk: false, fk: null, description: 'Total revenue for this line' },
    { name: 'cost', type: 'DECIMAL(12,2)', nullable: true, pk: false, fk: null, description: 'Cost of goods sold' },
  ],
};

export const queryResultData = [
  { store_name: 'Store 12 - HCMC', total_revenue: 312420, prev_revenue: 274580, growth: 13.8 },
  { store_name: 'Store 07 - Hanoi', total_revenue: 287340, prev_revenue: 261200, growth: 10.0 },
  { store_name: 'Store 15 - Da Nang', total_revenue: 243180, prev_revenue: 235600, growth: 3.2 },
  { store_name: 'Store 03 - Can Tho', total_revenue: 198560, prev_revenue: 181200, growth: 9.6 },
  { store_name: 'Store 09 - Hue', total_revenue: 176420, prev_revenue: 168900, growth: 4.5 },
  { store_name: 'Store 21 - Hai Phong', total_revenue: 162300, prev_revenue: 155400, growth: 4.4 },
];
