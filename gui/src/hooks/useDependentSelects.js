import { useState, useMemo } from 'react';

const useDependentSelects = (data, parentKey) => {
  const [parentValue, setParentValue] = useState('');
  const [childValue, setChildValue] = useState('');

  // Filtramos las opciones del hijo basadas en la elección del padre
  const childOptions = useMemo(() => {
    if (!parentValue) return [];
    const selectedParent = data.find(item => item.id === parentValue);
    return selectedParent ? selectedParent.children : [];
  }, [data, parentValue]);

  const handleParentChange = (event) => {
    setParentValue(event.target.value);
    setChildValue(''); // Resetear el hijo cuando el padre cambia
  };

  const handleChildChange = (event) => {
    setChildValue(event.target.value);
  };

  return {
    parentValue,
    childValue,
    childOptions,
    handleParentChange,
    handleChildChange,
  };
};

export default useDependentSelects;