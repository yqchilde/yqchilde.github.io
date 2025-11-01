// 获取 URL 路径中的指定参数
export function getQueryParam(paramName: string): string | null {
    const reg = new RegExp("(^|&)" + paramName + "=([^&]*)(&|$)");
    let value = decodeURIComponent(window.location.search.substr(1)).match(reg);
    if (value != null) {
        return unescape(value[2]);
    }
    return null;
}

// 跳转到指定链接
export function goToLink(url: string, paramName?: string, paramValue?: string): void {
    if (paramName) {
        window.location.href = url + '?' + paramName + '=' + paramValue;
    } else {
        window.location.href = url;
    }
}
