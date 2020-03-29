// 定义 Github  信息
const github_Name = 'Your-Github-UserName'; //Github 用户名
const github_Repo = 'Your-Github-RepoName'; //Github 仓库名
const github_base = `${github_Name}/${github_Repo}`;

/* 配置到此结束 */


addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

async function bloghandle(request) {
    const urlObj = new URL(request.url);
    const path = urlObj.href.substr(urlObj.origin.length);
    const init = {
        method: "GET"
    };
    var data = '';
    if (path) {
        var url = "https://raw.githubusercontent.com/" + github_base + "/master" + path + '/index.html';
        const response = await fetch(url, init);
        var resptxt = await response.text();
        data += resptxt;
    } else {
        var url = "https://raw.githubusercontent.com/" + github_base + '/master/index.html';
        const response = await fetch(url, init);
        if (response.status == 200) {
            var resptxt = await response.text();
            data += resptxt.replace(/`/g, "\\`");
        } else {
            var url = "https://raw.githubusercontent.com/" + github_base + '/master/404.html';
            const response = await fetch(url, init);
            if (response.status == 200) {
                var resptxt = await response.text();
                data += resptxt.replace(/`/g, "\\`");
            } else {
                data += `404 Page Not Found!`;
            }
        }
    }
    return data;
}

/**
 * Respond to the request
 * @param {Request} request
 */
async function handleRequest(request) {
    var resp = new Response(await bloghandle(request), { "Content-type": "text/html;charset=UTF-8", status: 200 });
    resp.headers.set("Content-Type", "text/html");
    return resp;
}