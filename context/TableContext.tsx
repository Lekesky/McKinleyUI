import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

type TableContextType = {
  tableNum: number;
  setTableNum: (num: number) => void;
  clearTableNum: () => void;
};

const TableContext = createContext<TableContextType | undefined>(undefined);

export const TableProvider = ({ children }: { children: React.ReactNode }) => {
  const [tableNum, setTableNumState] = useState<number>(0);

  const loadTableNum = useCallback(async () => {
    const storedTableNum = await AsyncStorage.getItem('tableNum').catch((error) => console.error("Error loading table number: ", error));
    if (storedTableNum) {
      setTableNumState(Number(storedTableNum));
    }
  }, []);

  const saveTableNum = async (newTableNum: number) => {
    setTableNumState(newTableNum);
    await AsyncStorage.setItem('tableNum', String(newTableNum)).catch((error) => console.error("Error saving table number: ", error));
  };

  const clearTableNum = () => {
    setTableNumState(0);
    AsyncStorage.removeItem('tableNum').catch((error) => console.error("Error clearing table number: ", error));
  };

  useEffect(() => {
    loadTableNum();
  }, [loadTableNum]);

  return (
    <TableContext.Provider value={{ tableNum, setTableNum: saveTableNum, clearTableNum }}>
      {children}
    </TableContext.Provider>
  );
};

export const useTable = () => {
  const context = useContext(TableContext);
  if (!context) throw new Error('useTable must be used within TableProvider');
  return context;
};