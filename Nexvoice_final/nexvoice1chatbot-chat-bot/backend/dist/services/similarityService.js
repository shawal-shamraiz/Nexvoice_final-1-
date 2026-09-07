const STOP_WORDS = new Set([
    'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
    'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can', 'cannot', 'could',
    'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'has', 'have',
    'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'i', 'if', 'in', 'into', 'is',
    'it', 'its', 'itself', 'just', 'me', 'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'now', 'of', 'off',
    'on', 'once', 'only', 'or', 'other', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'she', 'should',
    'so', 'some', 'such', 'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these',
    'they', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'we', 'were', 'what',
    'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'would', 'you', 'your', 'yours', 'yourself',
]);
const tokenize = (text) => {
    if (!text)
        return new Set();
    const normalized = text
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .replace(/\s+/g, ' ');
    const words = normalized.split(' ').filter((w) => w.length > 2 && !STOP_WORDS.has(w));
    return new Set(words);
};
const calculateJaccardSimilarity = (setA, setB) => {
    if (setA.size === 0 || setB.size === 0)
        return 0;
    let intersection = 0;
    for (const item of setA) {
        if (setB.has(item))
            intersection++;
    }
    const union = setA.size + setB.size - intersection;
    return union > 0 ? intersection / union : 0;
};
export const SimilarityService = {
    calculateScore(target, candidate) {
        if (target.id === candidate.id)
            return 0;
        // Weight configuration (Total = 1.0 / 100%)
        // Category match -> 25%
        // Subcategory match -> 20%
        // Title similarity -> 25%
        // Description similarity -> 20%
        // Institution match -> 10%
        let categoryScore = 0;
        if (target.category && candidate.category && target.category.trim().toLowerCase() === candidate.category.trim().toLowerCase()) {
            categoryScore = 0.25;
        }
        let subcategoryScore = 0;
        if (target.subcategory && candidate.subcategory && target.subcategory.trim().toLowerCase() === candidate.subcategory.trim().toLowerCase()) {
            subcategoryScore = 0.20;
        }
        let institutionScore = 0;
        if (target.institution_name && candidate.institution_name && target.institution_name.trim().toLowerCase() === candidate.institution_name.trim().toLowerCase()) {
            institutionScore = 0.10;
        }
        const targetTitleTokens = tokenize(target.title);
        const candidateTitleTokens = tokenize(candidate.title);
        const titleSim = calculateJaccardSimilarity(targetTitleTokens, candidateTitleTokens);
        const titleScore = titleSim * 0.25;
        const targetDescTokens = tokenize(target.description);
        const candidateDescTokens = tokenize(candidate.description);
        const descSim = calculateJaccardSimilarity(targetDescTokens, candidateDescTokens);
        const descScore = descSim * 0.20;
        const totalScore = categoryScore + subcategoryScore + institutionScore + titleScore + descScore;
        return Math.min(1.0, Math.max(0.0, totalScore));
    },
    analyzeSimilarities(target, candidates) {
        return candidates
            .filter((c) => c.id !== target.id)
            .map((candidate) => {
            const score = this.calculateScore(target, candidate);
            const percentage = Math.round(score * 100);
            return {
                candidate,
                score,
                percentage,
                isPotentialDuplicate: score >= 0.80,
            };
        })
            .filter((analysis) => analysis.score >= 0.35)
            .sort((a, b) => b.score - a.score);
    },
    findSimilarIssues(target, candidates, limit = 6) {
        const analysis = this.analyzeSimilarities(target, candidates);
        return analysis
            .filter((a) => !a.isPotentialDuplicate && a.score >= 0.35)
            .slice(0, limit)
            .map((a) => a.candidate);
    },
    findPotentialDuplicates(target, candidates) {
        const analysis = this.analyzeSimilarities(target, candidates);
        return analysis.filter((a) => a.isPotentialDuplicate || a.score >= 0.80);
    },
};
