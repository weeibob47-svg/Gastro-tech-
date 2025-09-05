
import { Order, OrderStatus, MenuItem, MenuItemCategory, Table, TableStatus, Reservation, ReservationStatus, InventoryItem, StockUnit, StaffMember, StaffRole, StaffStatus, Purchase, PurchaseStatus } from '../types';

export const MOCK_MENU_ITEMS: MenuItem[] = [
  { id: '1', name: 'Bruschetta Classique', description: 'Pain grillé frotté à l\'ail et garni de tomates fraîches, basilic et huile d\'olive.', price: 8.50, category: MenuItemCategory.Entree, imageUrl: 'https://picsum.photos/id/20/400/300' },
  { id: '2', name: 'Salade César', description: 'Laitue romaine croquante, croûtons à l\'ail, copeaux de parmesan et notre vinaigrette César maison.', price: 12.00, category: MenuItemCategory.Entree, imageUrl: 'https://picsum.photos/id/30/400/300' },
  { id: '3', name: 'Filet de Boeuf', description: 'Tendre filet de bœuf grillé à la perfection, servi avec une sauce au poivre et des pommes de terre grenaille.', price: 28.00, category: MenuItemCategory.PlatPrincipal, imageUrl: 'https://picsum.photos/id/40/400/300' },
  { id: '4', name: 'Burger Gourmet', description: 'Steak haché de bœuf, cheddar maturé, oignons caramélisés, bacon croustillant et sauce secrète.', price: 18.50, category: MenuItemCategory.PlatPrincipal, imageUrl: 'https://picsum.photos/id/50/400/300' },
  { id: '5', name: 'Risotto aux Champignons', description: 'Risotto crémeux aux champignons sauvages, huile de truffe et parmesan.', price: 21.00, category: MenuItemCategory.PlatPrincipal, imageUrl: 'https://picsum.photos/id/60/400/300' },
  { id: '6', name: 'Tiramisu', description: 'Le classique dessert italien, crémeux et riche en café.', price: 9.00, category: MenuItemCategory.Dessert, imageUrl: 'https://picsum.photos/id/70/400/300' },
  { id: '7', name: 'Fondant au Chocolat', description: 'Cœur coulant au chocolat noir, servi avec une boule de glace vanille.', price: 9.50, category: MenuItemCategory.Dessert, imageUrl: 'https://picsum.photos/id/80/400/300' },
  { id: '8', name: 'Mojito Royal', description: 'Rhum, menthe fraîche, citron vert, sucre de canne, et une touche de champagne.', price: 12.00, category: MenuItemCategory.Cocktail, imageUrl: 'https://picsum.photos/id/90/400/300' },
  { id: '9', name: 'Old Fashioned', description: 'Whiskey, sucre, Angostura bitters et un zeste d\'orange.', price: 11.00, category: MenuItemCategory.Cocktail, imageUrl: 'https://picsum.photos/id/100/400/300' },
  { id: '10', name: 'Vin Rouge - Bordeaux', description: 'Un verre de notre sélection du mois.', price: 7.00, category: MenuItemCategory.Boisson, imageUrl: 'https://picsum.photos/id/110/400/300' },
];

const now = Date.now();
const minutes = (m: number) => 1000 * 60 * m;
const hours = (h: number) => minutes(60) * h;
const days = (d: number) => hours(24) * d;

