import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IsNumber, IsString } from "class-validator";

@Entity("ip_interview")
export class Interview {

    @PrimaryGeneratedColumn()
    public interviewId?: number;

    @Column()
    @IsString()
    public company: string;

    @Column()
    @IsString()
    public appliedFrom: string;

    @Column()
    public appliedOn: Date;

    @Column()
    public role: string;

    @Column({
        type: "tinyint"
    })
    public response: boolean;

    @Column({
        type: "tinyint"
    })
    public referral: boolean;

    @Column()
    public recruiterPOC: string;

    @Column()
    public outcome: string;

    @Column()
    public outcomeDate: Date;

    @Column()
    public createdDatetime: Date;

    @Column()
    public createdBy: string;

    @Column()
    public modifiedDatetime: Date;

    @Column()
    public modifiedBy: string;

    @Column({
        type: "tinyint"
    })
    public isActive: boolean;
}