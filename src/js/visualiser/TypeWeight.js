import * as APITerms from './APITerms';

export function typeWeight(conceptType) {
    var weightMap = {
        "relation-type": 1,
        "type": 2
    };

    if (conceptType in weightMap)
        return weightMap[conceptType];
    else
        return 0;
}

export function edgeLabel(conceptAType, conceptBType, roleName) {
    if((conceptAType === APITerms.TYPE_TYPE)||(conceptBType === APITerms.TYPE_TYPE))
        return APITerms.EDGE_LABEL_ISA;
    else
        return roleName;
}
