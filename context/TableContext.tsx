import React, { createContext, useContext, useState } from 'react';

type TableContextType = {
  tableNum: string;
  setTableNum: (num: string) => void;
};

const TableContext = createContext<TableContextType | undefined>(undefined);

export const TableProvider = ({ children }: { children: React.ReactNode }) => {
  const [tableNum, setTableNum] = useState('');
  return (
    <TableContext.Provider value={{ tableNum, setTableNum }}>
      {children}
    </TableContext.Provider>
  );
};

export const useTable = () => {
  const context = useContext(TableContext);
  if (!context) throw new Error('useTable must be used within TableProvider');
  return context;
};