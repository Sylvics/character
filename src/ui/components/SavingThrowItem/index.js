'use strict';

import React from 'react';
import Icon from '../Icon';
import Modal from '../Modal';
import ConfirmModal from '../../dialogs/ConfirmModal';
import { AbilityScores } from '../../constants';

export default React.createClass({
  displayName: 'SavingThrowItem',

  propTypes: {
    ability: React.PropTypes.string.isRequired,
    score: React.PropTypes.number.isRequired,
    proficient: React.PropTypes.bool.isRequired
  },


  getInitialState() {
    return {
      edit: false,
      confirm: false,
      dirty: false
    }
  },


  openEditModal() {
    this.setState({ edit: true });
  },


  makeDirty() {
    if (!this.state.dirty) {
      this.setState({ dirty: true });
    }
  },


  handleSave() {
    let proficient = this.refs.proficient.checked;

    if (proficient !== this.props.proficient) {
      this.props.onSavingThrowChange({ type: 'SAVING_THROW_EDIT', data: {
        ability: this.props.ability,
        proficient
      }});
    }

    this.setState({ edit: false, dirty: false, confirm: false });
  },


  getModalContent() {
    return <section>
      <div className='modal-header'><h3>{`${AbilityScores[this.props.ability].display} Saving Throw`}</h3></div>
      <div className='modal-content'>
        <div className='inputs'>
          <input id='proficient' type='checkbox' ref='proficient' defaultChecked={this.props.proficient} onChange={this.makeDirty}/>
          <label htmlFor='proficient'>Proficient</label>
        </div>
      </div>
      <div className='modal-footer'>
        <button onClick={this.handleSave} className='bg-green text-green'><Icon icon='fa fa-pencil'/> Save</button>
      </div>
    </section>
  },


  dismissEdit() {
    if (this.state.dirty) {
      this.setState({ confirm: true });
      return;
    }

    this.setState({ edit: false });
  },


  handleConfirm(answer) {
    if (answer === 'yes') {
      this.setState({ edit: false, dirty: false, confirm: false });
    }
    else {
      this.setState({ confirm: false });
    }
  },


  render() {

    return (
      <div className={`container-list-item ${this.props.proficient ? 'proficient' : ''}`} onClick={this.openEditModal}>
        <div className={`container-list-item-glyph text-${this.props.ability}`}>
          <Icon icon='fa fa-cube' />
        </div>
        <div className='container-list-item-content'>
          <span className='skill-item-name'>{AbilityScores[this.props.ability].display}</span>
        </div>
        <div className='container-list-item-content skill-item-score-container pull-right'>
          <span className='skill-item-score'>{this.props.score}</span>
        </div>
        <Modal id={`savingThrow-${this.props.ability}`} active={this.state.edit} content={this.getModalContent()} onDismiss={this.dismissEdit}/>
        <ConfirmModal active={this.state.confirm} onConfirm={this.handleConfirm}/>
      </div>
    )
  }
})