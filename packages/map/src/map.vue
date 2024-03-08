<template>
  <div id="map" :style="style"></div>
</template>
<script>
import { Loader } from '@googlemaps/js-api-loader';
import { MarkerClusterer } from '@googlemaps/markerclusterer';

export default {
  name: 'ElMap',
  props: {
    locations: {
      type: Array,
      default: () => []
    },
    width: { type: [String, Number], default: '100%' },
    height: { type: [String, Number], default: '100%' },
    center: {
      type: Object,
      default: () => ({
        lat: 0,
        lng: 0
      })
    }
  },
  data() {
    return {
      markers: [],
      clusterer: null,
      infoWindow: null,
      google: null,
      mapReady: false,
      defaultZoom: 12,
      offlineColor: '#5C6673',
      onlineColor: '#407009',
      activeColor: '#2668C5'
    };
  },
  computed: {
    style() {
      return {
        width: !/^\d+$/.test(this.width) ? this.width : `${this.width}px`,
        height: !/^\d+$/.test(this.height) ? this.height : `${this.height}px`
      };
    },
    options() {
      return {
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true,
        disableDefaultUI: false,
        zoom: this.defaultZoom,
        mapId: 'eb00217f2c1017bd'
      };
    }
  },
  watch: {
    /*
      Watch the locations. When they are updated, clear the markers
      and re build them.
    */
    locations: {
      deep: true,
      handler() {
        this.mapReady && this.map.setZoom(this.defaultZoom);
        this.mapReady && this.drawMarkers();
      }
    }
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      new Loader({
      }).load().then(this.buildMap).catch((error) => console.error(error));
    },
    buildMap(google) {
      this.google = google;
      // init map with options
      this.map = new google.maps.Map(this.$el, {
        ...this.options,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });

      this.clusterer = new MarkerClusterer({ map: this.map });

      this.mapReady = true;
      this.infoWindow = new google.maps.InfoWindow();

      this.map.addListener('click', this.onMapListener);

      this.drawMarkers();
    },
    onMapListener() {
      this.infoWindow.close();
      this.resetMarkers();
    },
    resetMarkers() {
      for (let i = 0; i < this.markers.length; i++) {
        const marker = this.markers[i];
        marker.setIcon(this.setMarkerIcon(marker.status));
      }
    },
    setMarkerIcon(status) {
      // TODO: Rewrite require statements to ES6 syntax and make sure to include png files in build
      let url = '';
      // let url = require('packages/map/markers/offline.png');
      // if (status === 'active') {
      //   url = require('packages/map/markers/active.png');
      // } else if (status === 'online') {
      //   url = require('packages/map/markers/online.png');
      // }
      return {
        url,
        optimized: false
      };
    },

    /*
      Clear and re-build the markers
    */
    drawMarkers() {
      this.clearMarkers();
      this.buildMarkers();
    },
    clearMarkers() {
      for (let i = 0; i < this.markers.length; i++) {
        this.markers[i].setMap(null);
      }
      this.markers = [];
      this.clusterer && this.clusterer.clearMarkers();
    },
    buildMarkers() {
      // create bounds to adjust map according to list of locations
      const bounds = new this.google.maps.LatLngBounds();
      for (let i = 0; i < this.locations.length; i++) {
        const workload = this.locations[i];
        const {
          location: {
            lat,
            lng
          } = {},
          status
        } = workload;

        // create marker
        const marker = new this.google.maps.Marker({
          position: new this.google.maps.LatLng(lat, lng),
          map: this.map,
          icon: this.setMarkerIcon(status),
          status
        });

        this.markers.push(marker);
        this.clusterer && this.clusterer.addMarker(marker);

        ((markerPin, data) => {
          this.google.maps.event.addListener(markerPin, 'click', () => {
            // reset other active markers to original state
            this.resetMarkers();
            markerPin.setIcon(this.setMarkerIcon('active'));
            this.showMarkerInfo(data, markerPin);
          });
        })(marker, workload);
        bounds.extend(marker.position);
      }
      // Center map and adjust Zoom based on the position of all markers.
      if (this.locations.length > 0) {
        this.map.setCenter(bounds.getCenter());
        this.map.fitBounds(bounds);
      } else {
        this.adjustMapCenter();
      }
    },

    showMarkerInfo(location, marker) {
      const {
        name,
        status,
        lastseen
      } = location;

      const content = `
        <div class="info-window">
          <div class="header">
            <span class="el-text el-text--strong">
              ${name}
            </span>
            <span class="el-text el-text--body-24 status ${status}">
              ${status}
            </span>
          </div>

          <div class="body el-text el-text--body-24">
            Last location report
            <div>
              ${lastseen}
            </div>
          </div>
        </div>
      `;
      this.infoWindow.setContent(content);
      this.infoWindow.setOptions({
        minWidth: 263
      });
      this.infoWindow.open(this.map, marker);
    },
    adjustMapCenter() {
      if (!this.mapReady) return;
      const {
        lat,
        lng
      } = this.center;
      const center = new this.google.maps.LatLng(lat, lng);
      this.map.setCenter(center);
      this.map.panTo(center);
    }
  }
};
</script>

<style lang="scss">
  @import 'themes/acronis/src/common/variables.scss';
  .gm-style-iw > button {display: none !important;}
  .info-window {
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .status {
        border-radius: 12px;
        padding: 0px 8px;
        background: $av-fixed-lightest;
        color: $av-fixed-lighter;
        display: flex;
        align-items: center;
        height: 16px;
        &.online {
          background: $av-fixed-success;
          color: $av-fixed-success-dark;
        }
      }
    }
  }
</style>
