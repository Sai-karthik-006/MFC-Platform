export interface CateringResponse {
  id: string;
  customerName: string;
  phone: string;
  email: string | null;
  eventType: string;
  eventDate: Date;
  guestCount: number;
  message: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
