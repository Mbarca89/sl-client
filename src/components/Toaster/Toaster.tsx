// import toast from 'react-hot-toast';
import { toast } from 'react-toastify';
import Notification from '../Notification/Notification';

export const notifyError = (message:string) => {
    toast.error(message, {
        autoClose: 3000,
        position:'top-center',  
        style: {
            textAlign: 'center',
        },     
    });
}

export const notifySuccess = (message:string) => {
    toast.success(message, {
        autoClose : 3000,
        position:'top-center', 
        style: {
            textAlign: 'center',
        },      
    });
}

export const notifyTicket = (message: string) => {
  toast.success(message, {
    position: 'bottom-right',
    autoClose: false,
    closeButton: true,
    style: {
      textAlign: 'center',
    },
  });
}