import * as APITerms from './APITerms';

export function weight(baseType) {
    var weightMap = {
        "entity-type": 1,
        "relation-type": 2,
        "type": 3
    };

    if (baseType in weightMap)
        return weightMap[baseType];
    else
        return 0;
}

export function leftSignificant(l, r) {
    return (weight(l[APITerms.KEY_BASE_TYPE]) > weight(r[APITerms.KEY_BASE_TYPE]));
}
