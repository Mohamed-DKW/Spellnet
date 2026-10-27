import updateData from "./updateData";

const changeData = async (
    editingMessageId: string,
    editedText: string,
    setEditingMessageId: React.Dispatch<React.SetStateAction<string | null>>
) => {
    try {
        const id = parseInt(editingMessageId.replace('u-', ''));
        setEditingMessageId(null);
        return await updateData(id, editedText);
    } catch (error) {
        console.error(error);
        return null;
    }
};

export default changeData;