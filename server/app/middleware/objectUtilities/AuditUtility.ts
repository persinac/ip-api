import { Interview } from "../../entities/Interview";
import { InterviewDetail } from "../../entities/InterviewDetail";
import { InterviewNote } from "../../entities/InterviewNote";
import { PracticeProblem } from "../../entities/PracticeProblem";

/***
 * Not pleased with the get / set methods here..
 * but unsure how to make these 'act' like a class in the Entity definition(s)
 */
export class AuditUtility {
    public static setNewInterviewValues(interview: Interview): Interview {
        AuditUtility.setAuditValues(interview);
        return interview;
    }

    public static setNewInterviewDetailValues(iDetails: InterviewDetail): InterviewDetail {
        AuditUtility.setAuditValues(iDetails);
        return iDetails;
    }

    public static setNewInterviewNoteValues(note: InterviewNote): InterviewNote {
        AuditUtility.setAuditValues(note);
        return note;
    }

    public static setNewProblemValues(problem: PracticeProblem): PracticeProblem {
        AuditUtility.setAuditValues(problem);
        return problem;
    }

    public static setAuditValues(obj: Interview | InterviewDetail | InterviewNote | PracticeProblem): Interview | InterviewDetail | InterviewNote | PracticeProblem{
        obj.createdDatetime = obj.createdDatetime || new Date();
        obj.modifiedDatetime = obj.createdDatetime || new Date();
        obj.createdBy = obj.createdBy || "SYSTEM";
        obj.modifiedBy = obj.modifiedBy || "SYSTEM";
        obj.isActive = true;

        return obj;
    }
}
