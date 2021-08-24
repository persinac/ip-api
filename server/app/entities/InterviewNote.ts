import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { IsString } from "class-validator";
import { InterviewDetail } from "./InterviewDetail";

@Entity("ip_interview_note")
export class InterviewNote {

    @PrimaryGeneratedColumn()
    public interviewNoteId?: number;

    @Column()
    public interviewDetailId: number;

    @Column()
    @IsString()
    public interviewerFeedback: string;

    @Column()
    @IsString()
    public selfFeedback: string;

    @Column()
    @IsString()
    public improveUpon: string;

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

    @ManyToOne(() => InterviewDetail)
    @JoinColumn({
        name: "interviewDetailId",
        referencedColumnName: "interviewDetailId"
    })
    public interviewDetail?: InterviewDetail;
}