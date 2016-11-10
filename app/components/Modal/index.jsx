/* @flow weak */
import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import {
  Prompt,
  Confirm,
  CommandPalette,
  GitCommitView,
  GitStashView,
  GitUnstashView,
  GitResetView,
  GitTagView,
  GitMergeView,
  GitNewBranchView,
} from './modals'

var ModalContainer = (props) => {
  const {dispatch} = props;
  const hasModal = props.stack.length > 0;
  return hasModal ? <div className={cx('modals-container')}>
    { props.stack.map(modalConfig => {
      const {id, isActive, showBackdrop, position} = modalConfig;
        return isActive
        ? <div key={id} className={cx('modal-container', position,
            {'show-backdrop': showBackdrop})} >
            <Modal {...modalConfig} />
            <div className='backdrop'
               onClick={e=>dispatch({type:'MODAL_DISMISS'})}></div>
          </div>
        : null
    }) }
  </div> :null;
}
ModalContainer = connect(state => state.ModalState, null)(ModalContainer)


class Modal extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {modalType, content} = this.props

    var modalContent = function () {
      switch (modalType) {
        case 'GitCommit':
          return <GitCommitView {...this.props} />

        case 'GitStash':
          return <GitStashView {...this.props} />

        case 'GitUnstash':
          return <GitUnstashView {...this.props} />

        case 'GitTag':
          return <GitTagView {...this.props} />

        case 'GitMerge':
          return <GitMergeView {...this.props} />

        case 'GitNewBranch':
          return <GitNewBranchView {...this.props} />

        case 'GitResetHead':
          return <GitResetView {...this.props} />

        case 'Prompt':
          return <Prompt {...this.props} />

        case 'Confirm':
          return <Confirm {...this.props} />

        case 'CommandPalette':
          return <CommandPalette {...this.props} />

        default:
          return content
      }
    }.call(this)

    return <div className='modal'>{modalContent}</div>
  }

  dismiss = e => {
    if (e.keyCode === 27) {
      this.props.dispatch({type: 'MODAL_DISMISS'})
    }
  }

  componentDidMount () {
    window.addEventListener('keydown', this.dismiss)
  }

  componentWillUnmount () {
    // this.props.meta.reject()  // always reject any pending promise when unmount.
    window.removeEventListener('keydown', this.dismiss)
  }
}


export default ModalContainer;
