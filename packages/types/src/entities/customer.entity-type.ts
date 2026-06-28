export interface ICustomerEntity {
  id: string;
  enterpriseId: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  country: string | null;
  mergedInto?: string | null;
  contactIdentifiers?: IContactIdentifierEntity[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export type ContactChannel =
  | 'WHATSAPP'
  | 'INSTAGRAM'
  | 'FACEBOOK'
  | 'TELEGRAM'
  | 'EMAIL'
  | 'PHONE';

export interface IContactIdentifierEntity {
  id: string;
  customerId: string;
  socialMidiaId: number;
  channel: ContactChannel;
  primaryIdentifier: string;
  secondaryIdentifier: string | null;
  phone: string | null;
  country: string | null;
  displayName: string | null;
  metadata: Record<string, unknown> | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
