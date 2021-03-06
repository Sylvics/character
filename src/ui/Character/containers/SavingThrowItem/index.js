

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import Icon from '../../../components/Icon';
import Modal from '../../../components/Modal';
import ConfirmModal from '../../dialogs/ConfirmModal';
import { AbilityScores } from '../../constants';

export default class extends React.Component {
  static displayName = 'SavingThrowItem';

  static propTypes = {
    ability: PropTypes.string.isRequired,
    score: PropTypes.number.isRequired,
    proficient: PropTypes.bool.isRequired
  };

  state = {
    edit: false,
    confirm: false,
    dirty: false
  };

  openEditModal = () => {
    this.setState({ edit: true });
  };

  makeDirty = () => {
    if (!this.state.dirty) {
      this.setState({ dirty: true });
    }
  };

  handleSave = () => {
    let proficient = this.refs.proficient.checked;

    if (proficient !== this.props.proficient) {
      this.props.onSavingThrowChange({ type: 'SAVING_THROW_EDIT', data: {
        ability: this.props.ability,
        proficient
      }});
    }

    this.setState({ edit: false, dirty: false, confirm: false });
  };

  getModalContent = () => {
    return <section>
      <div className='modal-header'><h3>{`${AbilityScores[this.props.ability].display} Saving Throw`}</h3></div>
      <div className='modal-content'>
        <div className='inputs'>
          <input id='proficient' type='checkbox' ref='proficient' defaultChecked={this.props.proficient} onChange={this.makeDirty}/>
          <label htmlFor='proficient'>Proficient</label>
        </div>
      </div>
      <div className='modal-footer'>
        <button onClick={this.handleSave} className='text-green'><Icon icon='fa fa-pencil'/> Save</button>
      </div>
    </section>
  };

  dismissEdit = () => {
    if (this.state.dirty) {
      this.setState({ confirm: true });
      return;
    }

    this.setState({ edit: false });
  };

  handleConfirm = (answer) => {
    if (answer === 'yes') {
      this.setState({ edit: false, dirty: false, confirm: false });
    }
    else {
      this.setState({ confirm: false });
    }
  };

  render() {

    return (
      <div className={`container-list-item flex flex-center ${this.props.proficient ? 'proficient' : ''}`} onClick={this.openEditModal}>
        <div className={`skill-item-score flex flex-center mr2 bg-${this.props.ability}`}>
          {this.props.score}
        </div>
        <div className='container-list-item-content flex-auto'>
          <span className='skill-item-name'>{AbilityScores[this.props.ability].display}</span>
        </div>
        <Modal id={`savingThrow-${this.props.ability}`} active={this.state.edit} content={this.getModalContent()} onDismiss={this.dismissEdit}/>
        <ConfirmModal active={this.state.confirm} onConfirm={this.handleConfirm}/>
      </div>
    )
  }
}