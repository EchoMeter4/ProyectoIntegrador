import React, { useState, useEffect } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';

import { useTransactions } from '../components/TransactionsContext';

export default function CrudModal({ visible, setVisible, operation, type, itemEditar }) {
  
  const [monto, setMonto] = useState('');
  const [categoria, setCategoria] = useState('');
  const [nota, setNota] = useState('');
  const [tipoActual, setTipoActual] = useState('gasto'); 

  const { agregarTransaccion, editarTransaccion } = useTransactions();

  const categoriasEjemplo = {
    gasto: ['Comida', 'Transporte', 'Renta', 'Escuela', 'Salud', 'Entretenimiento'],
    ingreso: ['Salario', 'Ventas', 'Regalo', 'Inversión', 'Otros'],
    presupuesto: ['Comida', 'Transporte', 'Renta', 'Ahorro']
  };

  useEffect(() => {
    if (visible) {
      // Solo intentamos pre-llenar si es editar Y si existe itemEditar
      if (operation === 'editar' && itemEditar) {
        setMonto(itemEditar.monto ? itemEditar.monto.toString().replace('$', '').replace(/,/g, '') : '');
        setCategoria(itemEditar.categoria || '');
        setNota(itemEditar.descripcion || '');
        setTipoActual(itemEditar.tipo || 'gasto');
      } else {
        // Limpiar formulario para nuevo registro
        setMonto('');
        setCategoria('');
        setNota('');
        setTipoActual(type || 'gasto');
      }
    }
  }, [visible, operation, itemEditar, type]);

  const handleGuardar = async () => {
    
    if (!monto || !categoria) {
      Alert.alert("Faltan datos", "Por favor ingresa un monto y selecciona una categoría.");
      return;
    }

    const nuevaTransaccion = {
      monto: monto,
      categoria: categoria,
      descripcion: nota,
      fecha: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long' }),
      tipo: tipoActual
    };

    try {
      // --- CORRECCIÓN PRINCIPAL ---
      // Si la operación es 'crear' O si por alguna razón itemEditar es null/undefined,
      // lo tratamos como una inserción nueva para evitar el error "property id of undefined".
      if (operation === 'crear' || !itemEditar) {
        await agregarTransaccion(nuevaTransaccion);
        Alert.alert("¡Éxito!", "Se agregó correctamente a tu lista.");
      } else {
        // Aquí ya estamos seguros de que itemEditar existe y tiene ID
        await editarTransaccion(itemEditar.id, nuevaTransaccion);
        Alert.alert("¡Éxito!", "Se actualizó correctamente.");
      }
      cerrarModal(); 
    } catch (error) {
      console.error("Error al guardar:", error);
      // Mantenemos el error visible por si falla SQL, pero ya no debería fallar por lógica
      Alert.alert("Error", error.message || "No se pudo guardar en la base de datos.");
    }
  };

  const cerrarModal = () => {
    setVisible(false);
    Keyboard.dismiss();
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={cerrarModal}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            
            <View style={styles.header}>
              <Text style={styles.modalTitle}>
                {operation === 'crear' ? 'Nueva Transacción' : 'Editar Transacción'}
              </Text>
              <TouchableOpacity onPress={cerrarModal}>
                <Text style={styles.closeText}>Cerrar</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.tabContainer}>
              {['ingreso', 'gasto', 'presupuesto'].map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.tabButton, { borderBottomColor: tipoActual === t ? '#004D40' : 'transparent' }]}
                  onPress={() => setTipoActual(t)}
                >
                  <Text style={[styles.tabText, tipoActual === t && { color: '#004D40', fontWeight: 'bold' }]}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              
              <Text style={styles.label}>Monto</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.inputMonto}
                  placeholder="0.00"
                  placeholderTextColor="#ccc"
                  keyboardType="numeric"
                  value={monto}
                  onChangeText={setMonto}
                />
              </View>

              <Text style={styles.label}>Seleccionar Categoría</Text>
              <View style={styles.categoriasGrid}>
                {categoriasEjemplo[tipoActual]?.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.catButton, categoria === cat && styles.catActive]}
                    onPress={() => setCategoria(cat)}
                  >
                    <Text style={[styles.catText, categoria === cat && { color: 'white' }]}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <TextInput
                style={styles.inputGeneral}
                placeholder="Otra categoría..."
                value={categoria}
                onChangeText={setCategoria}
              />

              <Text style={styles.label}>Agregar Nota (Opcional)</Text>
              <TextInput
                style={styles.inputGeneral}
                placeholder="Descripción..."
                value={nota}
                onChangeText={setNota}
              />

              <TouchableOpacity style={styles.saveButton} onPress={handleGuardar}>
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
            </ScrollView>

          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
    modalOverlay: { flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end' 
    },
    modalContent: { backgroundColor: '#F5FFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20, 
    height: '85%' 
    },
    header: { flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20 
    },
    modalTitle: { fontSize: 20,
    fontWeight: 'bold', 
    color: '#004D40' 
    },
    closeText: { fontSize: 16,
    fontWeight: 'bold',
    color: '#999' 
    },
    tabContainer: { flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    borderBottomWidth: 1,
        borderBottomColor: '#ccc'
        },
  tabButton: { paddingVertical: 10,
    borderBottomWidth: 3, 
    flex: 1,
    alignItems: 'center'
        },
    tabText: { color: '#666',
    fontSize: 16 
    },
    label: { fontSize: 16, 
    fontWeight: 'bold',
    color: '#004D40',
    marginTop: 15, 
    marginBottom: 10 
    },
    inputContainer: { flexDirection: 'row',
    alignItems: 'center', 
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15, 
    borderWidth: 1, 
    borderColor: '#ddd'
    },
    currencySymbol: { fontSize: 24,
        color: '#999',
        marginRight: 10 
        },
    inputMonto: { flex: 1, 
        fontSize: 32,
        color: '#004D40', 
        fontWeight: 'bold',
        paddingVertical: 10 
        },
    categoriasGrid: { flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10, marginBottom: 10 
        },
    catButton: { paddingVertical: 8,
        paddingHorizontal: 15, 
        backgroundColor: 'white', 
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ddd' 
        },
    catActive: { backgroundColor: '#004D40', 
        borderColor: '#004D40' 
    },
    catText: { color: '#004D40' 
    },
    inputGeneral: { backgroundColor: 'white',
        borderRadius: 10, 
        padding: 15,
        borderWidth: 1,
        borderColor: '#ddd',
            fontSize: 16,
            marginBottom: 10 
            },
    saveButton: { backgroundColor: '#004D40',
        borderRadius: 15,
        padding: 18, 
        alignItems: 'center',
        marginTop: 20, 
        marginBottom: 20 
        },
    saveButtonText: { color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
        },
});