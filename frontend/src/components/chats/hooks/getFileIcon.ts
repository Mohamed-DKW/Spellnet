export function getFileIcon(type: string) {
    if (type.startsWith('image/')) return '🖼';
    if (type === 'application/pdf') return '📄';
    if (type.includes('word') || type.includes('document')) return '📝';
    if (type.includes('sheet') || type.includes('excel')) return '📊';
    if (type.startsWith('text/')) return '📃';
    return '📎';
}