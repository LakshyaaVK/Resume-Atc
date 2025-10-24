
declare const pdfjsLib: any;
declare const mammoth: any;

export const parseFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.onload = async (event) => {
      if (!event.target?.result) {
        return reject(new Error("Failed to read file."));
      }

      try {
        if (file.type === "application/pdf") {
          const pdf = await pdfjsLib.getDocument({ data: event.target.result }).promise;
          let text = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            text += textContent.items.map((item: any) => item.str).join(' ');
          }
          resolve(text);
        } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
          const result = await mammoth.extractRawText({ arrayBuffer: event.target.result });
          resolve(result.value);
        } else {
          reject(new Error("Unsupported file type. Please upload a PDF or DOCX file."));
        }
      } catch (error) {
        console.error("Error parsing file:", error);
        reject(new Error("There was an error processing the document."));
      }
    };

    fileReader.onerror = () => {
      reject(new Error("Failed to read file."));
    };

    fileReader.readAsArrayBuffer(file);
  });
};
