import {PropertyNameMapper} from "@digitalascetic/ngx-object-transformer";

export class FormServiceConfiguration {

    public propertyMapper: PropertyNameMapper;

    public options: {
        control?: { dirtyOnModification?: boolean },
        modifiedValues?: { forceInclude?: boolean, includeEntireArray?: boolean, alwaysIncludeProps?: Array<string> }
    }

    constructor(propertyMapper?: PropertyNameMapper, options?: { control?: { dirtyOnModification?: boolean }; modifiedValues?: { forceInclude?: boolean; includeEntireArray?: boolean; alwaysIncludeProps?: Array<string> } }) {
        this.propertyMapper = propertyMapper;
        this.options = options;
    }
}
