export interface Question {
  id: string;
  path: string;
  course: string;
  courseOrder: number;
  module: string;
  moduleOrder: number;
  question: string;
  answers: {
    [key: string]: string;
  };
  guess?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}
