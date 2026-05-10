import { useState } from "react";
import ToastStore from "../store/ToastStore";

export const useImportExcel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const {
    showSuccess,
    showError,
    showLoading,
    showInfo,
    showWarning,
    dismissAll,
  } = ToastStore;

  const importExcel = async (file, onSuccess) => {
    if (!file) {
      showError("Por favor selecciona un archivo");
      return;
    }

    //const formData = new FormData();
    //formData.append('file', file);

    setIsLoading(true);

    const loadingToast = showLoading("Importando archivo...");

    try {
      const response = await onSuccess();

      dismissAll();

      // Mostrar resumen de importación
   
      const { success_count, error_count, errors } = response.data;

      if (error_count !== 0) {
        const errorMessage = `⚠️ Importación de datos \n✅ Éxitos: ${success_count}\n❌ Errores: ${error_count}`;

        showWarning(errorMessage, { duration: 4000 });

        // Mostrar detalles de errores
        if (errors && errors.length > 0) {
          console.error("Detalles de errores:", errors);
        }
      } else {
        // Mostrar resumen con errores
        showSuccess(
          `✅ Importación completada!\n📊 ${success_count} registros importados exitosamente`,
          { duration: 2000 },
        );
      }

   
      return response.data;
    } catch (error) {
      console.error("Error en importación:", error);
      showError(
        error.response?.data?.message || "Error al importar el archivo",
        { duration: 3000 },
      );
      dismissAll()
      throw error;
    } 
  };

  /*   const downloadTemplate = async () => {
    const loadingToast = showLoading('Generando plantilla...');
    
    try {
      const response = await excelService.downloadTemplate();
      
      // Crear blob y descargar
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Extraer nombre del archivo del header Content-Disposition
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'plantilla_ventas.xlsx';
      if (contentDisposition) {
        const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (match && match[1]) {
          filename = match[1].replace(/['"]/g, '');
        }
      }
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      showSuccess('Plantilla descargada exitosamente');
    } catch (error) {
      console.error('Error al descargar plantilla:', error);
      showError('Error al descargar la plantilla');
    } finally {
      // Remover toast de loading
    }
  };
 */
  return {
    importExcel,
    //downloadTemplate,
    isLoading,
    progress,
  };
};
