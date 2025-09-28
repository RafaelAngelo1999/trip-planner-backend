import { z } from 'zod';

export const PassengerSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(10, 'Phone number must have at least 10 digits'),
  dateOfBirth: z.string().date('Invalid date format'),
  passport: z.string().optional(),
  nationality: z.string().min(1, 'Nationality is required'),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type Passenger = z.infer<typeof PassengerSchema>;

export class PassengerEntity {
  constructor(private data: Passenger) {
    this.validate();
  }

  private validate(): void {
    // Validar idade mínima
    const birthDate = new Date(this.data.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();

    if (age < 0 || age > 120) {
      throw new Error('Invalid date of birth');
    }
  }

  // Getters
  get id(): string {
    return this.data.id;
  }
  get firstName(): string {
    return this.data.firstName;
  }
  get lastName(): string {
    return this.data.lastName;
  }
  get email(): string {
    return this.data.email;
  }
  get phone(): string {
    return this.data.phone;
  }
  get dateOfBirth(): string {
    return this.data.dateOfBirth;
  }
  get passport(): string | undefined {
    return this.data.passport;
  }
  get nationality(): string {
    return this.data.nationality;
  }

  // Business methods
  getFullName(): string {
    return `${this.data.firstName} ${this.data.lastName}`;
  }

  getAge(): number {
    const birthDate = new Date(this.data.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  isAdult(): boolean {
    return this.getAge() >= 18;
  }

  isChild(): boolean {
    return this.getAge() < 12;
  }

  requiresPassport(): boolean {
    return this.data.nationality !== 'Brazilian';
  }

  toJSON(): Passenger {
    return { ...this.data };
  }

  static create(
    data: Omit<Passenger, 'id' | 'createdAt' | 'updatedAt'>
  ): PassengerEntity {
    const passenger = PassengerSchema.parse({
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return new PassengerEntity(passenger);
  }

  static fromPrisma(prismaPassenger: any): PassengerEntity {
    return new PassengerEntity({
      id: prismaPassenger.id,
      firstName: prismaPassenger.firstName,
      lastName: prismaPassenger.lastName,
      email: prismaPassenger.email,
      phone: prismaPassenger.phone,
      dateOfBirth: prismaPassenger.dateOfBirth,
      passport: prismaPassenger.passport,
      nationality: prismaPassenger.nationality,
      createdAt: prismaPassenger.createdAt,
      updatedAt: prismaPassenger.updatedAt,
    });
  }
}
