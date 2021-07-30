
/**
 * Utility function to normalize a text encoded with HTML Code to a plain string.
 * Example of a string encoded with HTML Code: "You can calculate Induced Voltage using: &epsilon; =-N * (d&Phi;B)/(d)"
 * @param text text to be normalized.
 * @returns a normalized plain string.
 */
export function normalizeHtmlText(text: string): string {          
    // Creates a temporary textarea element into the DOM and injects the text to its content.
    let textAreaElement = document.createElement("textarea");
    textAreaElement.innerHTML = text;
    // Return the value converted to a plain string
    return textAreaElement.value;   
}