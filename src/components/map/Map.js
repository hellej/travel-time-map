import React from 'react'
import MapboxGL from 'mapbox-gl/dist/mapbox-gl.js'
import { connect } from 'react-redux'
import { initializeMap, updateCamera } from './../../reducers/mapReducer'
import { initialMapCenter, BASEMAPS } from './../../constants'

MapboxGL.accessToken = process.env.REACT_APP_MB_ACCESS || 'Mapbox token is needed in order to use the map'

class Map extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isReady: false,
      loaded: false,
      flying: false,
    }
  }

  map = null

  componentDidMount() {

    this.setupMapWindow()

    this.map = new MapboxGL.Map({
      container: this.mapContainer,
      style: BASEMAPS['JustBlack'].url,
      center: initialMapCenter,
      zoom: 10,
      boxZoom: false,
      trackResize: true
    })

    this.map.on('style.load', () => {
      console.log('map style loaded')
    })

    this.map.on('render', () => {
      if (!this.state.isReady) this.setState({ isReady: true })
    })

    this.map.on('load', () => {
      console.log('map loaded')
      this.setState({ loaded: true, isReady: true })
      // this.map.addControl(new MapboxGL.NavigationControl(), 'bottom-right')
      this.props.initializeMap()
    })

    this.map.on('moveend', () => {
      this.props.updateCamera(this.map.getCenter(), this.map.getZoom())
    })

  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.map) return

    if (!prevState.isReady && this.state.isReady) {
      console.log('map ready')
    }
  }

  setupMapWindow = () => {
    this.updateWindowDimensions()
    window.addEventListener('resize', this.updateWindowDimensions)
    window.addEventListener('orientationchange', this.updateWindowDimensions)
    this.mapContainer.addEventListener('touchmove', (e) => { e.preventDefault() }, { passive: false })
  }

  updateWindowDimensions = () => {
    if (!this.map) return
    this.forceUpdate()
    setTimeout(() => { this.resizeMap() }, 300)
  }

  resizeMap = () => {
    if (!this.map) return
    this.map.resize()
  }

  componentWillUnmount() {
    setTimeout(() => this.map.remove(), 300)
    window.removeEventListener('resize', this.updateWindowDimensions)
    window.removeEventListener('orientationchange', this.updateWindowDimensions)
  }

  render() {
    const mapstyle = {
      position: 'relative',
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
      margin: 0,
      width: '100%',
      height: window.innerHeight,
      overflow: 'hidden',
      touchAction: 'none'
    }

    const children = React.Children.map(this.props.children, child =>
      React.cloneElement(child, { map: this.map }))

    return (
      <div style={mapstyle} ref={el => { this.mapContainer = el }}>
        {this.state.isReady && this.map !== null && children}
      </div>
    )
  }
}

const mapDispatchToProps = {
  initializeMap,
  updateCamera,
}

const ConnectedMap = connect(null, mapDispatchToProps)(Map)
export default ConnectedMap
