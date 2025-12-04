import { ZodIssue } from "zod"

export function buildValidationErrorMessage(issues: ZodIssue[]): string[] {
    const errors = issues.map(item => {
        return `${item.path.join(".")}: ${item.message}`;
    });

    return errors
}

