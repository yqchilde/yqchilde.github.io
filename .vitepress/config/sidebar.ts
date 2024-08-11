import type { DefaultTheme } from 'vitepress'
import fs from 'fs'
import fg from 'fast-glob'
import matter from 'gray-matter'
const sync = fg.sync;

export const sidebar: DefaultTheme.Sidebar = {
    '/blog': getItemsByDate('posts/blog'),
    '/review': getItemsByCategory('posts/review'),
    '/softs': getItemsByCategory('posts/softs'),
    '/workflow': getItemsByCategory('posts/workflow'),
    '/efficiency': getItemsByCategory('posts/efficiency'),
    '/reverse-engineering': getItemsByCategory('posts/reverse-engineering'),
}

// 定义新类型，继承DefaultTheme.SidebarItem，并增加新字段
export type SidebarItem = DefaultTheme.SidebarItem & {
    date?: string,
    sort?: number
};

// 根据 posts/分类/年份/标题/README.md的目录格式, 获取侧边栏分组及分组下标题
// 组成路由 => /分类/年份/标题
function getItemsByDate(path: string) {
    // 侧边栏年份分组数组
    let yearGroups: SidebarItem[] = [];
    // 置顶数组
    let topArticleItems: SidebarItem[] = [];

    // 1.获取所有年份目录
    sync(`${path}/*`, {
        onlyDirectories: true,
        objectMode: true,
    }).forEach(({ name }) => {
        let year = name;
        // 年份数组
        let articleItems: SidebarItem[] = [];

        // 2.获取所有月份目录
        sync(`${path}/${year}/*`, {
            onlyDirectories: true,
            objectMode: true,
        }).forEach(({ name }) => {
            let title = name;
            sync(`${path}/${year}/${title}/*.md`, {
                onlyDirectories: false,
                objectMode: true,
            }).forEach((article) => {
                const { data } = matter.read(`${article.path}`);
                if (data.isTop) {
                    // 向置顶分组前追加标题
                    topArticleItems.unshift({
                        text: data.title,
                        link: `/${path}/${year}/${title}`.replace('posts/', ''),
                        date: data.date,
                        sort: data.sort,
                    });
                }

                // 向年份分组前追加标题
                articleItems.unshift({
                    text: data.title,
                    link: `/${path}/${year}/${title}`.replace('posts/', ''),
                    date: data.date,
                    sort: data.sort,
                });
            })
        })

        // 添加年份分组
        yearGroups.unshift({
            text: `${year}年 (${articleItems.length}篇)`,
            items: articleItems,
            collapsed: true,
        });
    })

    if (topArticleItems.length > 0) {
        // 添加置顶分组
        yearGroups.unshift({
            text: `<svg style="display: inline-block; vertical-align: middle; padding-bottom: 3px;" viewBox="0 0 1920 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="30" height="30"><path d="M367.488 667.904h423.744v47.232H367.488v-47.232zM320.256 204.352h137.28v68.992h-137.28v-68.992zM367.488 754.112h423.744v48H367.488v-48zM693.76 204.352h137.984v68.992H693.76v-68.992zM507.008 204.352h137.28v68.992h-137.28v-68.992z" p-id="10749" fill="#d81e06"></path><path d="M1792.512 0H127.488C57.472 0 0 57.152 0 127.616v768.768C0 966.72 57.088 1024 127.488 1024h1665.088c69.952 0 127.424-57.152 127.424-127.616V127.616C1920 57.216 1862.912 0 1792.512 0z m-528 175.104h446.976v54.016H1494.72l-24 101.248h206.976V689.6h-57.728V384.32h-289.472v308.224h-57.728v-362.24h140.224l20.992-101.248h-169.472v-53.952z m-996.032-11.2h614.272v167.232h-51.008v-17.28H320.256v17.28H268.48V163.904z m678.784 681.728h-744v-43.52h111.744V454.848h229.504v-48.704H221.248v-42.048h323.264v-39.744h54.016v39.744h331.52v41.984h-331.52v48.768h245.248v347.264h103.488v43.52z m203.264-94.528c0 59.52-30.72 89.28-92.224 89.28-25.472 0-46.016-0.512-61.504-1.472-2.496-22.976-6.528-45.248-12.032-66.752 22.976 5.504 46.72 8.256 71.232 8.256 24 0 35.968-11.52 35.968-34.496V247.872H971.2v-54.72h278.976v54.72H1150.4v503.232z m521.216 121.536c-67.008-55.488-137.28-108.032-210.752-157.504-4.992 9.984-10.496 19.008-16.512 27.008-41.472 57.024-113.28 101.504-215.232 133.504-9.472-16.512-21.504-34.496-35.968-54.016 94.528-27.008 161.28-64.512 200.256-112.512 34.496-44.992 51.776-113.024 51.776-204.032V421.12h57.728v82.496c0 62.528-6.72 115.776-20.224 159.744 84.48 54.016 161.472 107.008 230.976 158.976l-42.048 50.304z" p-id="10750" fill="#d81e06"></path><path d="M367.488 495.36h423.744v47.232H367.488V495.36zM367.488 581.632h423.744v47.232H367.488v-47.232z" p-id="10751" fill="#d81e06"></path></svg>
            我的置顶 (${topArticleItems.length}篇)`,
            items: topArticleItems,
            collapsed: false,
        });

        // 将最近年份分组展开
        yearGroups[1].collapsed = false;
    } else {
        // 将最近年份分组展开
        yearGroups[0].collapsed = false;
    }

    // 添加序号
    sortArticleItems(yearGroups);
    return yearGroups;
}

