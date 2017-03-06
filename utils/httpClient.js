/**
 * http 请求封装
 */

import request from 'superagent';
import { notification } from 'antd';

/**
 * GET Method
 */
export function getRequest(reqObj) {
  request.get(reqObj.url)
    .query(reqObj.data)
    .end((err, res) => {
      if (res.status === 200) {
        reqObj.response.call(reqObj.context, err, res);
      } else {
        notification['warning']({
            message: '对不起,系统升级中',
            description: '如果系统长时间处于升级状态,请联系工程师们为您解决问题。'
          });
      }
    });
}

/**
 * POST Method
 */
export function postRequest(reqObj) {
  request.post()
}