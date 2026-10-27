import express from "express";
import contactForm from "../../models/contact_form.model";

const router = express.Router();

router.post('/submit', async (req, res) => {
    const { name, email, message } = req.body;
    try{
        const cf = new contactForm();
        cf.name = name;
        cf.email = email;
        cf.message = message;
        await cf.$query().insert();
        res.json({ message: 'Formulario de contacto guardado exitosamente' });
    }catch(error){
        console.error('Error al guardar el formulario de contacto:', error);
        res.status(500).json({ error: 'Error al guardar el formulario de contacto' });
    }
});

export default router;