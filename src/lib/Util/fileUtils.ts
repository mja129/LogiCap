/**
 * Attempts to download a JSON file with content to the user's device.
 * @param fileName The name to give the file that will be downloaded.
 *                 This already includes the `.json` file extension.
 * @param content The content (JSON) that the file should contain.
 */
export function downloadJson(fileName: string, content: string): void {
    // create download blob
    const circuitBlob = new Blob([content], { type: 'application/json' });
    const jsonObjectUrl = URL.createObjectURL(circuitBlob);

    // create an element to perform the download
    const anchor = document.createElement("a");
    anchor.href = jsonObjectUrl;
    anchor.download = fileName + ".json";

    // simulate a click to trigger the download
    anchor.click();

    // clean up by removing the created element
    URL.revokeObjectURL(jsonObjectUrl);
    anchor.remove();
}

/**
 * Prompts the user to select a JSON file.
 * @return Promise for string content of file.
 */
export async function receiveJson(): Promise<string> {
    return new Promise((resolve, reject) => {
        // create an input element to prompt file selection
        const input: HTMLInputElement = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "application/JSON");
        input.onchange = () => {
            (input.files?.[0] as File).text()
                .then((content) => resolve(content))
                .catch((err) => reject(err));
        };

        // trigger upload prompt
        input.select();
        input.click();

        // TODO is this reliable?
        window.addEventListener("focus", () => {
            // delay because focus resumes before FileList populates
            setTimeout(() => {
                if (input.files?.length === 0) {
                    reject("File upload cancelled");
                }
            }, 1000);
        }, { once: true });

        // clean up
        input.remove();
    })
}
