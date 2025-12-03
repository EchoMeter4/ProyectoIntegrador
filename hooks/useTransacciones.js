import { useEffect, useMemo, useState } from 'react';
import TransaccionesController from '../controllers/TransaccionesController';
import { useAuth } from '../components/AuthContext';

export default function useTransacciones() {
    const { userId } = useAuth();
    const [state, setState] = useState(TransaccionesController.getState());

    useEffect(() => {
        const listener = () => {
            setState(TransaccionesController.getState());
        };
        TransaccionesController.addListener(listener);
        TransaccionesController.setUser(userId);

        return () => {
            TransaccionesController.removeListener(listener);
        };
    }, [userId]);

    const getAllTransactionsForCharts = useMemo(() => {
        return async () => TransaccionesController.obtenerParaGraficas();
    }, []);

    return {
        ...state,
        setActiveFilter: (filter) => TransaccionesController.setActiveFilter(filter),
        setFilterMonthYear: (mesAnio) => TransaccionesController.setFilterMonthYear(mesAnio),
        agregarTransaccion: (tx) => TransaccionesController.agregar(tx),
        editarTransaccion: (id, tx) => TransaccionesController.editar(id, tx),
        eliminarTransaccion: (id) => TransaccionesController.eliminar(id),
        getAllTransactionsForCharts,
    };
}
