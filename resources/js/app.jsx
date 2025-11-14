import React from 'react';
import { createRoot } from 'react-dom/client';

function App() {
    return (
        <div>
            <h1>¡React funcionando en ControlApp - Bienvenido a Finanzas de Hongos!</h1>
            <p>Si ves esto, el setup está listo. Próximo: Componente de transacciones.</p>
        </div>
    );
}

const root = createRoot(document.getElementById('app'));
root.render(<App />);