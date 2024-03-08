import { UIKitComponent } from './component'

export type location = {
  position: {
    lat: number,
    lng: number
  }
};

/** Script Editor Component */
export declare class ElMap extends UIKitComponent {
  /** list of markers to show on map */
  locations: location[]

  /** The initial zoom level of map */
  zoom: number

  /** width of the map component. */
  width: string | number

  /** height of map component. */
  height: string | number
}
