import fs from 'fs';
import path from 'path';
const pdfParse = require('pdf-parse');
//import * as pdfParse from 'pdf-parse';
import mammoth from 'mammoth';


// Extensiones que se leen directamente como texto plano
const PLAIN_TEXT_EXTENSIONS = new Set([
    '.txt', '.md', '.json', '.yml', '.yaml', '.conf',
    '.js', '.ts', '.html', '.css', '.php', '.py',
    '.java', '.cs', '.c', '.sh', '.bat'
]);

export async function extractText(filePath: string, fileName: string): Promise<string> {
    const ext = path.extname(fileName).toLowerCase();

    try {
        // Texto plano
        if (PLAIN_TEXT_EXTENSIONS.has(ext)) {
            return fs.readFileSync(filePath, 'utf-8');
        }
        //Para pdf
        if (ext === '.pdf') {
            const buffer = fs.readFileSync(filePath);
            const data = await pdfParse(buffer);
            return data.text;
        }
        //En caso de que sea doc
        if (ext === '.doc' || ext === '.docx') {
            const buffer = fs.readFileSync(filePath);
            const result = await mammoth.extractRawText({ buffer });
            return result.value;
        }

        return `[Tipo de archivo no soportado: ${fileName}]`;

    } catch (error) {
        console.error(`Error extrayendo texto de ${fileName}:`, error);
        return `[Error leyendo ${fileName}]`;
    }
}