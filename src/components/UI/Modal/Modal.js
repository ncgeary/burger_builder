import React, {Component} from 'react';

import classes from './Modal.module.css';
import Aux from '../../../hoc/Aux1/Aux1';
import Backdrop from '../Backdrop/Backdrop';

class Modal extends Component{
  // OPTIMIZED: to not update the OrderSummary when it is not needed

  shouldComponentUpdate(nextProps, nextState){
    return nextProps.show !== this.props.show || nextProps.children !== this.props.children;
  }

  componentWillUpdate(){
    console.log('[Model] WillUpdate');
  }


  render(){
    return(
      <Aux>
        <Backdrop show={this.props.show} clicked={this.props.modalClosed} />

        <div
          className={classes.Modal}
          style={{
            transform: this.props.show ? 'translateY(0)' : 'translateY(-100vh)',
            opacity: this.props.show ? '1':'0'
          }}>
            {this.props.children}
        </div>

      </Aux>

    );
  }
}

export default Modal;
