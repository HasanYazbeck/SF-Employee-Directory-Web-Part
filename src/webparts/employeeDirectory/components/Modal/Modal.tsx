import * as React from 'react';
import { IModalProps, IModalState } from '../Common/Modal/IModal';
import styles from '../Common/Modal/modal.module.scss';

export class Modal extends React.Component<IModalProps, IModalState> {
    public state: IModalState = {
        showModal: false
    };

    constructor(props: IModalProps) {
        super(props);
    }

  public render(): React.ReactElement<{}> {
    return (
        <div className={`modal show ${this.props.showModal ? 'd-block' : ''}`} tabIndex={-1}>
              <div className={`modal-dialog modal-dialog-centered ${this.props.modalClassSize !== undefined ? this.props.modalClassSize : 'modal-lg'}`}>
                <div className='modal-content'>
                  <div className={`modal-header ${styles.modalHeaderCustomPadding} `}>
                   {this.props.showModalTitle && <h5 className='modal-title text-dark'>{this.props.modalTitle}</h5>}
                    <button type='button' className={`${styles.close}`} data-dismiss='modal' aria-label='Close' onClick={this.props.onClose}>
                      <span aria-hidden='true'>&times;</span>
                    </button>
                  </div>
                  <div className='modal-body'>
                    {this.props.children}
                  </div>
                    {this.props.showSaveButton &&
                      <div className='modal-footer'>
                        <button type='button' style={{backgroundColor: '#675645'}} className='btn btn-primary'
                        onClick={this.props.onSave}>{this.props.buttonText !== undefined
                        ? this.props.buttonText : 'Save'}</button>
                     </div>
                    }
                </div>
              </div>
          </div>
    );
  }
}