
export const calculateMatchScore = (target: string, master: string): number => {
    const targetUpper = target.toUpperCase().trim();
    const masterUpper = master.toUpperCase().trim();
    
    if (!masterUpper) return 0;
    
    // Exact match
    if (targetUpper === masterUpper) return 1.0;
    
    // Strict inclusion: master name exists as a whole phrase within the target
    // We escape special characters to safe use in Regex
    const escapedMaster = masterUpper.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Word boundary match
    const regex = new RegExp(`\\b${escapedMaster}\\b`, 'i');
    
    if (regex.test(targetUpper)) return 1.0;

    return 0;
};
