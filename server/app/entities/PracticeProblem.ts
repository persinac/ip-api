import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IsString } from "class-validator";

@Entity("ip_practice_problem")
export class PracticeProblem {

    @PrimaryGeneratedColumn()
    public problemId?: number;

    @Column()
    @IsString()
    public problem: string;

    @Column()
    @IsString()
    public difficulty: string;

    @Column()
    @IsString()
    public where: string;

    @Column()
    @IsString()
    public dateSolved: Date;

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