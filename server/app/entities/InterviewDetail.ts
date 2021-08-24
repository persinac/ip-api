import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { IsNumber, IsString } from "class-validator";
import { Interview } from "./Interview";

@Entity("ip_interview_detail")
export class InterviewDetail {

    @PrimaryGeneratedColumn()
    public interviewDetailId?: number;

    @Column()
    public interviewId: number;

    @Column()
    public interviewDate: Date;

    @Column()
    @IsNumber()
    public interviewRound: number;

    @Column()
    @IsString()
    public interviewer: string;

    @Column()
    @IsString()
    public interviewerRole: string;

    @Column()
    public difficulty: string;

    @Column()
    public question: string;

    @Column()
    public feedback: string;

    @Column()
    public outcome: number;

    @Column()
    public outcomeDate: Date;

    @Column()
    public decision: number;

    @Column()
    public decisionDate: Date;

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

    @ManyToOne(() => Interview)
    @JoinColumn({
        name: "interviewId",
        referencedColumnName: "interviewId"
    })
    public interview?: Interview;
}