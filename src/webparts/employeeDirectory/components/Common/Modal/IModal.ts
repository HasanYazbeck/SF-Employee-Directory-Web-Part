export interface IModalProps {
    showModal: boolean;
    buttonText?: string;
    showSaveButton?: boolean;
    showCloseButton?: boolean;
    showModalTitle?: boolean;
    modalTitle: string | undefined;
    onClose: () => void;
    onSave: () => void;
    modalClassSize?: 'modal-xl' | 'modal-lg' | 'modal-md' | 'modal-sm' | 
                     'modal-fullscreen' | 'modal-fullscreen-sm-down' | 
                     'modal-fullscreen-md-down' | 'modal-fullscreen-lg-down' | 
                     'modal-fullscreen-xl-down' | 'modal-fullscreen-xxl-down' |
                     'modal-fullscreen-lg-up' | 'modal-fullscreen-md-up' | 
                     'modal-fullscreen-sm-up' |'modal-fullscreen-xl-up' | 
                     'modal-fullscreen-xxl-up';
}

export interface IModalState {
    showModal: boolean;
}
