// load-json.js (修改后)
// 移除 pageId 获取和 fetch 调用

function updateDialogTitle(targetPageId) {
    const Base_Path = '';
    const jsonPath = Base_Path + '/data/case-titles.json';

    // 2. 获取 JSON 数据并设置标题
    fetch(jsonPath)
        .then(response => {
            if (!response.ok) {
                console.error(`Fetch 失败，状态码: ${response.status}`);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const caseData = data[targetPageId]; // 使用传入的 targetPageId

            if (caseData) {
                // A. 设置浏览器标签页标题 (<title> 标签)
                // 暂时不设置，或者如果您想修改 index.html 的 title，可以保留
                // document.title = caseData.title_seo; 

                // B. 设置页面标题 (H1)
                const h1Element = document.getElementById('case-title');
                if (h1Element) {
                    h1Element.textContent = caseData.title_display;
                    console.log('H1 标题已设置为:', caseData.title_display);
                }
            } else {
                console.error(`JSON数据中未找到匹配的 key: ${targetPageId}`);
            }
        })
        .catch(error => console.error('Error fetching case data:', error));
}
// 注意：现在这个文件只包含这个函数定义