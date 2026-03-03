export interface Task {
  id: string;
  title: string;
  subject: string;
  dueDate: string; // ISO string format
  platform: string;
  status: 'pending' | 'completed';
  createdAt: string; // ISO string format
}