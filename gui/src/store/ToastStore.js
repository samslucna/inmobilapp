import { makeAutoObservable } from "mobx";
import toast from 'react-hot-toast';
class ToastStore {

  constructor() {
    makeAutoObservable(this);
  }


  showSuccess = (message, options = {}) => {
    return toast.success(message, {
      icon: '✅',
      style: {
        background: '#10B981',
        color: '#fff',
        fontWeight: 'bold',
      },
      ...options
    });
  };

  showError = (message, options = {}) => {
    return toast.error(message, {
      icon: '❌',
      style: {
        background: '#EF4444',
        color: '#fff',
        fontWeight: 'bold',
      },
      duration: 5000,
      ...options
    });
  };

  showInfo = (message, options = {}) => {
    return toast(message, {
      icon: 'ℹ️',
      style: {
        background: '#3B82F6',
        color: '#fff',
        fontWeight: 'bold',
      },
      ...options
    });
  };

  showWarning = (message, options = {}) => {
    return toast(message, {
      icon: '⚠️',
      style: {
        background: '#F59E0B',
        color: '#fff',
        fontWeight: 'bold',
      },
      ...options
    });
  };

  showLoading = (message) => {
    return toast.loading(message, {
      style: {
        background: '#6366F1',
        color: '#fff',
      },
    });
  };

  showPromise = (promise, messages) => {
    return toast.promise(promise, {
      loading: messages.loading || 'Procesando...',
      success: messages.success || 'Operación exitosa',
      error: messages.error || 'Error en la operación',
    });
  };

  dismiss = (toastId) => {
    toast.dismiss(toastId);
  };

  dismissAll = () => {
    toast.dismiss();
  };


}

export default new ToastStore();
