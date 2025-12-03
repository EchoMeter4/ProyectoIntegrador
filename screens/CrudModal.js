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
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

import { useTransactionsBridge } from '../components/TransactionsBridge';

const formatDateLocal = (date) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return '';
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseDateString = (dateString) => {
  if (!dateString || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return new Date();
  }
  const [year, month, day] = dateString.split('-').map((value) => parseInt(value, 10));
  return new Date(year, month - 1, day);
};

const formatMonthKey = (date) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return '';
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

const parseMonthKey = (monthKey) => {
  if (!monthKey || !/^\d{4}-\d{2}$/.test(monthKey)) {
    return new Date();
  }
  const [year, month] = monthKey.split('-').map((value) => parseInt(value, 10));
  return new Date(year, month - 1, 1);
};

export default function CrudModal({ visible, setVisible, operation, type, itemEditar }) {
  
  const [monto, setMonto] = useState('');
  const [categoria, setCategoria] = useState('');
  const [nota, setNota] = useState('');
  const [tipoActual, setTipoActual] = useState('gasto');
  const [fecha, setFecha] = useState(formatDateLocal(new Date()));
  const [mesPresupuesto, setMesPresupuesto] = useState(formatMonthKey(new Date()));
  const [mostrarPicker, setMostrarPicker] = useState(false);
  const [mostrarPickerMes, setMostrarPickerMes] = useState(false);

  const { agregarTransaccion, editarTransaccion } = useTransactionsBridge();

  const categoriasEjemplo = {
    gasto: ['Comida', 'Transporte', 'Renta', 'Escuela', 'Salud', 'Entretenimiento'],
    ingreso: ['Salario', 'Ventas', 'Regalo', 'Inversión', 'Otros'],
  };

  const buildYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 6 }).map((_, idx) => (currentYear - 2 + idx).toString());
  };

  useEffect(() => {
    if (visible) {
      
      if (operation === 'editar' && itemEditar) {
        setMonto(itemEditar.monto ? itemEditar.monto.toString().replace('$', '').replace(/,/g, '') : '');
        setCategoria(itemEditar.categoria || '');
        setNota(itemEditar.descripcion || '');
        setTipoActual(itemEditar.tipo || 'gasto');
        if ((itemEditar.tipo || 'gasto') === 'presupuesto') {
          const mes = (itemEditar.fecha || '').substring(0, 7);
          setMesPresupuesto(mes && /^\d{4}-\d{2}$/.test(mes) ? mes : formatMonthKey(new Date()));
          setFecha('');
        } else {
          setFecha(
            formatDateLocal(
              parseDateString(itemEditar.fecha || formatDateLocal(new Date()))
            )
          );
          setMesPresupuesto(formatMonthKey(new Date()));
        }
      } else {
        
        setMonto('');
        setCategoria('');
        setNota('');
        setTipoActual(type || 'gasto');
        if ((type || 'gasto') === 'presupuesto') {
          setMesPresupuesto(formatMonthKey(new Date()));
          setFecha('');
        } else {
          setFecha(formatDateLocal(new Date()));
          setMesPresupuesto(formatMonthKey(new Date()));
        }
      }
    }
  }, [visible, operation, itemEditar, type]);

  const handleGuardar = async () => {
    
    if (!monto || !categoria) {
      Alert.alert("Faltan datos", "Por favor ingresa un monto y selecciona una categoría.");
      return;
    }

    if (tipoActual !== 'presupuesto') {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha) || Number.isNaN(parseDateString(fecha).getTime())) {
        Alert.alert("Fecha inválida", "Ingresa una fecha con formato AAAA-MM-DD.");
        return;
      }
    } else {
      if (!/^\d{4}-\d{2}$/.test(mesPresupuesto) || Number.isNaN(parseMonthKey(mesPresupuesto).getTime())) {
        Alert.alert("Mes inválido", "Selecciona un mes con formato AAAA-MM.");
        return;
      }
    }

    const nuevaTransaccion = {
      monto: monto,
      categoria: categoria,
      descripcion: nota,
      fecha: tipoActual === 'presupuesto' ? `${mesPresupuesto}-01` : fecha,
      tipo: tipoActual
    };

    try {
      
      if (operation === 'crear' || !itemEditar) {
        await agregarTransaccion(nuevaTransaccion);
        Alert.alert("¡Éxito!", "Se agregó correctamente a tu lista.");
      } else {
        
        await editarTransaccion(itemEditar.id, nuevaTransaccion);
        Alert.alert("¡Éxito!", "Se actualizó correctamente.");
      }
      cerrarModal(); 
    } catch (error) {
      console.error("Error al guardar:", error);
      
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
                {categoriasEjemplo[tipoActual === 'presupuesto' ? 'gasto' : tipoActual]?.map((cat) => (
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

              {tipoActual !== 'presupuesto' && (
                <>
                  <Text style={styles.label}>Fecha</Text>
                  <TouchableOpacity style={styles.dateButton} onPress={() => setMostrarPicker(true)}>
                    <Text style={styles.dateButtonText}>{fecha}</Text>
                  </TouchableOpacity>
                  {mostrarPicker && (
                    <DateTimePicker
                      mode="date"
                      display={Platform.OS === 'ios' ? 'inline' : 'calendar'}
                      value={parseDateString(fecha || formatDateLocal(new Date()))}
                      onChange={(event, selectedDate) => {
                        if (Platform.OS === 'android') {
                          setMostrarPicker(false);
                        }
                        if (event?.type === 'dismissed') return;
                        if (selectedDate) {
                          setFecha(formatDateLocal(selectedDate));
                        }
                      }}
                    />
                  )}
                </>
              )}

              {tipoActual === 'presupuesto' && (
                <>
                  <Text style={styles.label}>Mes</Text>
                  <View style={styles.monthPickerContainer}>
                    <View style={styles.monthPickerBlock}>
                      <Text style={styles.monthPickerLabel}>Mes</Text>
                      <Picker
                        selectedValue={mesPresupuesto.substring(5,7)}
                        onValueChange={(monthValue) => {
                          const year = mesPresupuesto.substring(0,4) || formatMonthKey(new Date()).substring(0,4);
                          setMesPresupuesto(`${year}-${monthValue}`);
                        }}
                        style={styles.monthPicker}
                        mode="dropdown"
                      >
                        {[...Array(12).keys()].map((idx) => {
                          const value = String(idx + 1).padStart(2, '0');
                          return <Picker.Item key={value} label={value} value={value} />;
                        })}
                      </Picker>
                    </View>
                    <View style={styles.monthPickerBlock}>
                      <Text style={styles.monthPickerLabel}>Año</Text>
                      <Picker
                        selectedValue={mesPresupuesto.substring(0,4)}
                        onValueChange={(yearValue) => {
                          const month = mesPresupuesto.substring(5,7) || formatMonthKey(new Date()).substring(5,7);
                          setMesPresupuesto(`${yearValue}-${month}`);
                        }}
                        style={styles.monthPicker}
                        mode="dropdown"
                      >
                        {buildYears().map((year) => (
                          <Picker.Item key={year} label={year} value={year} />
                        ))}
                      </Picker>
                    </View>
                  </View>
                </>
              )}

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
 dateButton: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    marginBottom: 10,
 },
 dateButtonText: {
    fontSize: 16,
    color: '#004D40',
    fontWeight: '600',
 },
 monthPickerContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
 },
 monthPickerBlock: {
    flex: 1,
 },
 monthPickerLabel: {
    fontSize: 12,
    color: '#004D40',
    marginBottom: 6,
 },
 monthPicker: {
    backgroundColor: 'white',
    borderRadius: 10,
 },
});