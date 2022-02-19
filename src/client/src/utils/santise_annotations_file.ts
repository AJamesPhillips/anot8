import { AnnotationsFile, MaybeAnnotation } from "../state/interfaces"



export function santise_annotations_file (annotations_file: AnnotationsFile): AnnotationsFile
{

    return {
        ...annotations_file,
        annotations: annotations_file.annotations.map(sanitise_annotation),
    }
}



function sanitise_annotation (annotation: MaybeAnnotation): MaybeAnnotation
{
    return {
        ...annotation,
        compound_id: `${annotation.compound_id}`  // ensure it is a string
    }
}
