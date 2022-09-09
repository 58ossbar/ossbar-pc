/**
 * 全局缓存名常量
 * 通过原型挂载到Vue属性
 * 通过 this.constant 调用
 *
 * 示例：console.log(this.constant.PKG_ID_FOR_AUTHIRUZATUIB)
   存入:
   localStorage.setItem(this.constant.PKG_ID_FOR_AUTHIRUZATUIB, '值')
   localStorage.setItem(this.constant.PKG_ID_SUBJECT_FOR_AUTHIRUZATUIB, '值')
   取出
   this.pkgId = localStorage.getItem(this.constant.PKG_ID_FOR_AUTHIRUZATUIB)
   this.subjectId = localStorage.getItem(this.constant.PKG_ID_SUBJECT_FOR_AUTHIRUZATUIB)
 */

/**
 * 正在授权中的教学包主键
 * @type {string}
 */
export const PKG_ID_FOR_AUTHIRUZATUIB = 'under_authorization_pkg_id'
export const PKG_ID_SUBJECT_FOR_AUTHIRUZATUIB = 'under_authorization_pkg_subject_id'

/**
 * 正在共建中的教学包
 * @type {string}
 */
export const PKG_ID_FOR_TOGETHER_BUILD = 'under_together_build_pkg_id'
export const PKG_ID_SUBJECT_FOR_TOGETHER_BUILD = 'under_together_build_pkg_subject_id'

/**
 * 修改中的教学包
 * @type {string}
 */
export const PKG_ID_FOR_UPDATE = 'under_updating_pkg_id'

export default {
  PKG_ID_FOR_AUTHIRUZATUIB,
  PKG_ID_SUBJECT_FOR_AUTHIRUZATUIB,
  PKG_ID_FOR_TOGETHER_BUILD,
  PKG_ID_SUBJECT_FOR_TOGETHER_BUILD,
  PKG_ID_FOR_UPDATE
}
