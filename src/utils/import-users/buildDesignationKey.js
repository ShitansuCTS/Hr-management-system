export function buildDesignationKey(departmentId, designationTitle) {
    return `${departmentId}:${designationTitle.trim().toLowerCase()}`;
}
