import * as resource from './resources'

export default {
  getHeight: function(data) {
    return resource.HeightResource.get(data)
  }
}
