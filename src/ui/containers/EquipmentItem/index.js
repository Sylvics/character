'use strict';

import React from 'react';
import ListItem from '../../components/ListItem/v2';
import Modal from '../../components/Modal';
import { createSaveBtn, createEditBtn, createRemoveBtn, createCancelBtn } from '../../components/Modal/buttons';
import ConfirmModal from '../../dialogs/ConfirmModal';

export default React.createClass({
  displayName: 'EquipmentItem',

  propTypes: {
    id: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    desc: React.PropTypes.string.isRequired,
    containers: React.PropTypes.array.isRequired,
    containerId: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired,
  },

  getInitialState() {
    return {
      viewDetails: false,
      editDetails: false,
      confirmDelete: false,
      confirmCancel: false,
      dirty: false,
    }
  },

  handleCancel() {
    if (this.state.dirty) {
      return this.setState({ confirmCancel: true });
    }

    this.state.editDetails
      ? this.setState({ editDetails: false, dirty: false })
      : this.setState({ viewDetails: false });
  },

  makeDirty() {
    if (!this.state.dirty) {
      this.setState({ dirty: true });
    }
  },

  handleConfirmDelete(answer) {
    switch (answer) {
      case 'no':
        return this.setState({ confirmDelete: false });
      case 'yes':
        this.props.onChange({
          type: 'EQUIPMENT_ITEM_DELETE',
          data: {
            id: this.props.id,
            containerId: this.props.containerId,
          }
        });

        this.setState({ confirmDelete: false, viewDetails: false });
    }
  },

  handleConfirmCancel(answer) {
    switch (answer) {
      case 'no':
        return this.setState({ confirmCancel: false });
      case 'yes':
        return this.setState({
          confirmCancel: false,
          editDetails: false,
          dirty: false,
        });
    }
  },

  saveChanges() {
    let name = this.nameInput.value.trim();
    let desc = this.descinput.value.trim();
    let containerId = this.containerSelect.value;
    let hasMoved = this.props.containerId !== containerId;

    if (name === '') return;

    if (name === this.props.name &&
        desc === this.props.desc &&
        !hasMoved) {
      return this.setState({ editDetails: false, dirty: false });
    }

    let data = {
      item: {
        id: this.props.id,
        name,
        desc,
      },
      hasMoved,
      container: {
        originalContainerId: this.props.containerId,
        id: containerId,
      }
    };

    this.props.onChange({
      type: 'EQUIPMENT_ITEM_EDIT',
      data,
    });

    this.setState({ editDetails: false, dirty: false });
  },

  renderItemEditDetails() {
    return <section>
      <div className='modal-header'>
        <h3>
          <input
            type='text'
            ref={ref => this.nameInput = ref}
            defaultValue={this.props.name}
            placeholder={this.props.name}
            onChange={this.makeDirty}
          />
        </h3>
      </div>
      <div className='modal-content'>
        <textarea
          ref={ref => this.descinput = ref}
          defaultValue={this.props.desc}
          placeholder={this.props.desc}
          onChange={this.makeDirty}
        ></textarea>
        <label htmlFor='containerSelect'>In container</label>
        <select
          id='containerSelect'
          ref={ref => this.containerSelect = ref}
          defaultValue={this.props.containerId}
          onChange={this.makeDirty}
        >
          {
            this.props.containers.map(container => {
              return <option
                key={container.id}
                value={container.id}
              >{container.name}</option>
            })
          }
        </select>
      </div>
      <div className='modal-footer'>
        { createSaveBtn(this.saveChanges) }
        { createCancelBtn(this.handleCancel) }
      </div>
    </section>
  },

  renderItemDetails() {
    return <section>
      <div className='modal-header'>
        <h3>{this.props.name}</h3>
      </div>
      <div className='modal-content'>
        <p>{this.props.desc}</p>
      </div>
      <div className='modal-footer'>
        { createEditBtn(() => this.setState({ editDetails: true })) }
        { createRemoveBtn(() => this.setState({ confirmDelete: true })) }
      </div>
    </section>
  },

  render() {
    let {
      name,
      id,
    } = this.props;

    return (
      <ListItem
        name={name}
        className='pl2'
        onClick={() => this.setState({ viewDetails: true })}
      >
        <Modal
          id={`view-${id}`}
          active={this.state.viewDetails}
          onDismiss={this.handleCancel}
          content={
            this.state.editDetails
              ? this.renderItemEditDetails()
              : this.renderItemDetails()
          }
        />
        <ConfirmModal
          active={this.state.confirmDelete}
          message={`Delete the item: ${name} ?`}
          onConfirm={this.handleConfirmDelete}
        />
        <ConfirmModal
          active={this.state.confirmCancel}
          onConfirm={this.handleConfirmCancel}
        />
      </ListItem>
    );
  },
});