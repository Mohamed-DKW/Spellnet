import API from "../../../../services/api";
const updateData = async (messageId: number, editedText: string) => {
    const response = await fetch(`${API}/api/message/stream`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message_id: messageId,
            content: editedText
        })
    });

    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
    return response.json();
};

export default updateData;