import { createContext, useContext, useMemo, useState } from 'react';

const FiltersContext = createContext(null);

export const FiltersProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
  };

  const value = useMemo(() => ({
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    clearFilters,
  }), [searchTerm, selectedCategory]);

  return (
    <FiltersContext.Provider value={value}>
      {children}
    </FiltersContext.Provider>
  );
};

export const useFilters = () => useContext(FiltersContext);


