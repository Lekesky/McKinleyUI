import { TableProvider, useTable } from '@/context/TableContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, renderHook, waitFor } from '@testing-library/react-native';

describe('TableContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
    (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined);
  });

  it('should throw error when useTable is used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation();
    
    expect(() => {
      renderHook(() => useTable());
    }).toThrow('useTable must be used within TableProvider');
    
    consoleError.mockRestore();
  });

  it('should initialize with table number 0', async () => {
    const { result } = renderHook(() => useTable(), {
      wrapper: TableProvider,
    });

    await waitFor(() => {
      expect(result.current.tableNum).toBe(0);
    });
  });

  it('should set table number and save to storage', async () => {
    const { result } = renderHook(() => useTable(), {
      wrapper: TableProvider,
    });

    await act(async () => {
      result.current.setTableNum(5);
    });

    await waitFor(() => {
      expect(result.current.tableNum).toBe(5);
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith('tableNum', '5');
  });

  it('should clear table number', async () => {
    const { result } = renderHook(() => useTable(), {
      wrapper: TableProvider,
    });

    await act(async () => {
      result.current.setTableNum(10);
    });

    await waitFor(() => {
      expect(result.current.tableNum).toBe(10);
    });

    act(() => {
      result.current.clearTableNum();
    });

    await waitFor(() => {
      expect(result.current.tableNum).toBe(0);
    });

    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('tableNum');
  });

  it('should load table number from storage on mount', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('7');

    const { result } = renderHook(() => useTable(), {
      wrapper: TableProvider,
    });

    await waitFor(() => {
      expect(result.current.tableNum).toBe(7);
    });
  });

  it('should handle invalid stored table number gracefully', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('invalid');

    const { result } = renderHook(() => useTable(), {
      wrapper: TableProvider,
    });

    await waitFor(() => {
      expect(result.current.tableNum).toBe(0);
    });
  });
});
