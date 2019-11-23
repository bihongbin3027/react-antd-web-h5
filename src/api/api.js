import Server from './server'
import { Toast } from 'antd-mobile'

class API extends Server {
  /**
   *  用途：微信回调
   *  @method get
   *  @return {promise}
   */
  async getWxOpenOauth2Url () {
    try {
      let result = await this.axios('get', '/wxjjb/auth/getWxOpenOauth2Url')
      if (result) {
        return result.data
      } else {
        let err = {
          tip: '微信回调失败',
          response: result,
          url: '/wxjjb/auth/getWxOpenOauth2Url'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：获取token
   *  @method get
   *  @return {promise}
   */
  async getWxToken (params = {}) {
    try {
      let result = await this.axios('get', '/wxjjb/auth/getWxToken', {
        params
      })
      if (result) {
        return result.data
      } else {
        let err = {
          tip: '获取token失败',
          response: result,
          url: '/wxjjb/auth/getWxToken'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：获取微信jsdk对象
   *  @method get
   *  @return {promise}
   */
  async getWXjsdk () {
    try {
      let result = await this.axios('get', '/wxjjb/auth/getWXjsdk')
      if (result) {
        return result.data
      } else {
        let err = {
          tip: '获取微信jsdk对象失败',
          response: result,
          url: '/wxjjb/auth/getWXjsdk'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：获取用户信息
   *  @method get
   *  @return {promise}
   */
  async getCurrentUser () {
    try {
      let result = await this.axios('get', '/wxjjb/auth/getCurrentUser')
      if (result) {
        return result
      } else {
        let err = {
          tip: '获取用户信息失败',
          response: result,
          url: '/wxjjb/auth/getCurrentUser'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：获取值班时间
   *  @method get
   *  @return {promise}
   */
  async watchDate (params) {
    try {
      let result = await this.axios('get', '/event/watchDate', {
        params
      })
      if (result) {
        return result.data
      } else {
        let err = {
          tip: '获取值班时间失败',
          response: result,
          url: '/event/watchDate'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：根据值班类型获取记录条数
   *  @method get
   *  @return {promise}
   */
  async getRotaLogCount (params = {}) {
    try {
      let result = await this.axios('get', '/rotaLog/getRotaLogCount', {
        params
      })
      if (result) {
        return result.data
      } else {
        let err = {
          tip: '值班类型获取条数失败',
          response: result,
          url: '/rotaLog/getRotaLogCount'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：获取值班日志列表
   *  @method post
   *  @return {promise}
   */
  async getRotaLogList (params = {}) {
    try {
      let result = await this.axios('post', '/rotaLog/getRotaLogList', {
        data: params
      })
      if (result) {
        return result.data
      } else {
        let err = {
          tip: '获取值班日志列表失败',
          response: result,
          url: '/rotaLog/getRotaLogList'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：删除值班日志草稿
   *  @method get
   *  @return {promise}
   */
  async delRotaLogDraft (params = {}) {
    try {
      let result = await this.axios('get', '/rotaLog/delRotaLogDraft', {
        params
      })
      if (result) {
        return result.data
      } else {
        let err = {
          tip: '删除值班日志草稿失败',
          response: result,
          url: '/rotaLog/delRotaLogDraft'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：获取值班日志详情
   *  @method get
   *  @return {promise}
   */
  async getRotaLogDetail (params = {}) {
    try {
      let result = await this.axios('get', '/rotaLog/getRotaLogDetail', {
        params
      })
      if (result) {
        return result.data
      } else {
        let err = {
          tip: '获取值班日志详情失败',
          response: result,
          url: '/rotaLog/getRotaLogDetail'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：修改值班日志
   *  @method get
   *  @return {promise}
   */
  async updateRotaLog (params = {}) {
    try {
      let result = await this.axios('post', '/rotaLog/updateRotaLog', {
        params
      })
      if (result) {
        return result.data
      } else {
        let err = {
          tip: '修改值班日志失败',
          response: result,
          url: '/rotaLog/updateRotaLog'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：获取部门的树形结构并且绑定部门用户列表
   *  @method get
   *  @return {promise}
   */
  async getTreeDeptAndUserList (params = {}) {
    try {
      let result = await this.axios('get', '/rotaLog/getTreeDeptAndUserList', {
        params
      })
      if (result) {
        return result.data
      } else {
        let err = {
          tip: '获取部门的树形结构失败',
          response: result,
          url: '/rotaLog/getTreeDeptAndUserList'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：添加值班日志
   *  @method post
   *  @return {promise}
   */
  async addRotaLog (params = {}) {
    try {
      let result = await this.axios('post', '/rotaLog/addRotaLog', {
        data: params
      })
      if (result) {
        return result.data
      } else {
        let err = {
          tip: '添加值班日志失败',
          response: result,
          url: '/rotaLog/addRotaLog'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：值班日志列表
   *  @method get
   *  @return {promise}
   */
  async eventList (params = {}) {
    try {
      let result = await this.axios('get', '/event/eventList', {
        params
      })
      if (result) {
        return result.data
      } else {
        let err = {
          tip: '获取值班日志列表失败',
          response: result,
          url: '/event/eventList'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：删除事件草稿
   *  @method get
   *  @return {promise}
   */
  async eventDelete (params = {}) {
    try {
      let result = await this.axios('get', '/event/delete', {
        params
      })
      if (result) {
        return result.data
      } else {
        let err = {
          tip: '删除事件草稿失败',
          response: result,
          url: '/event/delete'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：个人中心
   *  @method get
   *  @return {promise}
   */
  async brief (params = {}) {
    try {
      let result = await this.axios('get', '/event/brief', {
        params
      })
      if (result) {
        return result.data
      } else {
        let err = {
          tip: '获取个人中心失败',
          response: result,
          url: '/event/brief'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：获取首页办事项
   *  @method post
   *  @return {promise}
   */
  async getWaitCandleTask (params) {
    try {
      let result = await this.axios('post', '/rotaLog/getWaitCandleTask', {
        data: params
      })
      if (result.data) {
        return result.data
      } else {
        let err = {
          tip: '获取首页办事项失败',
          response: result,
          url: '/rotaLog/getWaitCandleTask'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：获取监督人、值班人员、二线领导、接班人信息
   *  @method get
   *  @return {promise}
   */
  async eventPerson (params = {}) {
    try {
      let result = await this.axios('get', '/event/eventPerson', {
        params
      })
      if (result) {
        return result.data
      } else {
        let err = {
          tip: '取监督人、值班人员、二线领导、接班人信息失败',
          response: result,
          url: '/event/eventPerson'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：提交事件
   *  @method post
   *  @return {promise}
   */
  async submitEvent (params = {}) {
    try {
      let result = await this.axios('post', `/event/event`, {
        data: params
      })
      if (result) {
        return result.data
      } else {
        let err = {
          tip: '提交事件失败',
          response: result,
          url: '/event/event'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：获取事务类型
   *  @method get
   *  @return {promise}
   */
  async eventType (params = {}) {
    try {
      let result = await this.axios('get', '/event/eventType', {
        params
      })
      if (result) {
        return result.data
      } else {
        let err = {
          tip: '获取事务类型失败',
          response: result,
          url: '/event/eventType'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：获取事务详情
   *  @method get
   *  @return {promise}
   */
  async eventDetail (params = {}) {
    try {
      let result = await this.axios('get', '/event/eventDetail', {
        params
      })
      if (result) {
        return result.data
      } else {
        let err = {
          tip: '获取事务详情失败',
          response: result,
          url: '/event/eventDetail'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：获取事件数量
   *  @method get
   *  @return {promise}
   */
  async eventCount (params = {}) {
    try {
      let result = await this.axios('get', '/event/eventCount', {
        params
      })
      if (result) {
        return result.data
      } else {
        let err = {
          tip: '获取事件数量失败',
          response: result,
          url: '/event/eventCount'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：事件编辑
   *  @method post
   *  @return {promise}
   */
  async eventEdit (params = {}) {
    try {
      let result = await this.axios('post', '/event/eventEdit', {
        data: params
      })
      if (result) {
        return result.data
      } else {
        let err = {
          tip: '事件编辑失败',
          response: result,
          url: '/event/eventEdit'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：是否显示我是值班人
   *  @method post
   *  @return {promise}
   */
  async ifWatch (params = {}) {
    try {
      let result = await this.axios('get', '/event/ifWatch', {
        params
      })
      if (result) {
        return result.data
      } else {
        let err = {
          tip: '是否显示我是值班人失败',
          response: result,
          url: '/event/ifWatch'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：设置值班人
   *  @method post
   *  @return {promise}
   */
  async eventWatch (params = {}) {
    try {
      let result = await this.axios('post', '/event/watch', {
        data: params
      })
      if (result) {
        return result.data
      } else {
        let err = {
          tip: '设置值班人失败',
          response: result,
          url: '/event/watch'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：查询排班表
   *  @method post
   *  @return {promise}
   */
  async getHandoverSchedulingByYears (params = {}) {
    try {
      let result = await this.axios('post', '/scheduling/getHandoverSchedulingByYears', {
        data: params
      })
      if (result) {
        return result.data
      } else {
        let err = {
          tip: '查询排班表失败',
          response: result,
          url: '/scheduling/getHandoverSchedulingByYears'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：获取排班表里面以保存的年份以及月份信息
   *  @method post
   *  @return {promise}
   */
  async getSchedulingAllYearAndMounth () {
    try {
      let result = await this.axios('post', '/scheduling/getSchedulingAllYearAndMounth')
      if (result) {
        return result.data
      } else {
        let err = {
          tip: '获取排班表里面以保存的年份以及月份信息失败',
          response: result,
          url: '/scheduling/getSchedulingAllYearAndMounth'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：获取排班表公告信息
   *  @method post
   *  @return {promise}
   */
  async getHandoverScheduleCfgInfo () {
    try {
      let result = await this.axios('post', '/scheduling/getHandoverScheduleCfgInfo')
      if (result) {
        return result.data
      } else {
        let err = {
          tip: '获取排班表公告信息失败',
          response: result,
          url: '/scheduling/getHandoverScheduleCfgInfo'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：获取指定日期的节假日信息
   *  @method get
   *  @return {promise}
   */
  async getHolidayInfo (params) {
    try {
      let result = await this.axios('get', '/wxjjb/auth/getHolidayInfo', {
        params
      })
      if (result) {
        return result.data
      } else {
        let err = {
          tip: '获取排班表公告信息失败',
          response: result,
          url: '/wxjjb/auth/getHolidayInfo'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：gps检测是否在指定范围内
   *  @method post
   *  @return {promise}
   */
  async getSignInResult (params) {
    try {
      let result = await this.axios('post', '/wechat/signIn/getSignInRangeResult', {
        data: params
      })
      if (result) {
        return result.data
      } else {
        let err = {
          tip: 'gps检测是否在指定范围内失败',
          response: result,
          url: '/getSignInRangeResult'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }
}

export default new API()
