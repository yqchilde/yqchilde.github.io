/**
 * 获取 URL 路径中的指定参数
 *
 * @param paramName 参数名
 * @returns 参数值
 */
export function getQueryParam(paramName) {
    const reg = new RegExp("(^|&)" + paramName + "=([^&]*)(&|$)");
    let value = decodeURIComponent(window.location.search.substr(1)).match(reg);
    if (value != null) {
        return unescape(value[2]);
    }
    return null;
}

/**
 * 跳转到指定链接
 *
 * @param paramName 参数名
 * @param paramValue 参数值
 */
export function goToLink(url, paramName, paramValue) {
    if (paramName) {
        window.location.href = url + '?' + paramName + '=' + paramValue;
    } else {
        window.location.href = url;
    }
}
