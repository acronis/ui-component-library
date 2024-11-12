import tableData from './data.mock.5.json';

class TestModel {
  constructor(attributes = {}) {
    Object.defineProperty(this, 'attributes', {
      value: attributes,
      configurable: false,
      writable: true
    });
  }

  get id() {
    return (this.attributes?.id || '').toString();
  }

  get name() {
    return this.attributes.name || this.id;
  }

  get date() {
    return this.attributes.date;
  }

  get state() {
    return this.attributes?.state || 'xxx';
  }

  get city() {
    return this.attributes.city;
  }

  get address() {
    return this.attributes.address;
  }

  get path() {
    return this.attributes.path;
  }

  get tag() {
    return this.attributes.tag;
  }
}

const data = tableData.map(item => new TestModel(item));
export default data;
