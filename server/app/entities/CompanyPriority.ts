import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IsNumber, IsString } from "class-validator";

@Entity("ip_company_priority")
export class CompanyPriority {

    @PrimaryGeneratedColumn()
    public companyPriorityId?: number;

    @Column()
    @IsString()
    public company: string;

    @Column()
    @IsNumber()
    public priority: number;

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