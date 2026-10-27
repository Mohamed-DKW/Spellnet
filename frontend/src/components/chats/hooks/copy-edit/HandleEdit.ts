const handleEdit = (id: string, 
    text: string, 
    setEditingMessageId: (id: string | null) => void,
    setEditedText: (text: string) => void
) => {
    setEditingMessageId(id);
    setEditedText(text);
}
export default handleEdit;