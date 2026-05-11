export type TransactionType = 'Booking' | 'Top-up' | 'Refund' | 'Withdrawal';

export interface Transaction {
  id: string;
  referenceId: string;
  type: TransactionType;
  amount: number;
  date: string;
  time: string;
  description: string;
  professionalName?: string;
  category?: string;
}

export interface WalletStats {
  balance: number;
  totalWithdrawal: number;
  totalEarned: number;
  email: string;
}
