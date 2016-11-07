const DEV = process.env.NODE_ENV === 'development'

const play = (spot, m) => {
  const isSpotComponent = typeof spot === 'object'

  let componentName
  let displayName
  if (isSpotComponent) {
    componentName = spot.name
    displayName = spot.displayName || spot.name
  } else {
    displayName = spot
  }

  return {
    add(scenario, value) {
      let component = value
      if (typeof value === 'string') {
        component = {template: value}
      } else if (typeof value === 'function') {
        component = {render: value}
      }
      component.example = component.example || component.template

      // register spot component inscenario component
      if (isSpotComponent) {
        if (componentName) {
          component.components = component.components || {}
          if (component.components[componentName]) {
            DEV && console.error(`${componentName} is already registered in your scenario`)
          } else {
            component.components[componentName] = spot
          }
        } else {
          DEV && console.error(`You haven't either defined a name property or called .name() to set spot component name`)
        }
      }

      m.exports.spots = m.exports.spots || {}
      m.exports.spots[displayName] = m.exports.spots[displayName] || []
      m.exports.spots[displayName].push({
        scenario,
        component
      })
      return this
    },

    // update the spot title
    displayName(name) {
      displayName = name
      return this
    },

    // update the spot component name for registering in scenarion component
    name(name) {
      if (isSpotComponent) {
        componentName = name
        if (!displayName) displayName = name
      } else {
        DEV && console.error('.name() is only available when you use a component as play() argument')
      }
      return this
    }
  }
}

const configure = (array, m) => {
  m.exports.spots = m.exports.spots || {}
  m.exports.components = m.exports.components || {}
  array.forEach(item => {
    m.exports.spots = {...m.exports.spots, ...item.spots}
    m.exports.components = {...m.exports.components, ...item.components}
  })
}

export {
  play,
  configure
}
