export enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}

export interface User {
  id: string;
  userId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  username: string;
  email: string;
  password?: string;
  phone?: string;
  gender?: Gender;
  dateOfBirth?: string;
  avatar?: string;
  passwordLastChangedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
