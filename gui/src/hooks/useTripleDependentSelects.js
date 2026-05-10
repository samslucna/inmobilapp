import { useState, useMemo } from 'react';

const useTripleDependentSelects = (data,lvl) => {
  const [lvl, setLvl] = useState({l1:'',l2:'',l3:''});
  const [lvl1, setLvl1] = useState('');
  const [lvl2, setLvl2] = useState('');
  const [lvl3, setLvl3] = useState('');

  // Opciones para el nivel 2 (depende del 1)
  const optionsLvl2 = useMemo(() => {
    const found = data.find(item => item.id === lvl1);
    return found ? found.children : [];
  }, [data, lvl1]);

  // Opciones para el nivel 3 (depende del 2)
  const optionsLvl3 = useMemo(() => {
    const found = optionsLvl2.find(item => item.id === lvl2);
    return found ? found.children : [];
  }, [optionsLvl2, lvl2]);

  // Handlers
  const handleLvl1Change = (e) => {
    setLvl1(e.target.value);
    setLvl2(''); // Reset cascada
    setLvl3(''); // Reset cascada
  };

  const handleLvl2Change = (e) => {
    setLvl2(e.target.value);
    setLvl3(''); // Reset cascada
  };

  const handleLvl3Change = (e) => {
    setLvl3(e.target.value);
  };

  return {
    values: { lvl1, lvl2, lvl3 },
    options: { optionsLvl2, optionsLvl3 },
    handlers: { handleLvl1Change, handleLvl2Change, handleLvl3Change }
  };
};


export default useTripleDependentSelects;