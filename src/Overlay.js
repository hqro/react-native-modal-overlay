import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal, TouchableWithoutFeedback, View } from 'react-native'
import * as Animatable from 'react-native-animatable'

import styles from './Overlay.styles'

Animatable.Touchable = Animatable.createAnimatableComponent(TouchableWithoutFeedback)

class Overlay extends Component {
  static propTypes = {
    children: PropTypes.node,
    animationType: PropTypes.string,
    animationOutType: PropTypes.string,
    easing: PropTypes.string,
    visible: PropTypes.bool,
    closeOnTouchOutside: PropTypes.bool,
    onClose: PropTypes.func,
    containerStyle: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number,
    ]),
    childrenWrapperStyle: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number,
    ]),
    animationDuration: PropTypes.number,
  }

  static defaultProps = {
    children: null,
    animationType: 'fadeIn',
    animationOutType: 'fadeOut',
    easing: 'ease',
    visible: false,
    closeOnTouchOutside: false,
    onClose: () => {},
    animationDuration: 500,
  }

  state = {
    visible: this.props.visible,
    animationType: this.props.animationType,
    overlayAnimationType: 'fadeIn',
  }

  componentWillReceiveProps ({ visible, animationType }) {
    this.setState({ visible, animationType })
  }

  _hideModal = () => {
    const { animationOutType, animationDuration, onClose } = this.props

    this.setState({
      animationType: animationOutType,
      overlayAnimationType: animationOutType
    })

    let timer = setTimeout(() => {
      onClose()
      clearTimeout(timer)
      this.setState({ overlayAnimationType: 'fadeIn' })
    }, animationDuration - 100)
  }

  _stopPropagation = (e) => e.stopPropagation()

  render () {
    const {
      closeOnTouchOutside,
      animationDuration,
      children,
      containerStyle,
      childrenWrapperStyle,
      easing,
      ...props,
    } = this.props

    const {
      visible,
      overlayAnimationType,
      animationType,
    } = this.state

    return (
      <Modal
        transparent
        visible={visible}
        onRequestClose={this._hideModal}
        animationType='none'
        {...props}
      >
        <TouchableWithoutFeedback onPress={closeOnTouchOutside ? this._hideModal : null}>
          <Animatable.View
            animation={overlayAnimationType}
            duration={animationDuration}
            easing={easing}
            style={[styles.container, containerStyle]}
            useNativeDriver
          >
            <Animatable.Touchable
              animation={animationType}
              easing={easing}
              duration={animationDuration}
              onPress={this._stopPropagation}
              useNativeDriver
            >
              <View style={[styles.innerContainer, childrenWrapperStyle]}>
                {children}
              </View>
            </Animatable.Touchable>
          </Animatable.View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }
}

export default Overlay
