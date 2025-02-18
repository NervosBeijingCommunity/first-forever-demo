import React from 'react'
import {
  Link
} from 'react-router-dom'
import BottomNav from '../../components/BottomNav'
import {
  simpleStoreContract
} from '../../simpleStore'
import cita from '../../cita-sdk'
require('./list.css')

const {
  REACT_APP_RUNTIME
} = process.env

const Record = ({
    time,
    text,
    hasYearLabel
  }) => {
    const _time = new Date(+time)
    return ( <
      div className = "list__record--container" > {
        hasYearLabel ? < div className = "list__record--year" > {
          _time.getFullYear()
        } < /div> : null} <
        span > {
          `${_time.getMonth() + 1}-${_time.getDate()} ${_time.getHours()}:${_time.getMinutes()}`
        } < /span> <
        Link to = {
          `/show/${time}`
        } >
        <
        div > {
          text
        } < /div> <
        /Link> <
        /div>
      )
    }

    class List extends React.Component {
      state = {
        times: [],
        texts: [],
      }
      componentDidMount() {
        const from =
          REACT_APP_RUNTIME === 'web' ?
          cita.base.accounts.wallet[0].address :
          REACT_APP_RUNTIME === 'cita-web-debugger' ?
          cita.base.defaultAccount :
          REACT_APP_RUNTIME === 'cyton' ?
          window.cyton.getAccount() : ''
        simpleStoreContract.methods
          .getList()
          .call({
            from,
          })
          .then(times => {
            times.reverse()
            this.setState({
              times
            })
            return Promise.all(times.map(time => simpleStoreContract.methods.get(time).call({
              from
            })))
          })
          .then(texts => {
            this.setState({
              texts
            })
          })
          .catch(console.error)
      }
      render() {
        const {
          times,
          texts
        } = this.state
        return ( <
          div className = "list__record--page" > {
            times.map((time, idx) => ( <
              Record time = {
                time
              }
              text = {
                texts[idx]
              }
              key = {
                time
              }
              hasYearLabel = {
                idx === 0 || new Date(+time).getFullYear() !== new Date(+times[idx - 1]).getFullYear()
              }
              />
            ))
          } <
          BottomNav active = {
            'list'
          }
          /> <
          /div>
        )
      }
    }
    export default List
