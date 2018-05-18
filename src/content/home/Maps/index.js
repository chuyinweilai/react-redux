
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import './index.css';
class HomeMaps extends Component{

  _set_pointer({x = 0, y = 0}){
    const pointer = document.querySelector(".Maps-Pointer");
    if(pointer){
      pointer.style.left = `${x}%`;
      pointer.style.top = `${y}%`;
      pointer.className = 'Maps-Pointer';
      pointer.className = 'Maps-Pointer animated flash';
      const removeClass = function(){ 
        pointer.className = 'Maps-Pointer';
      };
      pointer.addEventListener('webkitAnimationEnd',removeClass, false);
      pointer.addEventListener('animationend',removeClass, false);
    }
  }

  render(){
    const { pointer } = this.props;
    this._set_pointer(pointer);
    return (
      <div className="Home-Map-Box">
        <h3 className="Part-Title" >报警区域地图</h3>
        <div className="Home-Map">
          <div className="Maps-Pointer"></div>
        </div>
      </div>
    )
  }
}

HomeMaps.propTypes = {
	pointer: PropTypes.object.isRequired,
}

// state的值来自于todoApp
function select(arr) {
	let state = arr[arr.length-1];
	return {
		pointer: state.pointer,
	}
}

export default connect(select)(HomeMaps)