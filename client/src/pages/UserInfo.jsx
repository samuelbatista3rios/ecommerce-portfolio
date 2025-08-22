import React, { Component } from 'react'
import '../style.css'

export default class UserInfo extends Component {
  render() {
    return (
      <div className="user-info">
            <div className="user-avatar">CT</div>
            <div>
              <div>Olá, Cliente Teste</div>
              <div>Seja bem-vindo à Cartálogo!</div>
            </div>
          </div>
    )
  }
}
