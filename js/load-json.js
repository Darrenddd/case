// load-json.js

// 1. 定义一个变量来缓存加载的 JSON 数据
let caseTitlesData = null;

// 2. 加载数据的核心函数，并返回一个 Promise
function loadCaseTitles() {
    const Base_Path = '';
    const jsonPath = Base_Path + '/data/case-titles.json';

    // 返回 fetch 及其后续操作的 Promise 链
    return fetch(jsonPath)
        .then(response => {
            if (!response.ok) {
                console.error(`Fetch 失败，状态码: ${response.status}`);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // 缓存数据
            caseTitlesData = data;
            console.log('JSON数据已加载并缓存。');
        })
        .catch(error => console.error('Error fetching case data:', error));
}

// 3. 页面加载后立即开始加载数据
const dataLoadingPromise = loadCaseTitles();


// 4. 优化后的标题设置函数：优先使用缓存数据，如果未加载则等待
function updateDialogTitle(targetPageId) {
    
    // 如果数据已缓存，则立即执行查找
    if (caseTitlesData) {
        _setDialogTitle(targetPageId, caseTitlesData);
        return;
    }

    // 如果数据尚未缓存，则等待加载 Promise 完成后再执行查找
    dataLoadingPromise.then(() => {
        if (caseTitlesData) {
            _setDialogTitle(targetPageId, caseTitlesData);
        } else {
            console.error('加载失败，无法设置标题。');
        }
    });
}

// 5. 内部辅助函数：处理查找和设置标题的逻辑
function _setDialogTitle(targetPageId, data) {
    const caseData = data.find(item => item.id === targetPageId);

    if (caseData) {
        // 设置页面标题 (H1)
        const h1Element = document.getElementById('case-title');
        if (h1Element) {
            h1Element.textContent = caseData.title_display;
            console.log('H1 标题已设置为:', caseData.title_display);
        }
    } else {
        console.error(`JSON数据中未找到匹配的 ID: ${targetPageId}`);
    }
}