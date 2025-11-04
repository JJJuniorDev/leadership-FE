export interface Contract {
  id: string;            // id come stringa
  userId: string;        // id dell'utente che ha caricato il contratto
  fileName: string;
   uploadDate: Date;   
  status: 'caricato' | 'analizzato' | 'errore';
  totalAmount?: number;
  startDate: Date;
  endDate: Date;
   contractType: string;
   
}