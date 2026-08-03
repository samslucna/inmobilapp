// pages/contracts/DataList.jsx
import { observer } from "mobx-react-lite";
import { useEffect, useState, useCallback } from "react";
import ContractStore from "../../store/ContractStore";
import ContractTable from "./TableData";
import ContractForm from "./Form";
import { Box, Fab, Zoom, Tooltip } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import authStore from "../../store/AuthStore";

const DataList = observer(() => {
  const { Can } = authStore;
  const [openForm, setOpenForm] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);

  const loadContracts = useCallback(async () => {
    await ContractStore.loadContracts();
    await ContractStore.loadStatistics();
  }, []);

  useEffect(() => {
    loadContracts();
  }, [loadContracts]);

  
  const handleEdit = (contract) => {
    ContractStore.setContract(contract);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
   
    setOpenForm(false);
    ContractStore.setContract(null);
    // Resetear el estado de edición en el store
    ContractStore.setEditing(false);
    ContractStore.setEditId(null);
  };

  const handleSuccess = () => {
    loadContracts();
    handleCloseForm();
  };

  const handleOpenNewForm = () => {
    ContractStore.setContract(null);
    setOpenForm(true);
  };
 

  return (
    <Box sx={{ p: 3 }}>
      <ContractTable
        datasTable={ContractStore.contracts}
        onEdit={handleEdit}
        onRefresh={loadContracts}
        loading={ContractStore.loading}
      />
      
      
      {/* Botón flotante para nuevo contrato */}
      { (
        <Zoom in={true}>
          <Tooltip title="Nuevo contrato" placement="left">
            <Fab
              color="primary"
              aria-label="add"
              onClick={handleOpenNewForm}
              sx={{
                position: "fixed",
                bottom: 24,
                right: 24,
              }}
            >
              <AddIcon />
            </Fab>
          </Tooltip>
        </Zoom>
      )}

      {/* Formulario modal */}
      <ContractForm
        open={openForm}
        onClose={handleCloseForm}
        onSuccess={handleSuccess}
        contract={ContractStore.contract}
      />
    </Box>
  );
});

export default DataList;