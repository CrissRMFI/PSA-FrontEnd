'use client';

import React from 'react';
import { useProyectos, useTestAPI } from '../../../api/hooks';

const TestConnection = () => {
  const { proyectos, loading, error, crearProyecto } = useProyectos();
  const { connectionStatus, mensaje, crearProyectoPrueba } = useTestAPI();

  const handleCrearProyecto = async () => {
    try {
      const nuevoProyecto = {
        nombre: 'Mi Primer Proyecto Real',
        descripcion: 'Proyecto creado desde Next.js conectado al backend Spring Boot',
        liderProyecto: 'Tu Nombre',
      };
      
      await crearProyecto(nuevoProyecto);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Calcular estadísticas simples del lado del cliente
  const estadisticas = React.useMemo(() => {
    if (!proyectos.length) return null;
    
    return {
      totalProyectos: proyectos.length,
      proyectosActivos: proyectos.filter(p => p.estado === 'ACTIVO').length,
      totalFases: proyectos.reduce((total, p) => total + (p.fases?.length || 0), 0),
      totalRiesgos: proyectos.reduce((total, p) => total + (p.riesgos?.length || 0), 0),
    };
  }, [proyectos]);

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
      <h1>🔌 Test de Conexión Frontend ↔ Backend</h1>
      
      {/* Estado de conexión */}
      <div style={{ 
        padding: '15px', 
        marginBottom: '20px',
        backgroundColor: connectionStatus === 'connected' ? '#d4edda' : 
                        connectionStatus === 'disconnected' ? '#f8d7da' : '#fff3cd',
        border: '1px solid #ddd',
        borderRadius: '8px'
      }}>
        <h3 style={{ margin: '0 0 10px 0' }}>Estado de Conexión:</h3>
        {connectionStatus === 'testing' && '🔄 Probando conexión...'}
        {connectionStatus === 'connected' && '✅ Conectado al backend Spring Boot'}
        {connectionStatus === 'disconnected' && '❌ No se puede conectar al backend'}
        {mensaje && <div style={{ marginTop: '10px', fontSize: '14px' }}>{mensaje}</div>}
      </div>

      {/* Flujo visual */}
      <div style={{ 
        marginBottom: '20px',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <h3>📡 Flujo de Datos:</h3>
        <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
          <strong>Next.js</strong> → <strong>APIs REST</strong> → <strong>Spring Boot</strong> → <strong>PostgreSQL (Render)</strong>
          <br />
          <em>Tu GerenteProyecto funcionando en la nube (sin portafolios)</em>
        </div>
      </div>

      {/* Estadísticas */}
      <div style={{ marginBottom: '20px' }}>
        <h3>📊 Estadísticas de Proyectos</h3>
        {loading && <p>🔄 Cargando desde PostgreSQL...</p>}
        {error && <p style={{ color: 'red' }}>❌ Error: {error}</p>}
        {estadisticas && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '15px',
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px'
          }}>
            <div style={{ textAlign: 'center', padding: '10px', backgroundColor: 'white', borderRadius: '6px' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#007bff' }}>
                {estadisticas.totalProyectos}
              </div>
              <div>Total Proyectos</div>
            </div>
            <div style={{ textAlign: 'center', padding: '10px', backgroundColor: 'white', borderRadius: '6px' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#28a745' }}>
                {estadisticas.proyectosActivos}
              </div>
              <div>Proyectos Activos</div>
            </div>
            <div style={{ textAlign: 'center', padding: '10px', backgroundColor: 'white', borderRadius: '6px' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ffc107' }}>
                {estadisticas.totalFases}
              </div>
              <div>Total Fases</div>
            </div>
            <div style={{ textAlign: 'center', padding: '10px', backgroundColor: 'white', borderRadius: '6px' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#dc3545' }}>
                {estadisticas.totalRiesgos}
              </div>
              <div>Total Riesgos</div>
            </div>
          </div>
        )}
      </div>

      {/* Lista de proyectos */}
      <div style={{ marginBottom: '20px' }}>
        <h3>📋 Proyectos en la Base de Datos</h3>
        {proyectos.length === 0 && !loading && (
          <p style={{ color: '#666', fontStyle: 'italic' }}>
            No hay proyectos. ¡Crea uno con los botones de abajo!
          </p>
        )}
        {proyectos.length > 0 && (
          <div style={{ 
            maxHeight: '300px',
            overflowY: 'auto',
            border: '1px solid #ddd',
            borderRadius: '8px'
          }}>
            {proyectos.map((proyecto) => (
              <div 
                key={proyecto.idProyecto} 
                style={{ 
                  padding: '15px',
                  borderBottom: '1px solid #eee',
                  backgroundColor: '#fff'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '16px' }}>{proyecto.nombre}</strong>
                  <span style={{ 
                    padding: '4px 12px',
                    backgroundColor: proyecto.estado === 'ACTIVO' ? '#28a745' : 
                                    proyecto.estado === 'PAUSADO' ? '#ffc107' : '#dc3545',
                    color: 'white',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {proyecto.estado}
                  </span>
                </div>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
                  <strong>ID:</strong> {proyecto.idProyecto} | <strong>Líder:</strong> {proyecto.liderProyecto}
                </div>
                <div style={{ fontSize: '13px', color: '#666' }}>
                  <strong>Fases:</strong> {proyecto.fases?.length || 0} | 
                  <strong> Riesgos:</strong> {proyecto.riesgos?.length || 0}
                </div>
                {proyecto.descripcion && (
                  <div style={{ fontSize: '13px', color: '#888', fontStyle: 'italic' }}>
                    {proyecto.descripcion}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Botones de prueba */}
      <div style={{ marginBottom: '20px' }}>
        <h3>🧪 Probar APIs</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            onClick={crearProyectoPrueba}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            🎯 Crear Proyecto de Prueba
          </button>
          
          <button 
            onClick={handleCrearProyecto}
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            ✨ Crear Mi Proyecto
          </button>
          
          <button 
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            🔄 Refrescar Página
          </button>
        </div>
      </div>

      {/* Información técnica */}
      <div style={{ 
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#e3f2fd',
        border: '1px solid #bbdefb',
        borderRadius: '8px'
      }}>
        <h4>📝 ¿Cómo funciona esto?</h4>
        <ul style={{ lineHeight: '1.8', marginBottom: '15px' }}>
          <li><strong>Backend:</strong> Spring Boot corriendo en <code>localhost:8080</code></li>
          <li><strong>Frontend:</strong> Next.js corriendo en <code>localhost:3000</code></li>
          <li><strong>Base de Datos:</strong> PostgreSQL en Render (nube)</li>
          <li><strong>APIs:</strong> Endpoints de proyectos funcionando directamente</li>
          <li><strong>Datos:</strong> Todo lo que crees se guarda en la base de datos real</li>
        </ul>
        
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#fff', 
          borderRadius: '6px',
          border: '1px solid #ddd'
        }}>
          <h5 style={{ margin: '0 0 10px 0', color: '#007bff' }}>🎯 Próximos pasos:</h5>
          <p style={{ margin: '0', fontSize: '14px', lineHeight: '1.6' }}>
            Una vez que veas que esto funciona, podemos conectar tus componentes reales:
          </p>
          <ul style={{ fontSize: '14px', margin: '10px 0 0 20px' }}>
            <li><code>ProyectoDashboard.jsx</code> → usar <code>useProyectos()</code></li>
            <li><code>ProyectoDetalle.jsx</code> → usar <code>useProyecto(id)</code></li>
            <li><code>FasesPanel.jsx</code> → usar <code>useFases(proyectoId)</code></li>
            <li><code>TareasManager.jsx</code> → usar <code>useTareas()</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestConnection;
