export const kanoStateConfig = {
    state: 'Kano',
    courtTypes: ['High Court', 'Magistrate Court', 'Sharia Court', 'Appeal Court'],
    standardCategories: ['Civil', 'Criminal', 'Family', 'Labor', 'Regulatory', 'Others'],
    defaultPriority: 'Medium',
    defaultWorkflowStages: ['Intake', 'Review', 'Filing', 'Hearing', 'Closure'],
    categoryCourtMapping: {
        Civil: ['High Court', 'Magistrate Court'],
        Criminal: ['Magistrate Court', 'High Court'],
        Family: ['Magistrate Court', 'High Court'],
        Labor: ['Magistrate Court'],
        Regulatory: ['High Court'],
        Others: ['High Court', 'Magistrate Court']
    }
