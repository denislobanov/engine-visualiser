import * as APITerms from './APITerms';

export default function(conceptType) {
    var typeWeight = {
        APITerms.RELATION_TYPE = 1
    };

    if conceptType in typeWeight
        return typeWeight[conceptType];
    else
        return 0;

}
