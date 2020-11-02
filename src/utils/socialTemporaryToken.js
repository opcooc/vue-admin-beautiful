import { storage, temporaryTokenTableName } from '@/config/settings'

/**
 * @author opcooc
 * @description 获取TemporaryToken
 * @returns {string|ActiveX.IXMLDOMNode|Promise<any>|any|IDBRequest<any>|MediaKeyStatus|FormDataEntryValue|Function|Promise<Credential | null>}
 */
export function getTemporaryToken() {
  if (storage) {
    if ('localStorage' === storage) {
      return localStorage.getItem(temporaryTokenTableName)
    } else if ('sessionStorage' === storage) {
      return sessionStorage.getItem(temporaryTokenTableName)
    } else {
      return localStorage.getItem(temporaryTokenTableName)
    }
  } else {
    return localStorage.getItem(temporaryTokenTableName)
  }
}

/**
 * @author opcooc
 * @description 存储TemporaryToken
 * @param temporaryToken
 * @returns {void|*}
 */
export function setTemporaryToken(temporaryToken) {
  if (storage) {
    if ('localStorage' === storage) {
      return localStorage.setItem(temporaryTokenTableName, temporaryToken)
    } else if ('sessionStorage' === storage) {
      return sessionStorage.setItem(temporaryTokenTableName, temporaryToken)
    } else {
      return localStorage.setItem(temporaryTokenTableName, temporaryToken)
    }
  } else {
    return localStorage.setItem(temporaryTokenTableName, temporaryToken)
  }
}

/**
 * @author opcooc
 * @description 移除TemporaryToken
 * @returns {void|Promise<void>}
 */
export function removeTemporaryToken() {
  if (storage) {
    if ('localStorage' === storage) {
      return localStorage.removeItem(temporaryTokenTableName)
    } else if ('sessionStorage' === storage) {
      return sessionStorage.clear()
    } else {
      return localStorage.removeItem(temporaryTokenTableName)
    }
  } else {
    return localStorage.removeItem(temporaryTokenTableName)
  }
}
