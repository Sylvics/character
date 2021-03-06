

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import uuid from 'uuid/v1';
import ConfirmModal from '../../ConfirmModal';
import Modal from '../../../../components/Modal';
import Icon from '../../../../components/Icon';

export default class extends React.Component {
  static displayName = 'CreateNewResistance';

  static propTypes = {
    active: PropTypes.bool.isRequired,
    onCreate: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  };

  state = {
    confirm: false,
    dirty: false
  };

  makeDirty = () => {
    if (!this.state.dirty) {
      this.setState({ dirty: true });
    }
  };

  dismiss = () => {
    if (this.state.dirty) {
      this.setState({ confirm : true });
      return;
    }

    this.props.onCancel();
  };

  content = () => {
    return <section>
      <div className='modal-header'>
        <h3>
          <input type='text' onChange={this.makeDirty} placeholder='new resistance name' ref='name' />
        </h3>
      </div>
      <div className='modal-content'>
        <textarea onChange={this.makeDirty} placeholder='new resistance description' ref='desc'></textarea>
      </div>
      <div className='modal-footer'>
        <button onClick={this.save} className='text-green'><Icon icon='fa fa-pencil'/> Save</button>
        <button onClick={this.cancel} className='text-red'><Icon icon='fa fa-remove'/> Cancel</button>
      </div>
    </section>
  };

  save = () => {
    let name = this.refs.name.value.trim();
    let desc = this.refs.desc.value.trim();

    if (name !== '') {
      let id = `resistance-${uuid()}`;
      let data = { name, desc, id }
      this.props.onCreate({ type: 'RESISTANCES_CREATE', data });
    }

    this.props.onCancel();
  };

  cancel = () => {
    if (this.state.dirty) {
      this.setState({ confirm: true });
      return;
    }

    this.props.onCancel();
  };

  handleConfirm = (answer) => {
    if (answer === 'yes') {
      this.setState({ confirm: false });
      this.props.onCancel();
      return;
    }

    this.setState({ confirm: false });
  };

  render() {
    return (
      <span>
        <Modal active={this.props.active} id='create-new-resistance' content={this.content()} onDismiss={this.dismiss}/>
        <ConfirmModal active={this.state.confirm} onConfirm={this.handleConfirm} />
      </span>
    );
  }
}