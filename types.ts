
export enum OrderStatus {
  New = 'Nouveau',
  InProgress = 'En préparation',
  Completed = 'Terminé',
  Paid = 'Payé',
  Cancelled = 'Annulé'
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  tableNumber: number;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  timestamp: string;
}

export enum MenuItemCategory {
  Entree = 'Entrée',
  PlatPrincipal = 'Plat Principal',
  Dessert = 'Dessert',
  Boisson = 'Boisson',
  Cocktail = 'Cocktail'
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuItemCategory;
  imageUrl: string;
}

export enum TableStatus {
  Available = 'Disponible',
  Occupied = 'Occupé',
  Reserved = 'Réservé'
}

export interface Table {
  id: number;
  status: TableStatus;
  orderId?: string;
  reservationId?: string;
  capacity: number;
}

export enum ReservationStatus {
  Confirmed = 'Confirmé',
  Arrived = 'Arrivé',
  Cancelled = 'Annulé',
}

export interface Reservation {
  id: string;
  customerName: string;
  phoneNumber: string;
  guestCount: number;
  reservationTime: string;
  status: ReservationStatus;
  tableId?: number;
}

export enum StockUnit {
    KG = 'kg',
    Liters = 'L',
    Pieces = 'pièces',
    Bottles = 'bouteilles',
    Grams = 'g'
}

export enum InventoryStatus {
    InStock = 'En Stock',
    LowStock = 'Stock Bas',
    OutOfStock = 'En Rupture'
}

export interface InventoryItem {
    id: string;
    name: string;
    stock: number;
    unit: StockUnit;
    lowStockThreshold: number;
}

export enum StaffRole {
    Manager = 'Manager',
    Serveur = 'Serveur',
    Cuisinier = 'Cuisinier',
    Barman = 'Barman',
}

export enum StaffStatus {
    Actif = 'Actif',
    Inactif = 'Inactif',
}

export interface StaffMember {
    id: string;
    name: string;
    role: StaffRole;
    hourlyRate: number;
    status: StaffStatus;
}

export enum PurchaseStatus {
    Pending = 'En attente',
    Completed = 'Terminé',
    Cancelled = 'Annulé',
}

export interface Purchase {
    id: string;
    supplier: string;
    itemsDescription: string;
    totalCost: number;
    purchaseDate: string;
    status: PurchaseStatus;
}