export const MOCK_ORDERS: Order[] = [
  // Today's orders
  {
    id: 'ORD001', tableNumber: 5, items: [{ id: '3', name: 'Filet de Boeuf', quantity: 1, price: 28.00 }, { id: '10', name: 'Vin Rouge - Bordeaux', quantity: 1, price: 7.00 },], total: 35.00, status: OrderStatus.New, timestamp: new Date(now - minutes(5)).toISOString(),
  },
  {
    id: 'ORD002', tableNumber: 2, items: [{ id: '4', name: 'Burger Gourmet', quantity: 2, price: 18.50 }, { id: '8', name: 'Mojito Royal', quantity: 2, price: 12.00 },], total: 61.00, status: OrderStatus.InProgress, timestamp: new Date(now - minutes(15)).toISOString(),
  },
  {
    id: 'ORD003', tableNumber: 12, items: [{ id: '6', name: 'Tiramisu', quantity: 1, price: 9.00 },], total: 9.00, status: OrderStatus.Completed, timestamp: new Date(now - minutes(30)).toISOString(),
  },
  {
    id: 'ORD004', tableNumber: 8, items: [{ id: '1', name: 'Bruschetta Classique', quantity: 1, price: 8.50 }, { id: '5', name: 'Risotto aux Champignons', quantity: 1, price: 21.00 },], total: 29.50, status: OrderStatus.Paid, timestamp: new Date(now - hours(1)).toISOString(),
  },
   {
    id: 'ORD005', tableNumber: 3, items: [{ id: '9', name: 'Old Fashioned', quantity: 2, price: 11.00 },], total: 22.00, status: OrderStatus.New, timestamp: new Date(now - minutes(2)).toISOString(),
  },
  // Yesterday's orders
  {
    id: 'ORD101', tableNumber: 1, items: [{ id: '4', name: 'Burger Gourmet', quantity: 2, price: 18.50 },], total: 37.00, status: OrderStatus.Paid, timestamp: new Date(now - days(1) - hours(2)).toISOString(),
  },
  {
    id: 'ORD102', tableNumber: 7, items: [{ id: '5', name: 'Risotto aux Champignons', quantity: 1, price: 21.00 }, { id: '2', name: 'Salade César', quantity: 1, price: 12.00 },], total: 33.00, status: OrderStatus.Paid, timestamp: new Date(now - days(1) - hours(3)).toISOString(),
  },
  // 2 days ago
   {
    id: 'ORD201', tableNumber: 10, items: [{ id: '8', name: 'Mojito Royal', quantity: 4, price: 12.00 },], total: 48.00, status: OrderStatus.Paid, timestamp: new Date(now - days(2) - hours(4)).toISOString(),
  },
  // 3 days ago (weekend simulation)
  {
    id: 'ORD301', tableNumber: 15, items: [{ id: '3', name: 'Filet de Boeuf', quantity: 2, price: 28.00 }, { id: '10', name: 'Vin Rouge - Bordeaux', quantity: 2, price: 7.00 }, { id: '7', name: 'Fondant au Chocolat', quantity: 2, price: 9.50 }], total: 89.00, status: OrderStatus.Paid, timestamp: new Date(now - days(3) - hours(1)).toISOString(),
  },
  {
    id: 'ORD302', tableNumber: 16, items: [{ id: '4', name: 'Burger Gourmet', quantity: 4, price: 18.50 },], total: 74.00, status: OrderStatus.Paid, timestamp: new Date(now - days(3) - hours(2)).toISOString(),
  },
];

export const MOCK_TABLES: Table[] = [
    { id: 1, status: TableStatus.Available, capacity: 2 },
    { id: 2, status: TableStatus.Occupied, orderId: 'ORD002', capacity: 4 },
    { id: 3, status: TableStatus.Occupied, orderId: 'ORD005', capacity: 2 },
    { id: 4, status: TableStatus.Available, capacity: 6 },
    { id: 5, status: TableStatus.Occupied, orderId: 'ORD001', capacity: 2 },
    { id: 6, status: TableStatus.Reserved, reservationId: 'RES001', capacity: 4 },
    { id: 7, status: TableStatus.Available, capacity: 2 },
    { id: 8, status: TableStatus.Available, capacity: 4 },
    { id: 9, status: TableStatus.Available, capacity: 8 },
    { id: 10, status: TableStatus.Reserved, reservationId: 'RES002', capacity: 4 },
    { id: 11, status: TableStatus.Available, capacity: 2 },
    { id: 12, status: TableStatus.Available, capacity: 4 },
    { id: 13, status: TableStatus.Available, capacity: 2 },
    { id: 14, status: TableStatus.Available, capacity: 4 },
    { id: 15, status: TableStatus.Reserved, reservationId: 'RES003', capacity: 6 },
    { id: 16, status: TableStatus.Available, capacity: 2 },
    { id: 17, status: TableStatus.Available, capacity: 4 },
    { id: 18, status: TableStatus.Available, capacity: 2 },
    { id: 19, status: TableStatus.Available, capacity: 8 },
    { id: 20, status: TableStatus.Available, capacity: 4 },
];


