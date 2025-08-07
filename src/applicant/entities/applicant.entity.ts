import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum ApplicantStatus {
  APPLIED = 'applied',
  REVIEWED = 'reviewed',
  REJECTED = 'rejected',
  HIRED = 'hired',
}

@Entity()
export class Applicant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone?: string;

  @Column()
  position: string;

  @Column({ type: 'enum', enum: ApplicantStatus, default: ApplicantStatus.APPLIED })
  status: ApplicantStatus;

  @Column()
  resumeUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
