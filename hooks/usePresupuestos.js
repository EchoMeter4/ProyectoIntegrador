import { useEffect, useState } from 'react';
import PresupuestosController from '../controllers/PresupuestosController';
import { useAuth } from '../components/AuthContext';

export default function usePresupuestos() {
    const { userId } = useAuth();
    const [state, setState] = useState(PresupuestosController.getState());

    useEffect(() => {
        const listener = () => setState(PresupuestosController.getState());
        PresupuestosController.addListener(listener);
        PresupuestosController.setUser(userId);
        return () => PresupuestosController.removeListener(listener);
    }, [userId]);

    return {
        ...state,
        agregarPresupuesto: (data) => PresupuestosController.agregar(data),
        editarPresupuesto: (id, data) => PresupuestosController.editar(id, data),
        eliminarPresupuesto: (id) => PresupuestosController.eliminar(id),
        obtenerPresupuestosPorMes: (year, month) => PresupuestosController.obtenerPorMes(year, month),
        refreshPresupuestos: () => PresupuestosController.cargar(),
    };
}
