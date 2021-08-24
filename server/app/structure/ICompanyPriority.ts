interface ICompanyPriority {
    companyPriorityId: number;
    company: string;
    priority: number;
    createdDatetime?: Date;
    createdBy?: string;
    modifiedDatetime?: Date;
    modifiedBy?: string;
    isActive?: boolean;
}

export default ICompanyPriority;