export const MOCK_RESERVATIONS: Reservation[] = [
    {
        id: 'RES001',
        customerName: 'Alice Martin',
        phoneNumber: '0612345678',
        guestCount: 2,
        reservationTime: new Date(now + hours(3)).toISOString(),
        status: ReservationStatus.Confirmed,
        tableId: 6,
    },
    {
        id: 'RES002',
        customerName: 'Bob Dupont',
        phoneNumber: '0687654321',
        guestCount: 4,
        reservationTime: new Date(now + hours(4.5)).toISOString(),
        status: ReservationStatus.Confirmed,
        tableId: 10,
    },
    {
        id: 'RES003',
        customerName: 'Carla Durand',
        phoneNumber: '0611223344',
        guestCount: 6,
        reservationTime: new Date(now + days(1) + hours(2)).toISOString(),
        status: ReservationStatus.Confirmed,
        tableId: 15,
    },
    {
        id: 'RES004',
        customerName: 'David Petit',
        phoneNumber: '0655667788',
        guestCount: 2,
        reservationTime: new Date(now - hours(24)).toISOString(),
        status: ReservationStatus.Arrived,
    }
];

export const MOCK_INVENTORY_ITEMS: InventoryItem[] = [
    { id: 'inv001', name: 'Filet de Bœuf', stock: 15.5, unit: StockUnit.KG, lowStockThreshold: 10 },
    { id: 'inv002', name: 'Tomates Roma', stock: 25, unit: StockUnit.KG, lowStockThreshold: 15 },
    { id: 'inv003', name: 'Laitue Romaine', stock: 8, unit: StockUnit.Pieces, lowStockThreshold: 10 },
    { id: 'inv004', name: 'Pain Burger', stock: 40, unit: StockUnit.Pieces, lowStockThreshold: 24 },
    { id: 'inv005', name: 'Vin Rouge Bordeaux', stock: 12, unit: StockUnit.Bottles, lowStockThreshold: 6 },
    { id: 'inv006', name: 'Rhum Blanc', stock: 5, unit: StockUnit.Liters, lowStockThreshold: 3 },
    { id: 'inv007', name: 'Chocolat Noir 70%', stock: 2, unit: StockUnit.KG, lowStockThreshold: 5 },
    { id: 'inv008', name: 'Riz Arborio', stock: 18, unit: StockUnit.KG, lowStockThreshold: 10 },
];

export const MOCK_STAFF_MEMBERS: StaffMember[] = [
    { id: 'staff001', name: 'Jean Dupont', role: StaffRole.Manager, hourlyRate: 25.50, status: StaffStatus.Actif },
    { id: 'staff002', name: 'Marie Curie', role: StaffRole.Serveur, hourlyRate: 15.00, status: StaffStatus.Actif },
    { id: 'staff003', name: 'Pierre Martin', role: StaffRole.Cuisinier, hourlyRate: 18.75, status: StaffStatus.Actif },
    { id: 'staff004', name: 'Sophie Bernard', role: StaffRole.Barman, hourlyRate: 16.20, status: StaffStatus.Actif },
    { id: 'staff005', name: 'Lucas Petit', role: StaffRole.Serveur, hourlyRate: 15.00, status: StaffStatus.Inactif },
];

export const MOCK_PURCHASES: Purchase[] = [
    {
        id: 'ACH001',
        supplier: 'Metro Cash & Carry',
        itemsDescription: '20kg Filet de Bœuf, 50kg Tomates Roma',
        totalCost: 625.00,
        purchaseDate: new Date(now - days(2)).toISOString(),
        status: PurchaseStatus.Completed,
    },
    {
        id: 'ACH002',
        supplier: 'Boissons & Co',
        itemsDescription: '24x Vin Rouge Bordeaux, 12L Rhum Blanc',
        totalCost: 288.00,
        purchaseDate: new Date(now - days(1)).toISOString(),
        status: PurchaseStatus.Completed,
    },
    {
        id: 'ACH003',
        supplier: 'Le Primeur Local',
        itemsDescription: '30x Laitue Romaine',
        totalCost: 24.00,
        purchaseDate: new Date(now - hours(5)).toISOString(),
        status: PurchaseStatus.Pending,
    },
];