// 根据 posts/分类/细分类/标题/README.md的目录格式, 获取侧边栏分组及分组下标题
// 组成路由 => /分类/细分类/标题
function getItemsByCategory(path: string) {
    // 侧边栏分组数组
    let groups: SidebarItem[] = [];
    // 侧边栏分组下标题数组
    let items: SidebarItem[] = [];
    let total = 0;
    // 当分组内文章数量少于 2 篇或文章总数显示超过 20 篇时，自动折叠分组
    const groupCollapsedSize = 2;
    const titleCollapsedSize = 20;

    // 1.获取所有分组目录
    sync(`${path}/*`, {
        onlyDirectories: true,
        objectMode: true,
    }).sort((a, b) => {
        if (fs.existsSync(`${a.path}/index.md`) && fs.existsSync(`${b.path}/index.md`)) {
            let aData = matter.read(`${a.path}/index.md`);
            let bData = matter.read(`${b.path}/index.md`);
            return aData.data.sort - bData.data.sort;
        }
        return 0;
    }).forEach(({ name }) => {
        let group = name;

        // 获取章节标题
        let chapter: string = '';
        let showChapterCount: boolean = true;
        let showChapterCountName: string = '';
        let needRoute: boolean = false;
        if (fs.existsSync(`${path}/${group}/index.md`)) {
            const { data } = matter.read(`${path}/${group}/index.md`);
            data.title !== undefined ? chapter = data.title : chapter = group;
            data.showChapterCount !== undefined ? showChapterCount = data.showChapterCount : showChapterCount = true;
            data.showChapterCountName !== undefined ? showChapterCountName = data.showChapterCountName : showChapterCountName = '篇';
            data.needRoute !== undefined ? needRoute = data.needRoute : needRoute = false;
        }

        // 2.获取分组下的所有文章
        sync(`${path}/${group}/*`, {
            onlyDirectories: true,
            objectMode: true,
        }).forEach(({ name }) => {
            let title = name;
            sync(`${path}/${group}/${title}/*.md`, {
                onlyFiles: true,
                objectMode: true,
            }).forEach((article) => {
                const { data } = matter.read(`${article.path}`);
                // 向前追加标题
                items.push({
                    text: data.title,
                    link: `/${path}/${group}/${title}`.replace('posts/', ''),
                    date: data.date,
                    sort: data.sort,
                });
                total += 1;
            })
        })

        groups.push({
            text: `${chapter !== '' ? chapter : group} ${showChapterCount && items.length > 0 ?  `(${items.length}${showChapterCountName})` : ''}`,
            link: `${needRoute ? `/${path}/${group}`.replace('posts/', '') : ''}`,
            items: items,
            // collapsed: items.length < groupCollapsedSize || total > titleCollapsedSize,
            collapsed: total > titleCollapsedSize,
        })

        // 4.清空侧边栏分组下标题数组
        items = [];
    });

    // 添加序号
    sortArticleItems(groups);
    return groups;
}

// 根据date 排序, 逆序
function sortArticleItems(groups: SidebarItem[]) {
    groups.forEach((group) => {
        (group.items as SidebarItem[] | undefined)?.sort((a, b) => {
            if (a.sort && b.sort) {
                return a.sort - b.sort;
            }

            if (a.date && b.date) {
                return new Date(b.date).getTime() - new Date(a.date).getTime()
            }
            return 0;
        });

        (group.items as SidebarItem[] | undefined)?.forEach((item) => {
            item.text = `📝 ${item.text}`;
            delete item.date;
        });
    });
}