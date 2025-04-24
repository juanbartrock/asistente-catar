import React from 'react';
import ChatSimulator from '../components/ChatSimulator';

const Home: React.FC = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Dashboard Cafetería</h1>
      <section style={{ margin: '40px 0' }}>
        <h2>Asistente Conversacional</h2>
        <ChatSimulator />
      </section>
      <section style={{ margin: '40px 0' }}>
        <h2>Gestión de Promociones y Menú</h2>
        <p>Aquí podrás definir promociones, editar menú y ver estado de pedidos.</p>
      </section>
    </div>
  );
};

export default Home; 