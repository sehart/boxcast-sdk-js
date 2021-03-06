//
// Copyright (c) BoxCast, Inc. and contributors. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for details.
//

const axios = require('axios');

import { API_ROOT } from '../config';
import { parseList } from '../utils';

export class BaseAuthenticatedRoute {
  get resourceBase() { throw new Error('NotImplemented'); }

  constructor(headers) {
    this.headers = headers;
  }

  list(params = {}) {
    var headers = Object.assign({params}, this.headers);
    return axios.get(`${API_ROOT}/${this.resourceBase}`, headers).then(parseList);
  }

  get(id) {
    if (!id) {
      return Promise.reject('id is required');
    }
    return axios.get(`${API_ROOT}/${this.resourceBase}/${id}`, this.headers).then((r) => r.data);
  }

  create(params = {}) {
    return axios.post(`${API_ROOT}/${this.resourceBase}`, params, this.headers).then((r) => r.data);
  }

  update(id, params = {}) {
    if (!id) {
      return Promise.reject('id is required');
    }
    return axios.put(`${API_ROOT}/${this.resourceBase}/${id}`, params, this.headers).then((r) => r.data);
  }

  destroy(id) {
    if (!id) {
      return Promise.reject('id is required');
    }
    return axios.delete(`${API_ROOT}/${this.resourceBase}/${id}`, this.headers).then((r) => r.data);
  }
}
